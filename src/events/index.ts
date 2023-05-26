import { Router } from "express";
import { directory } from "./directory";

export const events = Router();

events.use("/directory", directory);
