// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFileSync } from "fs";
import path = require("path");
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
  of,
  pluck,
  scan,
  share,
  Subject,
  take,
  timer,
  withLatestFrom,
} from "rxjs";

const webviewOptions = {
  enableScripts: true,
  retainContextWhenHidden: true,
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "column-one",
    "VRX column-one",
    vscode.ViewColumn.One,
    webviewOptions
  );
  const baseAppUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, "/dist/webview/"))
  );
  panel.webview.html = getHtml(context, baseAppUri.toString(), "column-one");

  const panelProviders: VrxProvider[] = [
    PanelViewProvider.register(context, "panel-one"),
    PanelViewProvider.register(context, "panel-two"),
    { webview: of(panel.webview), identifier: panel.viewType },
  ];

  // Subscribe to posts
  const vrx = new Vrx<object>("vscoderx", panelProviders, {});

  // Subscribe to events
  vrx.on("panel", (msg) => console.log(`Listen to onPanel: ${msg}`));
  // vrx.onAll((msg) => console.log(`Listen to all: ${JSON.stringify(msg)}`));

  // Publish posts
  const countdown = 6;
  timer(1000, 10000)
    .pipe(
      take(countdown),
      map((i) => ({ onCountdown: countdown - 1 - i }))
    )
    .subscribe((msg) => {
      vrx.broadcast(msg);
    });

  context.subscriptions.push(
    vscode.commands.registerCommand("vscoderx.emit", () => {
      vrx.broadcast({ onCommand: "vscoderx.emit" });
    })
  );
}

function getHtml(context: vscode.ExtensionContext, baseAppUri: string, identifier: string) {
  const re = /app-ext-identifier/g;
  const html = readFileSync(`${context.extensionPath}/src/webview/index.html`).toString("utf-8");
  return html.replace("app-ext-path", baseAppUri).replace(re, identifier);
}

export class PanelViewProvider implements vscode.WebviewViewProvider, VrxProvider {
  public view?: vscode.WebviewView;
  private _webview = new Subject<vscode.Webview>();

  constructor(
    private readonly _context: vscode.ExtensionContext,
    public readonly identifier: string
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    webviewContext: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void {
    this.view = webviewView;
    const basePath = path.join(this._context.extensionPath, "/dist/webview/");

    webviewView.webview.options = {
      ...webviewOptions,
      localResourceRoots: [this._context.extensionUri],
    };
    const baseAppUri = webviewView.webview.asWebviewUri(vscode.Uri.file(basePath));
    webviewView.webview.html = getHtml(this._context, baseAppUri.toString(), this.identifier);
    this._webview.next(webviewView.webview);
  }

  public static register(context: vscode.ExtensionContext, identifier: string) {
    const panelProvider = new PanelViewProvider(context, identifier);
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(identifier, panelProvider)
    );
    return panelProvider;
  }

  public get webview() {
    return this._webview.asObservable();
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}

interface VrxProvider {
  webview: Observable<vscode.Webview>;
  identifier: string;
}

export class Vrx<T> {
  private readonly _outbound: Subject<T>;
  private readonly _inbound: BehaviorSubject<T>;
  private readonly _events: Subject<T>;
  private readonly _transient: Observable<T>;

  constructor(
    public readonly namespace: string,
    providers: VrxProvider[],
    public readonly defaultValue: T
  ) {
    this._outbound = new Subject<T>();
    this._inbound = new BehaviorSubject<T>(this.defaultValue);
    this._events = new Subject<T>();

    this._transient = this.register(providers);
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

  private fold(acc: T, one: T) {
    return { ...acc, ...one };
  }

  private fromEntries(accum: T, [k, v]: [string, any]) {
    const r: any = { ...accum };
    r[k] = v;
    return r as T;
  }

  private filterEvents(raw: T, filter = true) {
    const entries = Object.entries(raw);
    return entries
      .filter(([k, v]) => {
        const isPrefixed = k.indexOf("on") === 0;
        return filter ? isPrefixed : !isPrefixed;
      })
      .reduce(this.fromEntries, this.defaultValue);
  }

  private grouped() {
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

  private register(providers: VrxProvider[]): Observable<T> {
    const webviews = providers.map((panel) => panel.webview);
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

    const transient$ = merge(...webviews).pipe(
      map((webview) => {
        webview.onDidReceiveMessage((payload: any) => {
          const unpacked = payload[this.namespace];
          if (unpacked) {
            this._inbound.next(unpacked as T);
          }
        });
        return webview;
      }),
      mergeMap((webview) => {
        return transientGrouped$.pipe(
          scan(this.fold, this.defaultValue),
          mergeMap((transient) => {
            const namespaced: any = {};
            namespaced[this.namespace] = transient;
            return from(webview.postMessage(namespaced).then(() => transient));
          })
        );
      }),
      bufferCount(webviews.length),
      map((transient) => {
        return transient.reduce(this.fold, this.defaultValue);
      }),
      share()
    );

    const outEvent$ = outGrouped$.pipe(pluck("event"));

    merge(...webviews)
      .pipe(
        mergeMap((webview) => {
          return outEvent$.pipe(
            withLatestFrom(transient$),
            mergeMap(([event, transient]) => {
              const namespaced: any = {};
              namespaced[this.namespace] = { ...transient, ...event };
              return from(webview.postMessage(namespaced).then(() => event));
            })
          );
        })
      )
      .subscribe();

    transient$.subscribe();

    return transient$;
  }
}
