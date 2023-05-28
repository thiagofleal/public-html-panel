export function splitPath(relativePath: string): string[] {
  return relativePath.split("/").map(e => e.replace(/^\.\./g, "."));
}
