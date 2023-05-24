import nodeHtmlToImage = require('node-html-to-image');
import { html, vscodeimg } from "./payload";
import * as vscode from "vscode";
import { formatDistanceToNow } from 'date-fns';

const compareTimes = (time1: Date, time2: Date): string => {
  return formatDistanceToNow(time1, { addSuffix: true });
};

export const build = (context: vscode.ExtensionContext) => {

  // Access the global storage uri for your extension
  const storageUri = context.globalStorageUri;
  const extensionStorage = context.globalState;
  const fs = vscode.workspace.fs;
  const config = vscode.workspace.getConfiguration("vstatus");


  // determine the image type
  let IMAGE_TYPE = config.get('imageType');
  let imageName = "vstatus.png";
  switch (IMAGE_TYPE) {
    case "jpeg":
    case "jpg":
      imageName = "vstatus.jpeg";
      break;
    case "png":
      imageName = "vstatus.png";
      break;
    default:
      // Handle other image types or set a default value if needed
      break;
  }

  // make sure the path is created
  fs.createDirectory(storageUri);
  const fileUri = vscode.Uri.joinPath(storageUri, imageName).fsPath.toString();

  // get values from global state
  const filename = String(extensionStorage.get("filename"));
  const workspace = String(extensionStorage.get("workspace"));
  const time = Number(extensionStorage.get("time"));


  const currentTime = new Date();
  const pastTime = new Date(time);

  const timeDifference = compareTimes(pastTime, currentTime);

  return new Promise<void>((resolve, reject) => {
    // replace info in html with the info on extension storage.
    let finalhtml = html.replace("{{vscodeImg}}", vscodeimg);
    finalhtml = finalhtml.replace("{{filename}}", filename);
    finalhtml = finalhtml.replace("{{workspace}}", workspace);
    finalhtml = finalhtml.replace("{{duration}}", timeDifference);

    // fetch the theme
    if (config.get("theme") === "dark") {
      finalhtml = finalhtml.replace("color: black;", "color: white;");
      finalhtml = finalhtml.replace("background-color: #faf6f6;", "background-color: #0d1117;");
    }


    nodeHtmlToImage({
      output: fileUri,
      html: finalhtml,
      quality: 100,
      transparent: true,
      puppeteerArgs: { defaultViewport: { width: 416, height: 120 } }
    }).then(() => {
      console.log("Image created");
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
};