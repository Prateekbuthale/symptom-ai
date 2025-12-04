// src/controllers/chatController.js
import dotenv from "dotenv";
dotenv.config();

import db from "../config/db.js";
import { groq } from "../config/llm.js";

/* --------------------------------------------------------
   Utility: Safe JSON parser with fallback
--------------------------------------------------------- */
function safeJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return parsed;
  } catch (err) {
    console.log("❌ JSON Parse Error (raw):", str);
    console.log("❌ Parse Error Details:", err.message);
    return { error: true, rawContent: str };
  }
}

/* --------------------------------------------------------
   Utility: Auto-fix common LLM JSON mistakes
--------------------------------------------------------- */
function fixJSON(raw) {
  if (!raw) return raw;

  let cleaned = raw.trim();

  // ⭐ Remove markdown code blocks (```json ... ``` or ``` ... ```)
  cleaned = cleaned.replace(/```json\s*/g, "");
  cleaned = cleaned.replace(/```\s*/g, "");

  // Remove any trailing text after the closing brace
  // Find the last complete JSON object
  const lastCloseBrace = cleaned.lastIndexOf("}");
  if (lastCloseBrace !== -1) {
    cleaned = cleaned.substring(0, lastCloseBrace + 1);
  }

  // ⭐ Extract ONLY the first complete JSON object in the string
  const match = cleaned.match(/{[\s\S]*}/);
  if (match) {
    cleaned = match[0];
  }

  // Remove trailing commas
  cleaned = cleaned.replace(/,\s*}/g, "}");
  cleaned = cleaned.replace(/,\s*]/g, "]");

  // Fix recommendations when incorrectly output as an object
  cleaned = cleaned.replace(
    /"recommendations"\s*:\s*{([^}]*)}/g,
    (match, inner) => {
      const arr = inner
        .split("\n")
        .map((x) => x.replace(/"/g, "").trim())
        .filter(Boolean)
        .map((x) => `"${x}"`);
      return `"recommendations": [${arr.join(", ")}]`;
    }
  );

  return cleaned;
}

/* --------------------------------------------------------
   Utility: Convert plain text to JSON follow-up format
--------------------------------------------------------- */
function wrapPlainTextAsQuestion(text) {
  // If the text looks like a question, wrap it properly
  const trimmed = text.trim();
  if (trimmed.length > 0) {
    return {
      done: false,
      reply: trimmed.endsWith("?") ? trimmed : `${trimmed}?`,
    };
  }
  return {
    done: false,
    reply: "Can you provide more details about your symptoms?",
  };
}

/* --------------------------------------------------------
   Utility: Validate and normalize assessment result
--------------------------------------------------------- */
function validateAssessmentResult(result) {
  return {
    symptoms: Array.isArray(result.symptoms) ? result.symptoms : [],
    possible_conditions: Array.isArray(result.possible_conditions)
      ? result.possible_conditions
      : [],
    recommendations: Array.isArray(result.recommendations)
      ? result.recommendations
      : [],
    emergency: typeof result.emergency === "boolean" ? result.emergency : false,
    disclaimer: result.disclaimer || "Not medical advice.",
  };
}

/* --------------------------------------------------------
   SYSTEM PROMPT FOR FOLLOW-UP QUESTIONS
--------------------------------------------------------- */
const systemPrompt = `You are a medical triage assistant. You MUST ALWAYS output VALID JSON with NO additional text.

CRITICAL RULES - READ CAREFULLY:
1. EVERY response must be ONLY a JSON object
2. Do NOT write plain text
3. Do NOT wrap JSON in markdown code blocks
4. Do NOT add explanations before or after the JSON

For follow-up questions, output EXACTLY this format:
{
  "done": false,
  "reply": "your follow-up question here?"
}

For final diagnosis (after 3-4 questions OR when enough info is gathered), output EXACTLY:
{
  "done": true,
  "result": {
    "symptoms": ["symptom1", "symptom2"],
    "possible_conditions": ["condition1", "condition2"],
    "recommendations": ["recommendation1", "recommendation2"],
    "emergency": false,
    "disclaimer": "Not medical advice."
  }
}

EXAMPLES OF CORRECT OUTPUT:

Follow-up question example:
{
  "done": false,
  "reply": "Have you experienced any fever or chills?"
}

Final result example:
{
  "done": true,
  "result": {
    "symptoms": ["knee pain", "swelling"],
    "possible_conditions": ["sprain", "arthritis"],
    "recommendations": ["rest", "ice application", "see doctor if worsens"],
    "emergency": false,
    "disclaimer": "Not medical advice."
  }
}

WRONG - DO NOT DO THIS:
- Plain text: "Have you experienced fever?"
- With explanation: "Here's the question: {...}"
- With markdown: \`\`\`json {...} \`\`\`

Remember: Output ONLY the JSON object. Nothing else.`;

