import * as vscode from 'vscode';
import { workspaceinfo } from "./utils/workspace";
import { sendRequest } from "./utils/api";
import { getConfiguredValue } from './utils/userinput';

import WorkspaceInfo from './types/workspaceinfo';

export async function activate(context: vscode.ExtensionContext) {
	// get config settings.
	const config = vscode.workspace.getConfiguration("vstatus");
	let INTERVAL = config.get("interval");

	let SERVER = await getConfiguredValue('serverurl', 'Enter the server URL:');
	let APIKEY = await getConfiguredValue('apikey', 'Enter the API key:');

	console.log('vstatus started.');

	// function to fetch vscode workspace information and build image based on it.
	async function makeandbake() {
		let workspaceInfo = workspaceinfo(context);
		let finalBody = {
			...workspaceInfo,
			statusInterval: INTERVAL
		};

		//  here make a api call now
		SERVER = new URL("/api/servercom", SERVER).href;
		sendRequest(SERVER, finalBody, APIKEY)
			.catch((err) => {
				vscode.window.showErrorMessage(err.message);
			});
	}

	setTimeout(() => {
		setInterval(() => {
			makeandbake();
		}, Number(INTERVAL) * 1000);
	}, 300);

	let disposable = vscode.commands.registerCommand('vstatus.statuscheck', () => {
		vscode.window.showInformationMessage('vstatus working fine');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
