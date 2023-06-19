import { Router, json, urlencoded } from "express";
import { resolve } from "path";
import { lookup } from "mime-types";
import { v4 as uuid } from "uuid";
import { mkdir, readdir, rename, rm, writeFile } from "fs/promises";
import { splitPath } from "../utils/path";
import { CONTENT_PATH } from "..";
import { upload } from "../middlewares/upload";

export const files = Router();

files.use(json());
files.use(urlencoded({ extended: true }));

files.get("/", async (request, response) => {
  try {
    const relative = request.query.path as string || "";
    const path = resolve(CONTENT_PATH, ...splitPath(relative));
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

files.post("/file", async (request, response) => {
  try {
    const relative = request.body.path as string || "";
    const name = request.body.name as string || uuid();
    const path = resolve(CONTENT_PATH, ...splitPath(relative), name);

    await writeFile(path, "");

    response.status(200).send({
      message: "File successfully created"
    });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Internal error"
    });
  }
});

files.post("/folder", async (request, response) => {
  try {
    const relative = request.body.path as string || "";
    const name = request.body.name as string || uuid();
    const path = resolve(CONTENT_PATH, ...splitPath(relative), name);

    await mkdir(path);

    response.status(200).send({
      message: "Folder successfully created"
    });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Internal error"
    });
  }
});

files.put("/edit", async (request, response) => {
  try {
    const relative = request.body.path as string || "";
    const data = request.body.data as string || "";
    const path = resolve(CONTENT_PATH, ...splitPath(relative));
    const name = resolve(path, request.body.name as string || "");

    await writeFile(name, data);

    response.status(200).send({
      message: "Path successfully edited"
    });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Internal error"
    });
  }
});

files.put("/rename", async (request, response) => {
  try {
    const relative = request.body.path as string || "";
    const path = resolve(CONTENT_PATH, ...splitPath(relative));
    const oldName = resolve(path, request.body.old as string || "");
    const newName = resolve(path, request.body.new as string || "");

    await rename(oldName, newName);

    response.status(200).send({
      message: "Path successfully renamed"
    });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Internal error"
    });
  }
});

files.delete("/delete", async (request, response) => {
  try {
    const relative = request.query.path as string || "";
    const path = resolve(CONTENT_PATH, ...splitPath(relative));
    const name = resolve(path, request.query.name as string || "");

    await rm(name, { force: true, recursive: true });

    response.status(200).send({
      message: "Path successfully deleted"
    });
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Internal error"
    });
  }
});

files.post("/upload", async (request, response) => {
  try {
    await upload(request, response);

    if (request.files === void 0) {
      response.status(400).send({
        error: "E_NO_FILE",
        message: "File not sent"
      })
    } else {
      response.status(200).send({
        message: "File uploaded successfully"
      })
    }
  } catch (e) {
    console.error(e);
    response.status(500).send({
      message: "Internal error"
    });
  }
});
