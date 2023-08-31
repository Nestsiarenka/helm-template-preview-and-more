// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import * as vscode from "vscode";
import HelmTemplateVirtualFileProvider from "./helmTemplateVirtualFileProvider/HelmTemplateVirtualFileProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "helm-template-preview-and-more.open-helm-template-preview",
      renderHelmTemplate
    )
  );

  const helmTemplateVirtualFileProvider = new HelmTemplateVirtualFileProvider();

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      HelmTemplateVirtualFileProvider.scheme,
      helmTemplateVirtualFileProvider
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(
      handleDidChangeTextDocument,
      helmTemplateVirtualFileProvider
    )
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(
      handleDidChangeActiveTextEditor,
      helmTemplateVirtualFileProvider
    )
  );
}

export function deactivate(): void {}

async function renderHelmTemplate() {
  const document = await vscode.workspace.openTextDocument(
    HelmTemplateVirtualFileProvider.fileUri
  );

  await vscode.window.showTextDocument(document, {
    preview: false,
    preserveFocus: true,
    viewColumn: vscode.ViewColumn.Beside,
  });
}

function handleDidChangeTextDocument(
  this: HelmTemplateVirtualFileProvider,
  _: vscode.TextDocument
) {
  this.onDidChangeEmitter.fire(HelmTemplateVirtualFileProvider.fileUri);
}

function handleDidChangeActiveTextEditor(
  this: HelmTemplateVirtualFileProvider,
  e: vscode.TextEditor | undefined
) {
  if (!e) {
    return;
  }

  if (
    e?.document.uri.toString() ===
    HelmTemplateVirtualFileProvider.fileUri.toString()
  ) {
    return;
  }

  this.onDidChangeEmitter.fire(HelmTemplateVirtualFileProvider.fileUri);
}
