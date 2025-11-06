import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";
import { IntegrateSidebarProvider } from "./providers/SidebarProvider";
import { AuthService } from "./services/AuthService";
import { FileService } from "./services/FileService";

dotenv.config({ path: path.join(__dirname, "../.env") });

export function activate(context: vscode.ExtensionContext) {
  const apiUrl = process.env.INTEGRATE_URL || "http://localhost:8080/";
  const authService = new AuthService(context, apiUrl);
  const fileService = new FileService();

  const provider = new IntegrateSidebarProvider(
    context.extensionUri,
    context,
    apiUrl,
    authService,
    fileService
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      IntegrateSidebarProvider.viewType,
      provider
    )
  );
}

export function deactivate() {}
