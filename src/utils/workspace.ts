import { basename } from "path";
import * as vscode from "vscode";

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
  let trackTimeBy = config.get('trackTimeBy');

  switch (trackTimeBy) {
    case 'file':
      if (lastFileName !== filename) {
        extensionStorage.update('time', time);
      }
      break;

    case 'workspace':
      if (lastWorkSpaceName !== workspace) {
        extensionStorage.update('time', time);
      }
      break;

    default:
      if (lastFileName !== filename) {
        extensionStorage.update('time', time);
      }
      break;
  }
  // else
  // let the time be as it is. 
  // this means the file is being edited/or is on same workspace (depends on config setting) since last time fetched
  // so this remains unchanged
  return;
};
