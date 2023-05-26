import * as vscode from 'vscode';

export async function getConfiguredValue(configKey: string, userInputPrompt: string): Promise<string> {
  const config = vscode.workspace.getConfiguration("vstatus");
  let value = config.get(configKey);

  if (!value) {
    value = await vscode.window.showInputBox({
      prompt: userInputPrompt,
    });
  }

  return value as any;
}
