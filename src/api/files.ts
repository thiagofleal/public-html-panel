import { Router } from "express";
import { resolve } from "path";
import { rootdir } from "../dirname";
import { readdir } from "fs/promises";
import { splitPath } from "../utils/path";

export const files = Router();

files.get("/", async (request, response) => {
  try {
    const relative = request.query.path as string || "";
    const path = resolve(rootdir, "..", "content", ...splitPath(relative));
    const content = await readdir(path, {
      withFileTypes: true,
      recursive: true,
      encoding: "utf-8"
    });
    response.status(200).send(content.map(item => ({
      name: item.name,
      path: item.path,
      type: item.isFile()
        ? "file"
        : item.isDirectory()
          ? "dir"
          : "unknown"
    })));
  } catch (e) {
    response.status(500).send({
      message: "Internal error"
    });
  }
});
