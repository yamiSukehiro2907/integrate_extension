import * as vscode from "vscode";
import { AuthResponse } from "../helpers/AuthResponse";

export class AuthService {
  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly _apiUrl: string
  ) {}

  async isAuthenticated(): Promise<boolean> {
    const token = await this._context.secrets.get("integrate.authToken");
    return !!token;
  }

  async authenticate(
    authToken: string,
    email: string
  ): Promise<{
    success: boolean;
    projectId?: string;
    projectName?: string;
    files?: { name: string; content: string }[];
    error?: string;
  }> {
    try {
      const response = await fetch(`${this._apiUrl}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authToken, email }),
      });

      if (response.ok) {
        const data = (await response.json()) as AuthResponse;

        await this._context.secrets.store("integrate.authToken", authToken);
        await this._context.secrets.store("integrate.userEmail", email);

        const files = [
          {
            name: "openapi.yaml",
            content:
              typeof data.files.openapi_yaml === "string"
                ? data.files.openapi_yaml
                : JSON.stringify(data.files.openapi_yaml, null, 2),
          },
          {
            name: "schema.json",
            content:
              typeof data.files.schema_json === "string"
                ? data.files.schema_json
                : JSON.stringify(data.files.schema_json, null, 2),
          },
          {
            name: "rules.md",
            content: data.files.rules_md,
          },
        ];

        return {
          success: true,
          projectId: data.project.id,
          projectName: data.project.name,
          files,
        };
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: "Connection failed" };
    }
  }

  async logout(): Promise<void> {
    await this._context.secrets.delete("integrate.authToken");
    await this._context.secrets.delete("integrate.userEmail");
  }

  async getToken(): Promise<string | undefined> {
    return await this._context.secrets.get("integrate.authToken");
  }
}
