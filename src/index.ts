import * as express from "express";
import { config } from "dotenv";
import { resolve } from "path";
import { rootdir } from "./dirname";
import { router } from "./api";
import { events } from "./events";

config();

export const CONTENT_PATH = process.env.CONTENT_PATH || resolve(rootdir, "..", "content");

const port = parseInt(process.env.PORT || "8080");
const app = express.default();

app.use("/", express.static(CONTENT_PATH));
app.use("/admin", express.static(resolve(rootdir, "..", "admin")));
app.use("/api", router);
app.use("/events", events);

app.listen(port, () => {
  console.log(`Server started at port ${ port }`);
});
