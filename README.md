# Helm Template Preview

The objective of the extension is to boost process of creating Helm charts with the ability to quickly preview your Helm templates as you go.

## Features

### Helm template preview

You start a preview with a command "Open Helm Template Preview".

![Open Helm Template Preview](https://i.imgur.com/U4nQ35a.gif "Open Helm Template Preview")

The preview is rerendered when Helm template is saved or active editor is changed.

Preview of your subchart templates should work as well.

## Requirements

You need to have [Helm CLI](https://helm.sh/docs/intro/install/) installed and available in your PATH. Because preview runs 'helm template' command.

## Commands

- `Helm: Open Helm Template Preview`: opens a preview in a tab beside active editor.

## Settings

Currently you have no configuration options for the extension.
