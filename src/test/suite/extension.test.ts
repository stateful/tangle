import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import * as ext from "../../extension";

describe("Extension", () => {
  vscode.window.showInformationMessage("Start all tests.");

  it("loads", async () => {
    const vscoderx = vscode.extensions.getExtension("activecove.vscoderx");
    assert.ok(vscoderx);
    const isActive = await vscoderx?.activate().then(() => vscoderx.isActive);
    assert.ok(isActive);
  });
});
