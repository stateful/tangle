// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import {
  BehaviorSubject,
  distinctUntilChanged,
  from,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  scan,
  Subject,
  Subscription,
} from "rxjs";

const webviewOptions = {
  enableScripts: true,
  retainContextWhenHidden: true,
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "vscoderx-column-one",
    "VS Code RX Main",
    vscode.ViewColumn.One,
    webviewOptions
  );
  const baseAppUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, "/dist/webview/"))
  );
  panel.webview.html = getHtml(context, baseAppUri.toString(), "Main");

  const panelProviders: VrxProvider[] = [
    PanelViewProvider.register(context, "vscoderx-explorer-panel0", "0"),
    PanelViewProvider.register(context, "vscoderx-explorer-panel1", "1"),
    { webview: of(panel.webview) },
  ];

  // Publish posts
  // const countdown = 6;
  // const counter$ = timer(10000, 10000).pipe(take(countdown));
  // from(panelProviders.map((panel) => panel.webview))
  //   .pipe(
  //     mergeAll(),
  //     mergeMap((webview) => {
  //       return counter$.pipe(
  //         mergeMap((i) => {
  //           const msg = { onPost: countdown - 1 - i };
  //           return from(webview.postMessage(msg)).pipe(mapTo(msg));
  //         })
  //       );
  //     })
  //   )
  //   .subscribe();

  // Subscribe to posts
  const vrx = new Vrx("vscoderx");
  vrx.subscribe(panelProviders);

  context.subscriptions.push(
    vscode.commands.registerCommand("vscoderx.emit", () => {
      vrx.publish({ onCommand: "vscoderx.emit" });
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
    private readonly _identifier: string
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
    webviewView.webview.html = getHtml(this._context, baseAppUri.toString(), this._identifier);
    this._webview.next(webviewView.webview);
  }

  public static register(context: vscode.ExtensionContext, viewId: string, identifier: string) {
    const panelProvider = new PanelViewProvider(context, identifier);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(viewId, panelProvider));
    return panelProvider;
  }

  // public postMessage(msg: any) {
  //   this.webview?.postMessage(msg);
  // }

  public get webview() {
    return this._webview.asObservable();
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}

interface VrxProvider {
  webview: Observable<vscode.Webview>;
}

export class Vrx {
  private readonly _queue = new Subject<object>();
  private readonly _inbound = new BehaviorSubject<object>({});
  constructor(public readonly namespace: string) {}

  public publish(message: object) {
    this._queue.next(message);
  }

  public subscribe(providers: VrxProvider[]): Subscription {
    const webviews = providers.map((panel) => panel.webview);
    const merged$ = merge(...webviews);

    return merged$
      .pipe(
        map((webview) => {
          webview.onDidReceiveMessage((message) => {
            this._inbound.next(message);
          });
          return webview;
        }),
        mergeMap((webview) => {
          return merge(this._inbound, this._queue).pipe(
            scan((acc, one) => {
              return { ...acc, ...one };
            }, {}),
            map((message) => {
              from(webview.postMessage(message)).subscribe();
              return message;
            })
          );
        })
      )
      .subscribe(console.log);
  }
}
