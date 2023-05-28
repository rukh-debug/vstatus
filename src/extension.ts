import * as vscode from 'vscode';
import { workspaceinfo } from "./utils/workspace";
import { sendRequest } from "./utils/api";
import { getConfiguredValue } from './utils/userinput';

import WorkspaceInfo from './types/workspaceinfo';

export async function activate(context: vscode.ExtensionContext) {
	// get config settings.
	const config = vscode.workspace.getConfiguration("vstatus");
	let INTERVAL = config.get("interval");


	console.log('vstatus started.');

	// function to fetch vscode workspace information and build image based on it.
	async function makeandbake() {
		//if user changes this setting, it should be fetched on next loop;
		let SERVER = await getConfiguredValue('serverurl', 'Enter the server URL for vstatus:');
		let APIKEY = await getConfiguredValue('vstatus_api_key', 'Enter the API key for vstatus:');

		let workspaceInfo = workspaceinfo(context);
		let finalBody = {
			...workspaceInfo,
			statusInterval: INTERVAL
		};

		//  here make a api call now
		SERVER = new URL("/api/servercom", SERVER).href;
		sendRequest(SERVER, finalBody, APIKEY)
			.catch((err) => {
				console.log(err);
				vscode.window.showErrorMessage(err.message);
				// show message from server aswell if its a response from the server
				err.response?.data?.message ? vscode.window.showErrorMessage(err.response.data.message) : null;
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
