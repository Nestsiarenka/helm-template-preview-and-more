// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import * as vscode from "vscode";
import { execSync } from "child_process";
import constants from "../helm/constants";
import * as helmFsNavigation from "../helm/helmFsNavigation";
import * as path from "path";

class HelmTemplateVirtualFileProvider
  implements vscode.TextDocumentContentProvider
{
  onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
  onDidChange = this.onDidChangeEmitter.event;

  provideTextDocumentContent(
    _: vscode.Uri,
    __: vscode.CancellationToken
  ): vscode.ProviderResult<string> {
    const templateFileAbsolutePath =
      vscode.window.activeTextEditor?.document.uri.fsPath;

    if (!templateFileAbsolutePath) {
      return "To see the template preview, open the editor with a Helm template";
    }

    if (!helmFsNavigation.isTemplatePath(templateFileAbsolutePath)) {
      return "The open file is not a Helm template";
    }

    const rootChartPath = helmFsNavigation.resolveRootChartPathOfTemplate(
      templateFileAbsolutePath
    );

    const templateFileRelativePath = path.relative(
      rootChartPath,
      templateFileAbsolutePath
    );

    if (!rootChartPath) {
      throw new Error(`${constants.rootChartPath} parameter is missing`);
    }

    if (!templateFileRelativePath) {
      throw new Error(
        `${constants.templatePathParameter} parameter is missing`
      );
    }

    try {
      const stdout = execSync(
        `helm template . --show-only ${templateFileRelativePath}`,
        {
          cwd: rootChartPath,
        }
      ).toString();

      return stdout;
    } catch (e) {
      vscode.window.showErrorMessage(
        `Error trying to render helm template: ${e}`
      );
    }

    return "";
  }

  static fileName = "HelmTemplatePreview.yaml";
  static scheme = "htvf";
  static fileUri = vscode.Uri.parse(`${this.scheme}:${this.fileName}`);
}

export default HelmTemplateVirtualFileProvider;
