export default interface WorkspaceInfo {
  filename: string;
  workspace: string;
  initFileOpened: Date;
  initWorkspaceOpened: Date;
  lastPushToServer: Date;
  statusInterval?: number;
}