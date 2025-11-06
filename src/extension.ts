import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";
import { IntegrateSidebarProvider } from "./providers/SidebarProvider";

dotenv.config({ path: path.join(__dirname, "../.env") });

export function activate(context: vscode.ExtensionContext) {
  const apiUrl = process.env.INTEGRATE_URL || "http://localhost:8080/";

  const provider = new IntegrateSidebarProvider(
    context.extensionUri,
    context,
    apiUrl
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      IntegrateSidebarProvider.viewType,
      provider
    )
  );
}

export function deactivate() {}
