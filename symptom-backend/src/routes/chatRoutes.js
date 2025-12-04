import express from "express";
import { chatAssessment } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatAssessment);

export default router;