/* --------------------------------------------------------
   STEP 1 — Extract structured symptom details
--------------------------------------------------------- */
async function extractSymptomsFromHistory(history) {
  const userMessages = history
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .filter((line) => !line.trim().startsWith("{")); // Ignore JSON blobs

  const prompt = `Extract structured symptom details from the following user responses.
Return STRICT JSON ONLY in this format (no markdown, no explanations):

{
  "main_symptoms": [],
  "duration": "",
  "pain_character": "",
  "radiation": "",
  "injury_history": "",
  "additional_symptoms": []
}

Conversation:
${userMessages.join("\n")}

Output ONLY the JSON object. No code blocks. No additional text.`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "Extract structured symptom data. Output ONLY raw JSON. No markdown blocks. No explanations.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }, // Force JSON mode
  });

  let raw = completion.choices[0].message.content;
  console.log("🔍 Extract symptoms RAW:", raw);
  raw = fixJSON(raw);
  return safeJSON(raw);
}

/* --------------------------------------------------------
   MAIN CHAT ASSESSMENT HANDLER
--------------------------------------------------------- */
export const chatAssessment = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;

    console.log("🔥 Incoming Chat Message:", { message, sessionId, userId });

    /* Save user message */
    await db.query(
      `INSERT INTO chat_messages (user_id, role, content, session_id)
       VALUES ($1, 'user', $2, $3)`,
      [userId, message, sessionId]
    );

    /* Fetch conversation history */
    const result = await db.query(
      `SELECT role, content 
       FROM chat_messages 
       WHERE session_id=$1 
       ORDER BY created_at ASC`,
      [sessionId]
    );

    const history = result.rows.map((row) => ({
      role: row.role === "assistant" ? "assistant" : "user",
      content: row.content,
    }));

    /* Count follow-up questions asked */
    const questionCount = history.filter(
      (m) => m.role === "assistant" && m.content.trim().endsWith("?")
    ).length;

    console.log("🤖 Question count:", questionCount);

    const forceFinal = questionCount >= 3;

    /* Build context-aware prompt */
    let contextPrompt = `User's current message: "${message}"
Number of questions asked so far: ${questionCount}`;

    if (forceFinal) {
      contextPrompt += `

IMPORTANT: You have asked 3+ questions. You MUST now provide a final diagnosis.
Output format:
{
  "done": true,
  "result": {
    "symptoms": [],
    "possible_conditions": [],
    "recommendations": [],
    "emergency": false,
    "disclaimer": "Not medical advice."
  }
}`;
    } else {
      contextPrompt += `

Ask a relevant follow-up question to gather more information.
Output format:
{
  "done": false,
  "reply": "your question?"
}`;
    }

    /* Prepare messages to send LLM */
    const llmMessages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: contextPrompt },
    ];

    /* Step 2 — Call LLM for follow-up OR done:true */
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: llmMessages,
      temperature: 0.3,
      response_format: { type: "json_object" }, // Force JSON mode
    });

    let raw = completion.choices?.[0]?.message?.content || "";
    console.log("🧠 RAW LLM:", raw);

    const fixed = fixJSON(raw);
    let json = safeJSON(fixed);

    /* ----------------------------
       HANDLE PLAIN TEXT RESPONSES
    ----------------------------- */
    if (!json || json.error) {
      console.log("⚠️ Plain text detected, attempting to wrap as question");

      // If it's plain text and looks like a question, wrap it
      if (typeof json.rawContent === "string" && !forceFinal) {
        json = wrapPlainTextAsQuestion(json.rawContent);
        console.log("✅ Wrapped as:", json);
      } else if (forceFinal) {
        // If forceFinal and parse failed, use fallback
        console.log("⚠️ Parse failed at forceFinal, using fallback");
        const fallback = {
          done: true,
          result: {
            symptoms: history
              .filter((m) => m.role === "user")
              .slice(0, 5)
              .map((m) => m.content),
            possible_conditions: ["Unable to complete assessment"],
            recommendations: [
              "Please consult a healthcare provider for proper evaluation",
            ],
            emergency: false,
            disclaimer: "Not medical advice.",
          },
        };

        await db.query(
          `INSERT INTO chat_messages (user_id, role, content, session_id)
           VALUES ($1, 'assistant', $2, $3)`,
          [userId, JSON.stringify(fallback.result), sessionId]
        );

        return res.json(fallback);
      } else {
        // Fallback question
        json = {
          done: false,
          reply: "Can you provide more details about your symptoms?",
        };
      }
    }

    /* ----------------------------
       NORMAL FOLLOW-UP
    ----------------------------- */
    if (json.done === false) {
      await db.query(
        `INSERT INTO chat_messages (user_id, role, content, session_id)
         VALUES ($1, 'assistant', $2, $3)`,
        [userId, json.reply, sessionId]
      );

      return res.json(json);
    }

    /* ----------------------------
       FINAL RESULT STAGE
    ----------------------------- */
    if (json.done === true || forceFinal) {
      console.log("⚙ Extracting symptom summary...");
      let extracted = await extractSymptomsFromHistory(history);
      console.log("🧩 Extracted Symptoms:", extracted);

      // Handle extraction failure
      if (!extracted || extracted.error) {
        console.error("❌ Failed to extract symptoms, using basic data");
        extracted = {
          main_symptoms: history
            .filter((m) => m.role === "user")
            .map((m) => m.content)
            .slice(0, 5),
          duration: "",
          pain_character: "",
          radiation: "",
          injury_history: "",
          additional_symptoms: [],
        };
      }

      /* Build final assessment prompt */
      const finalPrompt = `Generate a medical triage assessment based on the structured symptom data below.

Output ONLY raw JSON in this EXACT format (no markdown code blocks, no explanations):

{
  "done": true,
  "result": {
    "symptoms": [],
    "possible_conditions": [],
    "recommendations": [],
    "emergency": false,
    "disclaimer": "Not medical advice."
  }
}

Structured symptom data:
${JSON.stringify(extracted, null, 2)}

Guidelines:
- List 3-5 main symptoms
- Suggest 2-4 possible conditions
- Provide 3-5 actionable recommendations
- Set emergency:true if there are red flags (severe pain, difficulty breathing, chest pain, high fever with confusion, etc.)

CRITICAL: Output ONLY the JSON object. No \`\`\`json blocks. No additional text before or after.`;

      const finalComp = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You produce ONLY valid raw JSON. No markdown. No explanations. Just the JSON object.",
          },
          { role: "user", content: finalPrompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }, // Force JSON mode
      });

      let finalRaw = finalComp.choices[0].message.content;
      console.log("🔍 Final RAW response:", finalRaw);

      finalRaw = fixJSON(finalRaw);
      console.log("🔧 After fixJSON:", finalRaw);

      const finalJson = safeJSON(finalRaw);
      console.log("✅ Final parsed JSON:", finalJson);

      // Handle parse errors gracefully
      if (!finalJson || finalJson.error) {
        console.error("❌ Failed to parse final JSON, using fallback");
        const fallback = {
          done: true,
          result: {
            symptoms: extracted.main_symptoms || [],
            possible_conditions: [
              "Unable to generate assessment - please consult a healthcare provider",
            ],
            recommendations: [
              "Seek medical attention if symptoms worsen",
              "Monitor your symptoms closely",
            ],
            emergency: false,
            disclaimer: "Not medical advice.",
          },
        };

        await db.query(
          `INSERT INTO chat_messages (user_id, role, content, session_id)
           VALUES ($1, 'assistant', $2, $3)`,
          [userId, JSON.stringify(fallback.result), sessionId]
        );

        await db.query(
          `INSERT INTO assessments 
             (user_id, session_id, symptoms_combined, structured_symptoms, final_result, emergency)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            userId,
            sessionId,
            history
              .filter((m) => m.role === "user")
              .map((m) => m.content)
              .join(", "),
            extracted,
            fallback.result,
            fallback.result.emergency,
          ]
        );

        return res.json(fallback);
      }

      // Ensure the structure is correct and validate
      let resultToSave = finalJson.result || finalJson;
      resultToSave = validateAssessmentResult(resultToSave);

      /* Save final bot message into chat history */
      await db.query(
        `INSERT INTO chat_messages (user_id, role, content, session_id)
         VALUES ($1, 'assistant', $2, $3)`,
        [userId, JSON.stringify(resultToSave), sessionId]
      );

      /* ---- Save final assessment ---- */
      await db.query(
        `INSERT INTO assessments 
           (user_id, session_id, symptoms_combined, structured_symptoms, final_result, emergency)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          userId,
          sessionId,
          history
            .filter((m) => m.role === "user")
            .map((m) => m.content)
            .join(", "),
          extracted,
          resultToSave,
          resultToSave.emergency,
        ]
      );

      return res.json({
        done: true,
        result: resultToSave,
      });
    }
  } catch (err) {
    console.error("❌ Chat Engine Error:", err);
    return res
      .status(500)
      .json({ error: "Chat engine failed", details: err.message });
  }
};
