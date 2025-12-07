import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

// ✅ CORS (THIS ALREADY HANDLES PREFLIGHT IN EXPRESS 5)
app.use(
  cors({
    origin: ["http://localhost:5173", "https://medicheck-ai-five.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
