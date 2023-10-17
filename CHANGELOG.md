# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.2.1 - 2023-10-17

### Changed

- The lowest version of VS code supported is now 1.75.1

## 1.2.0 - 2023-10-12

### Added

- Configuration `helm-template-preview-and-more.customValueFileNames` that allows to set custom value file names instead of default `values.yaml`.

## 1.1.2 - 2023-09-02

### Added

- Editor title button that opens preview. The button is shown when a file in the editor has yaml or yml extension and it is located in the templates folder.

### Changed

- When preview is opened focus is preserved on the current active editor.

## 1.0.0 - 2023-08-15

### Changed

- Preview now uses `helm template` command with `--debug` flag. When there is an error in the chart you will see debug output of the template if it's available.

## 0.0.2 - 2023-08-05

### Added

- Command "Open Helm Template Preview" in a tab beside active editor.
- Preview is rerendered when Helm template is saved.
- Preview is rerendered when active editor is changed.
- Preview works with templates of subcharts
