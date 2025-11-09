process.removeAllListeners('warning');
import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";
import { IntegrateSidebarProvider } from "./providers/SidebarProvider";
import { AuthService } from "./services/AuthService";
import { FileService } from "./services/FileService";
import { ApiService } from "./services/ApiService";

dotenv.config({ path: path.join(__dirname, "../.env") });

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("integrate");
  const apiUrl = config.get<string>("serverUrl") || "https://api.integrate.dev";
  const apiService = new ApiService(context, apiUrl);
  const authService = new AuthService(context, apiService);
  const fileService = new FileService();
  const provider = new IntegrateSidebarProvider(
    context.extensionUri,
    context,
    apiUrl,
    authService,
    fileService,
    apiService
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      IntegrateSidebarProvider.viewType,
      provider
    )
  );
}

export function deactivate() {}
