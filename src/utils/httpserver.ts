import * as vscode from 'vscode';
import * as http from 'http';
import * as fs from 'fs';

export const startServer = (context: vscode.ExtensionContext, port: number) => {
  const server = http.createServer((req, res) => {

    // Access the global storage uri for your extension
    const storageUri = context.globalStorageUri;
    // const fs = vscode.workspace.fs;
    const fileUri = vscode.Uri.joinPath(storageUri, 'vstatus.png').fsPath.toString();

    fs.access(fileUri, fs.constants.R_OK, (err) => {
      if (err) {
        res.statusCode = 404;
        res.end('Image not found');
        return;
      }

      const stream = fs.createReadStream(fileUri);

      stream.on('open', () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/jpeg');
        stream.pipe(res);
      });

      stream.on('error', () => {
        res.statusCode = 500;
        res.end('Error loading image');
      });
    });
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

};
