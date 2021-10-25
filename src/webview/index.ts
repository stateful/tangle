import { fromEvent, merge } from "rxjs";
import { map, pluck } from "rxjs/operators";
import * as Vrx from "vscoderx";

declare const acquireVsCodeApi: Function;

window.addEventListener("load", onload);

function onMsg(panel: string | null) {
  return (data: any) => {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(JSON.stringify(data)));
    const root = document.getElementById("root");
    if (root?.firstChild) {
      root?.insertBefore(div, root.firstChild);
      // root?.replaceChild(div, root.firstChild);
    } else {
      root?.appendChild(div);
    }
  };
}

function onload(event: Event) {
  const vscode = acquireVsCodeApi();

  const trigger = document.getElementById("trigger");
  if (trigger && vscode) {
    const label = trigger.getAttribute("value");
    const msg: any = { panel: label };
    if (typeof label === "string") {
      const eventName = `onPanel`;
      msg[eventName] = label;
    }

    // fromEvent(window, "message")
    //   .pipe(
    //     map((post: any) => post.data),
    //     pluck("vscoderx")
    //   )
    //   .subscribe(onMsg(label));

    const client = Vrx.forDOM("vscoderx", {}, window, vscode);
    // client.onAll(onMsg(label));
    client.on("panel", onMsg(label));
    client.on("countdown", onMsg(label));
    // client.transient.subscribe(onMsg(label));

    trigger.onclick = () => {
      client.broadcast(msg);
      // vscode.postMessage({ vscoderx: msg });
    };
  }
}
