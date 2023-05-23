import { config } from "dotenv";
import * as express from "express";
import { dirname } from "./dirname";
import { resolve } from "path";

config();

const port = parseInt(process.env.PORT || "8080");

const app = express.default();

app.use("/admin", express.static(resolve(dirname + "/../admin")));

app.listen(port, () => {
  console.log(`Server started at port ${ port }`);
});
