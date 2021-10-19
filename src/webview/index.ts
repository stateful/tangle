import { fromEvent, map, merge, pluck } from "rxjs";
import * as Vrx from "../lib/vrx";

declare const acquireVsCodeApi: Function;

window.addEventListener("load", onload);

function onMsg(data: any) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(JSON.stringify(data)));
  const root = document.getElementById("root");
  if (root?.firstChild) {
    root?.insertBefore(div, root.firstChild);
    // root?.replaceChild(div, root.firstChild);
  } else {
    root?.appendChild(div);
  }
}

function onload(event: Event) {
  const vscode = acquireVsCodeApi();
  // fromEvent(window, "message")
  //   .pipe(
  //     map((post: any) => post.data),
  //     pluck("vscoderx")
  //   )
  //   .subscribe(onMsg);

  const trigger = document.getElementById("trigger");
  if (trigger && vscode) {
    const label = trigger.getAttribute("value");
    const msg: any = { panel: label };
    if (typeof label === "string") {
      const eventName = `onPanel`;
      msg[eventName] = label;
    }

    const client = Vrx.forDOM("vscoderx", {}, window, vscode);
    client.on("countdown", onMsg);
    // client.transient.subscribe(onMsg);

    trigger.onclick = () => {
      client.broadcast(msg);
      // vscode.postMessage({ vscoderx: msg });
    };
  }
}
