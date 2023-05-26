import { Router } from "express";
import { watch } from "fs";
import { resolve } from "path";
import { rootdir } from "../dirname";

export const directory = Router();

directory.get("/", async (request, response) => {
  response.appendHeader("content-Type", "text/event-stream");
  response.flushHeaders();

  const relative = request.query.path as string || "";
  const path = resolve(rootdir, "..", "content", ...relative.replace(/^../g, ".").split("/"));

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
});
