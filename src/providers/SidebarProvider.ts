import * as vscode from "vscode";
import { getAuthPageHTML } from "../pages/authHTML";
import { getDashboardHTMLPage } from "../pages/dashboardHTML";
import { AuthService } from "../services/AuthService";
import { FileService } from "../services/FileService";

export class IntegrateSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "integrate.mainView";
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext,
    private readonly _apiUrl: string,
    private readonly _authService: AuthService,
    private readonly _fileService: FileService
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    this.checkAuthAndRender();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      if (data.command === "authenticate") {
        await this.handleAuth(data.authToken, data.email);
      } else if (data.command === "refreshAPIs") {
        await this.fetchAndSendAPIs();
      } else if (data.command === "logout") {
        await this.handleLogout();
      }
    });
  }

  private async fetchAndSendAPIs() {
    try {
      const token = await this._context.secrets.get("integrate.authToken");
      const projectId = vscode.workspace
        .getConfiguration("integrate")
        .get<string>("projectId");

      const response = await fetch(
        `${this._apiUrl}/projects/${projectId}/apis`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = (await response.json()) as { apis: [] };
        this._view!.webview.postMessage({
          command: "updateAPIs",
          data: data.apis || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch APIs:", error);
    }
  }

  private async handleLogout() {
    await this._authService.logout();
    this._view!.webview.html = this.getAuthHTML();
    vscode.window.showInformationMessage("Logged out");
  }

  private async checkAuthAndRender() {
    const isAuth = await this._authService.isAuthenticated();
    this._view!.webview.html = isAuth
      ? this.getDashboardHTML()
      : this.getAuthHTML();
  }

  private async handleAuth(authToken: string, email: string) {
    const result = await this._authService.authenticate(authToken, email);

    if (result.success && result.projectId) {
      await vscode.workspace
        .getConfiguration("integrate")
        .update("projectId", result.projectId, true);

      if (result.projectName) {
        await vscode.workspace
          .getConfiguration("integrate")
          .update("projectName", result.projectName, true);
      }

      if (result.files && result.files.length > 0) {
        await this._fileService.downloadProjectFiles(result.files);
      }

      this._view!.webview.html = this.getDashboardHTML();
      vscode.window.showInformationMessage(
        `Connected to ${result.projectName}!`
      );
    } else {
      this._view!.webview.postMessage({
        command: "authError",
        message: result.error || "Authentication failed",
      });
    }
  }
  private getAuthHTML() {
    return getAuthPageHTML();
  }

  private getDashboardHTML() {
    return getDashboardHTMLPage();
  }
}
