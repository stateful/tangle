// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { readFileSync } from "fs";
import path = require("path");
import * as vscode from "vscode";
import { map, of, Subject, take, timer } from "rxjs";
import { VrxProvider, Vrx } from "./lib/vrx";

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
