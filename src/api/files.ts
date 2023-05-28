import { Router } from "express";
import { resolve } from "path";
import { lookup } from "mime-types";
import { readdir } from "fs/promises";
import { rootdir } from "../dirname";
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
        ? lookup(item.name)
        : item.isDirectory()
          ? "dir"
          : "unknown"
    })));
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Internal error"
    });
  }
});
