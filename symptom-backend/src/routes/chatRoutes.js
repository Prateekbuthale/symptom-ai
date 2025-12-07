import express from "express";
import {
  chatAssessment,
  getChatHistory,
} from "../controllers/chatController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", auth, chatAssessment);
router.get("/history", auth, getChatHistory);

export default router;
