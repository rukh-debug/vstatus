import { basename } from "path";
import * as vscode from "vscode";
import WorkspaceInfo from "../types/workspaceinfo";

export const workspaceinfo = (context: vscode.ExtensionContext) => {
  // Access the extension's global storage
  const extensionStorage = context.globalState;

  let filename = "No file opened";
  let workspace = "idle";
  let time = new Date().getTime();
  let lastFileName = extensionStorage.get("filename");
  let lastWorkSpaceName = extensionStorage.get("workspace");

  if (vscode.window.activeTextEditor) {
    // save filename, workspace name and time in globalstorage
    filename = basename(vscode.window.activeTextEditor.document.fileName);
    workspace = vscode.workspace.name || "Unknown";
  }
  extensionStorage.update("filename", filename);
  extensionStorage.update("workspace", workspace);

  // console.log(vscode.window.activeTextEditor);
  // console.log(vscode.window.state);
  // console.log(vscode.window.tabGroups);

  // config
  const config = vscode.workspace.getConfiguration("vstatus");

  let initWorkspaceOpened;
  let initFileOpened;

  if (lastWorkSpaceName !== workspace) {
    // if workspace changes, reset init workspace opened time to now.
    extensionStorage.update("initWorkspaceOpened", time);
    // in that case we also have to reset the initFileOpened.
    extensionStorage.update("initFileOpened", time);
    // now get the values in vars
    initWorkspaceOpened = extensionStorage.get("initWorkspaceOpened");
    initFileOpened = extensionStorage.get("initFileOpened");
  } else {
    initWorkspaceOpened = extensionStorage.get("initWorkspaceOpened");
  }

  if (lastFileName !== filename) {
    extensionStorage.update("initFileOpened", time);
    initFileOpened = extensionStorage.get("initFileOpened");
  } else {
    initFileOpened = extensionStorage.get("initFileOpened");
  }

  // else
  // let the time be as it is. 
  // this means the file is being edited/or is on same workspace (depends on config setting) since last time fetched
  // so this remains unchanged
  const finalDataToResolve = {
    filename,
    workspace,
    initFileOpened: String(new Date(initFileOpened as number).valueOf()),
    initWorkspaceOpened: String(new Date(initWorkspaceOpened as number).valueOf()),
    lastPushToServer: String(new Date(time as number).valueOf())
  };
  console.log(finalDataToResolve);
  return finalDataToResolve;
};
