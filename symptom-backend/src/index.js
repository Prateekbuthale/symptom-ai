import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// ✅ ✅ ✅ VERY IMPORTANT: USE FUNCTION-STYLE CORS (VERCEL SAFE)
app.use(
  cors((req, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://medicheck-ai-five.vercel.app",
    ];

    const origin = req.header("Origin");

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, {
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      });
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/assessment", chatRoutes);

app.get("/", (req, res) => {
  res.send("✅ Symptom Checker API is running...");
});

export default app;
