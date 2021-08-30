import { fromEvent, map, pluck } from "rxjs";

declare const acquireVsCodeApi: Function;

window.addEventListener("load", () => {
  const vscode = acquireVsCodeApi();
  fromEvent(window, "message")
    .pipe(
      map((post: any) => post.data),
      pluck("vscoderx")
    )
    .subscribe((data: any) => {
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
      const eventName = `onPanel`;
      msg[eventName] = label;
    }
    trigger.onclick = () => {
      vscode.postMessage({ vscoderx: msg });
    };
  }
});
