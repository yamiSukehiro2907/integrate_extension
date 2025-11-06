import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export class FileService {
  async downloadProjectFiles(
    files: { name: string; content: string }[]
  ): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
      vscode.window.showErrorMessage("No workspace folder open");
      return;
    }

    const rootPath = workspaceFolder.uri.fsPath;

    for (const file of files) {
      const filePath = path.join(rootPath, file.name);
      fs.writeFileSync(filePath, file.content, "utf8");
    }

    await this.addToGitignore(
      rootPath,
      files.map((f) => f.name)
    );

    vscode.window.showInformationMessage(
      `Downloaded ${files.length} project files`
    );
  }

  private async addToGitignore(
    rootPath: string,
    filenames: string[]
  ): Promise<void> {
    const gitignorePath = path.join(rootPath, ".gitignore");

    let gitignoreContent = "";
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
    }

    const entries = filenames.filter(
      (name) => !gitignoreContent.includes(name)
    );

    if (entries.length > 0) {
      const newContent =
        gitignoreContent +
        (gitignoreContent.endsWith("\n") ? "" : "\n") +
        "\n# Integrate project files\n" +
        entries.join("\n") +
        "\n";

      fs.writeFileSync(gitignorePath, newContent, "utf8");
    }
  }
}
