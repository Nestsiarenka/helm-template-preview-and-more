import pathModule = require("path");

export function checkPathContains(path: string, containsWhat: string) {
  const parts = splitPath(path);
  return parts.includes(containsWhat);
}

export function getLongestPathTo(path: string, toWhat: string) {
  const parts = splitPath(path);

  let i = parts.length - 1;
  while (i >= 0 && parts[i] !== toWhat) {
    i--;
  }

  return parts.slice(0, i + 1).join(pathModule.sep);
}

export function splitPath(path: string) {
  const normalizedPath = pathModule.normalize(path);
  return normalizedPath.split(pathModule.sep);
}
