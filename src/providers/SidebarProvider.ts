import * as vscode from "vscode";

export class IntegrateSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "integrate.mainView";
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context: vscode.ExtensionContext,
    private readonly _apiUrl: string
  ) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    this.checkAuthAndRender();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      if (data.command === "authenticate") {
        await this.handleAuth(data.authToken, data.email);
      }
    });
  }

  private async checkAuthAndRender() {
    const token = await this._context.secrets.get("integrate.authToken");

    if (!token) {
      this._view!.webview.html = this.getAuthHTML();
    } else {
      this._view!.webview.html = this.getDashboardHTML();
    }
  }

  private async handleAuth(authToken: string, email: string) {
    try {
      const response = await fetch(`${this._apiUrl}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authToken, email }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          projectId?: string;
          message?: string;
        };

        await this._context.secrets.store("integrate.authToken", authToken);
        await this._context.secrets.store("integrate.userEmail", email);

        if (data.projectId) {
          await vscode.workspace
            .getConfiguration("integrate")
            .update("projectId", data.projectId, true);
        }

        this._view!.webview.html = this.getDashboardHTML();
        vscode.window.showInformationMessage("Successfully connected!");
      } else {
        this._view!.webview.postMessage({
          command: "authError",
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      this._view!.webview.postMessage({
        command: "authError",
        message: "Connection failed",
      });
    }
  }
  private getAuthHTML() {
    return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { padding: 20px; font-family: var(--vscode-font-family); }
      input { width: 100%; padding: 8px; margin: 10px 0; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); }
      button { width: 100%; padding: 10px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; margin-top: 10px; }
      .error { color: var(--vscode-errorForeground); margin-top: 10px; }
    </style>
  </head>
  <body>
    <h2>Connect to Integrate</h2>
    <input type="email" id="email" placeholder="Your Gmail" />
    <input type="password" id="authToken" placeholder="Auth Token" />
    <button onclick="authenticate()">Connect</button>
    <div id="error" class="error"></div>
    
    <script>
      const vscode = acquireVsCodeApi();
      
      function authenticate() {
        const email = document.getElementById('email').value;
        const authToken = document.getElementById('authToken').value;
        
        if (!email || !authToken) {
          document.getElementById('error').textContent = 'Both fields required';
          return;
        }
        
        vscode.postMessage({ command: 'authenticate', authToken, email });
      }
      
      window.addEventListener('message', (event) => {
        if (event.data.command === 'authError') {
          document.getElementById('error').textContent = event.data.message;
        }
      });
    </script>
  </body>
  </html>`;
  }

  private getDashboardHTML() {
    return `<!DOCTYPE html>
    <html>
    <body>
      <h2>Dashboard</h2>
      <p>Authenticated! Main features coming next...</p>
    </body>
    </html>`;
  }
}
