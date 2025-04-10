import express from "express";
import multer from "multer";
import { processImage } from "../controller/processController";
const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post("/process", upload.single("image"), processImage);

export default router;
