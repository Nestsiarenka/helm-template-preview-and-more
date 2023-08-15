# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 - 2023-08-15

### Changed

- Preview now uses `helm template` command with `--debug` flag. When there is an error in the chart you will see debug output of the template if it's available.

## 0.0.2 - 2023-08-05

### Added

- Command "Open Helm Template Preview" in a tab beside active editor.
- Preview is rerendered when Helm template is saved.
- Preview is rerendered when active editor is changed.
- Preview works with templates of subcharts
