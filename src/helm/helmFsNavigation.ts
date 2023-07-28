// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import path = require("path");
import constants from "./constants";
import * as fsHelpers from "../common/fsHelpers";
import fileExtensions from "./fileExtensions";

export function resolveRootChartPathOfChart(chartPath: string): string {
  var containingFolder = path.dirname(chartPath);
  var possibleParentChartPath = path.dirname(containingFolder);
  if (
    path.basename(containingFolder) !== constants.chartsFolder ||
    !fsHelpers.folderContains(possibleParentChartPath, constants.chartFile)
  ) {
    return chartPath;
  }

  return resolveRootChartPathOfChart(possibleParentChartPath);
}

export function isTemplatePath(templatePath: string) {
  return (
    [fileExtensions.yaml, fileExtensions.yml].find((x) =>
      templatePath.endsWith(x)
    ) && path.basename(path.dirname(templatePath)) === constants.templatesFolder
  );
}

export function resolveRootChartPathOfTemplate(
  templateFileAbsolutePath: string
) {
  if (!isTemplatePath(templateFileAbsolutePath)) {
    throw new Error(
      `The file in the editor is not a template. File path: ${templateFileAbsolutePath}`
    );
  }

  const chartPath = path.dirname(path.dirname(templateFileAbsolutePath));
  return resolveRootChartPathOfChart(chartPath);
}
