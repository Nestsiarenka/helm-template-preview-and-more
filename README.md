# Helm Template Preview

The objective of the extension is to boost process of creating Helm charts with the ability to quickly preview your Helm templates as you go.

## Features

### Helm template preview

You start a preview with a command "Open Helm Template Preview".

![Open Helm Template Preview](https://i.imgur.com/U4nQ35a.gif "Open Helm Template Preview")

Or you can use a button in the editor menu to start a preview.

![Open Helm Template Preview with a Button](https://i.imgur.com/uV4XbHo.png "Open Helm Template Preview with a Button")

The preview is rerendered when Helm template is saved or active editor is changed.

Preview of your subchart templates should work as well.

Preview uses `helm template` command with `--debug` flag. When there is an error in the chart you will see debug output of the template if it's available. And details of the error in the error toast.

## Requirements

You need to have [Helm CLI](https://helm.sh/docs/intro/install/) installed and available in your PATH. Because preview runs 'helm template' command.

## Commands

- `Helm: Open Helm Template Preview`: opens a preview in a tab beside active editor.

## Settings

### Custom value file names

Property `helm-template-preview-and-more.customValueFileNames`.

You can define custom value file names instead of default `values.yaml`.

The setting is a list of strings. An item can be absolute path or path relative to your chart folder.

The items are applied to `helm template` command as `--values` flags. The item defined first (higher on UI, lefter in the array) has precedence. This logic is opposite to multiple `--values` flags, where rightmost item has precedence, so items are applied to the command in reverse.

Before being applied items are checked on existence on the filesystem, items that do not exist are just ignored. If all of the items do not exist the command is called without any `--values` flags, that means fallback to `values.yaml` default.
