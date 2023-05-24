import * as vscode from 'vscode';
import { build } from "./utils/img";
import { workspaceinfo } from "./utils/workspace";
import { startServer } from "./utils/httpserver";

export function activate(context: vscode.ExtensionContext) {
	// get config settings.
	const config = vscode.workspace.getConfiguration("vstatus");
	let INTERVAL = config.get('interval');
	let PORT = config.get("serverPort");

	console.log('vstatus started.');

	// function to fetch vscode workspace information and build image based on it.
	async function makeandbake() {
		let workspaceInfo = workspaceinfo(context);
		await build(context);
	}

	setTimeout(() => {
		setInterval(() => {
			makeandbake();
		}, Number(INTERVAL) * 1000);
	}, 300);

	// launch the server
	startServer(context, Number(PORT));

	let disposable = vscode.commands.registerCommand('vstatus.statuscheck', () => {
		vscode.window.showInformationMessage('vstatus working fine');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
