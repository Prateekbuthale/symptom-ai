import express from "express";
import { chatAssessment } from "../controllers/chatController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", auth, chatAssessment);

export default router;
