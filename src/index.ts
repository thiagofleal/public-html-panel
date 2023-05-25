import * as express from "express";
import { config } from "dotenv";
import { resolve } from "path";
import { dirname } from "./dirname";

config();

const port = parseInt(process.env.PORT || "8080");

const app = express.default();

app.use("/", express.static(resolve(dirname + "/../content")));
app.use("/admin", express.static(resolve(dirname + "/../admin")));

app.listen(port, () => {
  console.log(`Server started at port ${ port }`);
});
