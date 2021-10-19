import * as vscode from "vscode";
import {
  BehaviorSubject,
  bufferCount,
  filter,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  pairwise,
  pluck,
  scan,
  share,
  startWith,
  Subject,
  take,
  tap,
  toArray,
  withLatestFrom,
} from "rxjs";

export interface WebviewProvider {
  webview: Observable<vscode.Webview>;
  identifier: string;
}

export interface Provider {
  onMessage: (listener: EventListener) => void;
  postMessage: (message: any) => Promise<void>;
}

export function forWebviews<T>(namespace: string, defaultValue: T, wvProviders: WebviewProvider[]) {
  return merge(...wvProviders.map((wv) => wv.webview)).pipe(
    take(wvProviders.length),
    toArray(),
    map((wvs) => {
      return wvs.map((wv) => {
        const provider: Provider = {
          onMessage: (listener) => {
            wv.onDidReceiveMessage((event) => {
              listener(event);
            });
          },
          postMessage: (message) => {
            return new Promise((resolve) => {
              wv.postMessage(message).then(() => resolve());
            });
          },
        };
        return provider;
      });
    }),
    map((providers) => {
      return new Bus<T>(namespace, defaultValue, providers);
    })
  );
}

export function forDOM<T>(
  namespace: string,
  defaultValue: T,
  window: Window,
  vscode: { postMessage: (message: any) => void }
) {
  const provider: Provider = {
    onMessage: (listener: EventListener) => {
      window.addEventListener("message", (event) => listener(event.data));
    },
    postMessage: (message: any) => {
      vscode.postMessage(message);
      return Promise.resolve();
    },
  };

  return new Client<T>(namespace, defaultValue, [provider]);
}

export class Client<T> {
  protected readonly _outbound: Subject<T>;
  protected readonly _inbound: BehaviorSubject<T>;
  protected readonly _events: Subject<T>;

  protected readonly _transient: Observable<T>;

  constructor(
    public readonly namespace: string,
    public readonly defaultValue: T,
    public readonly providers: Provider[]
  ) {
    this._outbound = new Subject<T>();
    this._inbound = new BehaviorSubject<T>(this.defaultValue);
    this._events = new Subject<T>();

    this._transient = this.register();
  }

  public get events() {
    return this._events.asObservable().pipe(share());
  }

  public get transient() {
    return this._transient;
  }

  public broadcast(transient: T) {
    this._outbound.next(transient);
  }

  public on(eventName: string, fn: (...args: any[]) => void) {
    this.events
      .pipe(
        mergeMap((events) => from(Object.entries(events))),
        filter(([k]) => k.toLowerCase().indexOf(eventName.toLowerCase()) >= 0),
        map(([_, v]) => v)
      )
      .subscribe(fn);
  }

  public onAll(fn: (...args: any[]) => void) {
    this.events.subscribe(fn);
  }

  protected register() {
    const providers = from(this.providers);
    const inGrouped$ = this._inbound.pipe(
      // tap((event) => console.log(`inbound: ${JSON.stringify(event)}`)),
      this.grouped()
    );
    const outGrouped$ = this._outbound.pipe(this.grouped());

    const transientGrouped$ = merge(
      inGrouped$.pipe(pluck("transient")),
      outGrouped$.pipe(pluck("transient"))
    );

    const inEvent$ = inGrouped$.pipe(pluck("event"));
    inEvent$.subscribe((event) => {
      this._events.next(event);
    });

    const transient$ = merge(providers).pipe(
      this.fromProviders(),
      mergeMap((_provider) => {
        return transientGrouped$.pipe(scan(this.fold, this.defaultValue));
      }),
      bufferCount(this.providers.length),
      map((transient) => {
        return transient.reduce(this.fold, this.defaultValue);
      }),
      share()
    );
    const outEvent$ = outGrouped$.pipe(pluck("event"));

    merge(providers)
      .pipe(
        mergeMap((provider) => {
          return outEvent$.pipe(
            withLatestFrom(transient$),
            mergeMap(([event, transient]) => {
              const namespaced: any = {};
              namespaced[this.namespace] = { ...transient, ...event };
              return from(provider.postMessage(namespaced).then(() => event));
            })
          );
        })
      )
      .subscribe();

    transient$.subscribe();

    return transient$;
  }

