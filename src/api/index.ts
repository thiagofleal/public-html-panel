import { Router } from "express";
import { files } from "./files";
import { auth } from "./auth";

export const router = Router();

router.use("/auth", auth);
router.use("/files", files);
