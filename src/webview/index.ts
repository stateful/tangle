import { fromEvent } from "rxjs";

declare const acquireVsCodeApi: Function;

window.addEventListener("load", () => {
  const vscode = acquireVsCodeApi();
  fromEvent(window, "message").subscribe((post: any) => {
    const data = post.data["vscoderx"];
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(JSON.stringify(data)));
    const root = document.getElementById("root");
    if (root?.firstChild) {
      root?.insertBefore(div, root.firstChild);
      // root?.replaceChild(div, root.firstChild);
    } else {
      root?.appendChild(div);
    }
  });

  const trigger = document.getElementById("trigger");
  if (trigger) {
    const label = trigger.getAttribute("value");
    const msg: any = { panel: label };
    if (typeof label === "string") {
      msg[label] = true;
    }
    trigger.onclick = () => {
      vscode.postMessage({ vscoderx: msg });
    };
  }
});