  protected fromProviders() {
    return (source: Observable<Provider>) => {
      return source.pipe(
        map((provider) => {
          provider.onMessage((payload: any) => {
            const unpacked = payload[this.namespace];
            if (unpacked) {
              const payload = unpacked as T;
              console.log(payload);
              this._inbound.next(payload);
            }
          });
          return provider;
        })
      );
    };
  }

  protected dedupe() {
    return (source: Observable<T>) => {
      return source.pipe(
        startWith(this.defaultValue),
        pairwise(),
        filter(([prev, curr]) => JSON.stringify(prev) !== JSON.stringify(curr)),
        map(([_, curr]) => curr)
      );
    };
  }

  protected fold(acc: T, one: T) {
    return { ...acc, ...one };
  }

  protected fromEntries(accum: T, [k, v]: [string, any]) {
    const r: any = { ...accum };
    r[k] = v;
    return r as T;
  }

  protected grouped() {
    return (source: Observable<T>) => {
      return source.pipe(
        map((payload) => {
          const entries = Object.entries(payload);
          const grouped: { transient?: T; event?: T }[] = entries.map((entry) => {
            const isPrefixed = entry[0].indexOf("on") === 0;
            const obj = this.fromEntries(this.defaultValue, entry);
            if (isPrefixed) {
              return { event: obj };
            }
            return { transient: obj };
          });
          return grouped;
        }),
        map((grouped) => {
          return {
            transient: grouped.reduce((accum, one) => {
              return { ...accum, ...one.transient };
            }, this.defaultValue),
            event: grouped.reduce((accum, one) => {
              return { ...accum, ...one.event };
            }, this.defaultValue),
          };
        })
      );
    };
  }
}

export class Bus<T> extends Client<T> {
  // private fromWebviews() {
  //   return (source: Observable<vscode.Webview>) => {
  //     return source.pipe(
  //       map((webview) => {
  //         webview.onDidReceiveMessage((payload: any) => {
  //           const unpacked = payload[this.namespace];
  //           if (unpacked) {
  //             this._inbound.next(unpacked as T);
  //           }
  //         });
  //         return webview;
  //       })
  //     );
  //   };
  // }
  protected register(): Observable<T> {
    // const webviews = this.providers.map((panel) => panel.webview);
    const providers = from(this.providers);
    const inGrouped$ = this._inbound.pipe(this.grouped());
    const outGrouped$ = this._outbound.pipe(this.grouped());

    const transientGrouped$ = merge(
      inGrouped$.pipe(pluck("transient")),
      outGrouped$.pipe(pluck("transient"))
    );

    const inEvent$ = inGrouped$.pipe(pluck("event"));
    inEvent$.subscribe((event) => {
      this._events.next(event);
    });

    const transient$ = merge(providers).pipe(
      this.fromProviders(),
      mergeMap((provider) => {
        return transientGrouped$.pipe(
          scan(this.fold, this.defaultValue),
          mergeMap((transient) => {
            const namespaced: any = {};
            namespaced[this.namespace] = transient;
            return from(provider.postMessage(namespaced).then(() => transient));
          })
        );
      }),
      bufferCount(this.providers.length),
      map((transient) => {
        return transient.reduce(this.fold, this.defaultValue);
      }),
      share()
    );

    const outEvent$ = outGrouped$.pipe(pluck("event"));

    outEvent$
      .pipe(
        withLatestFrom(transient$),
        map(([event, transient]) => {
          return { ...transient, ...event };
        }),
        this.dedupe(),
        map((combo) => {
          const namespaced: any = {};
          namespaced[this.namespace] = combo;

          this.providers.forEach((provider) => {
            provider.postMessage(namespaced);
          });
        })
      )
      .subscribe();

    transient$.subscribe();

    return transient$;
  }
}
