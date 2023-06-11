import { Router } from "express";
import { existsSync, watch } from "fs";
import { resolve } from "path";
import { splitPath } from "../utils/path";
import { CONTENT_PATH } from "..";

export const directory = Router();

directory.get("/", async (request, response) => {
  response.appendHeader("content-Type", "text/event-stream");
  response.flushHeaders();

  const relative = request.query.path as string || "";
  const path = resolve(CONTENT_PATH, ...splitPath(relative));

  if (existsSync(path)) {
    const watcher = watch(path, {
      encoding: "utf-8"
    }, (event, filename) => {
      response.write(
        `event: message\r\ndata: {"event": "${ event }", "target": "${ filename }"}\r\n\n`
      );
    });
  
    response.on("close", () => watcher.close());
    response.on("error", () => watcher.close());
    response.on("finish", () => watcher.close());
  }
});
