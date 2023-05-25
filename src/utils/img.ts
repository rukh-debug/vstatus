import nodeHtmlToImage = require('node-html-to-image');
import { html, vscodeimg } from "./payload";
import * as vscode from "vscode";
import { formatDistanceToNow } from 'date-fns';

const compareTimes = (time1: Date): string => {
  return formatDistanceToNow(time1, { addSuffix: true });
};

const sizeFixer = (text1: string, text2: string): number => {
  let toIncrease = 0;
  const text1ConstantSize = 13;
  const text2ConstantSize = 10;

  if (text1.length > text1ConstantSize && text2.length <= text2ConstantSize) {
    toIncrease = (text1.length - text1ConstantSize) * 10;
  } else if (text2.length > text2ConstantSize && text1.length <= text1ConstantSize) {
    toIncrease = (text2.length - text2ConstantSize) * 10;
  } else if (text1.length > text1ConstantSize && text2.length > text2ConstantSize) {
    toIncrease = Math.max(text1.length - text1ConstantSize, text2.length - text2ConstantSize) * 10;
  }

  return toIncrease;
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

  // find the time since...
  const pastTime = new Date(time);
  const timeDifference = compareTimes(pastTime);

  return new Promise<void>((resolve, reject) => {
    // replace info in html with the info on extension storage.
    let finalhtml = html.replace("{{vscodeImg}}", vscodeimg);

    // determine the size of card
    let sizeToIncrease = sizeFixer(filename, workspace);
    console.log(sizeToIncrease);
    finalhtml = finalhtml.replace("{{width}}", (400 + sizeToIncrease).toString());
    finalhtml = finalhtml.replace("{{filename}}", filename);
    finalhtml = finalhtml.replace("{{workspace}}", workspace);
    finalhtml = finalhtml.replace("{{duration}}", timeDifference);

    // fetch the theme and make it.
    switch (config.get("theme")) {
      case "dark":
        finalhtml = finalhtml.replace("{{text-color}}", "#E7D7AD");
        finalhtml = finalhtml.replace("{{background-color}}", "#0d1117");
        break;
      case "white":
        finalhtml = finalhtml.replace("{{text-color}}", "black");
        finalhtml = finalhtml.replace("{{background-color}}", "#faf6f6");
        break;
      default:
        finalhtml = finalhtml.replace("{{text-color}}", "#E7D7AD");
        finalhtml = finalhtml.replace("{{background-color}}", "#0d1117");
        break;
    }


    nodeHtmlToImage({
      output: fileUri,
      html: finalhtml,
      quality: 100,
      transparent: true,
      puppeteerArgs: { defaultViewport: { width: 416 + sizeToIncrease, height: 120 } }
    }).then(() => {
      console.log("Image created");
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
};

