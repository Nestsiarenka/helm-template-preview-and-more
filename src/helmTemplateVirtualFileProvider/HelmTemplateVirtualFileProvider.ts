// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import * as vscode from "vscode";
import { execSync } from "child_process";
import constants from "../helm/constants";
import * as helmFsNavigation from "../helm/helmFsNavigation";
import * as path from "path";
import * as fs from "fs";

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

    let customValueFileNames = this.getCustomValuesFileNames(rootChartPath);

    const { stdout, stderr } = this.runHelmTemplate(
      rootChartPath,
      templateFileRelativePath,
      false,
      customValueFileNames
    );

    if (stderr) {
      vscode.window.showErrorMessage(
        `Error trying to render helm template: ${stderr.toString()}`
      );

      let { stdout: stdoutDebug } = this.runHelmTemplate(
        rootChartPath,
        templateFileRelativePath,
        true,
        customValueFileNames
      );

      return (
        `#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#You have an error somewhere in your chart.
#The template was attempted to be built in debug mode.
#If an output under the message is empty, probably the attempt is failed.
#See the error message popped up for details.
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        ` + stdoutDebug.toString()
      );
    }

    return stdout.toString();
  }

  private runHelmTemplate(
    rootChartPath: string,
    templateFileRelativePath: string,
    isDebug: boolean,
    customValueFileNames?: string[]
  ): { stdout: Buffer; stderr?: Buffer } {
    try {
      const command = `helm template . --show-only ${templateFileRelativePath}${
        isDebug ? " --debug" : ""
      } ${this.buildValueFileOptions(customValueFileNames)}`;
      const stdout = execSync(command, {
        cwd: rootChartPath,
      });

      return { stdout };
    } catch (e) {
      return e as { stdout: Buffer; stderr: Buffer };
    }
  }

  private getCustomValuesFileNames(rootChartPath: string) {
    const configuration = vscode.workspace.getConfiguration(
      "helm-template-preview-and-more"
    );

    let customValueFileNames = configuration.get("customValueFileNames") as
      | string[]
      | undefined;

    let fileNamesWithAbsolutePath = customValueFileNames
      ?.map((f) => {
        const parsedFilePath = path.parse(f);
        return path.join(parsedFilePath.dir, parsedFilePath.base);
      })
      .map((f) => {
        return {
          absolutePath: path.isAbsolute(f) ? f : path.join(rootChartPath, f),
          fileName: f,
        };
      });

    return fileNamesWithAbsolutePath
      ?.filter((x) => fs.existsSync(x.absolutePath))
      .map((x) => x.fileName);
  }

  private buildValueFileOptions(customValueFileNames?: string[]) {
    if (!customValueFileNames) {
      return "";
    }

    return customValueFileNames
      .reverse()
      .map((x) => `--values "${x}"`)
      .join(" ");
  }

  static fileName = "HelmTemplatePreview.yaml";
  static scheme = "htvf";
  static fileUri = vscode.Uri.parse(`${this.scheme}:${this.fileName}`);
}

export default HelmTemplateVirtualFileProvider;
