import { assessSymptoms } from "../services/triageService.js";
import { db } from "../config/db.js";
export const assess = async (req, res) => {
  const { text, age, sex } = req.body;
  const userId = req.user?.id || null;

  console.log("📥 Incoming assessment:", { text, age, sex });

  try {
    const result = await assessSymptoms(text, age, sex);

    console.log("📤 Result:", result);

    // Save to DB
    await db.query(
      "INSERT INTO assessments (user_id, symptoms, result) VALUES ($1, $2, $3)",
      [userId, text, result]
    );

    return res.json(result);
  } catch (err) {
    console.error("🔥 INTERNAL ERROR in assessmentController:");
    console.error(err); // ← THE REAL ERROR PRINTS HERE
    return res.status(500).json({ error: "Internal error" });
  }
};