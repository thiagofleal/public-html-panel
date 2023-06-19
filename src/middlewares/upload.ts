import multer, { diskStorage } from "multer";
import { resolve } from "path";
import { splitPath } from "../utils/path";
import { CONTENT_PATH } from "..";
import { promisify } from "util";

const storage = diskStorage({
  destination: (request, file, callback) => {
    const relative = request.body.path as string || "";
    callback(null, resolve(CONTENT_PATH, ...splitPath(relative)));
  },
  filename: (request, file, callback) => {
    const name = request.body.name as string || file.originalname;
    callback(null, name);
  }
});

export const upload = promisify(multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024
  }
}).array("files"));
