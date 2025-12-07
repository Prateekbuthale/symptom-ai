import express from "express";
import { assess } from "../controllers/assessmentController.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// require auth to save user-specific history; if you want guest mode, make endpoint optional
router.post("/", auth, assess);


export default router;
