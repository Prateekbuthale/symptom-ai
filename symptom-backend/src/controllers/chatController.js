import { groq } from "../config/llm.js";
import { safeJSON } from "../utils/json.js";

export async function chatAssessment(req, res) {
  const { message, history, age, sex } = req.body;

  if (!message || !history) {
    return res.status(400).json({ error: "Message and history required" });
  }

  try {
    const resp = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are an AI medical triage assistant. Your job:

1. Talk to the user conversationally.
2. Ask follow-up questions one at a time.
3. NEVER give diagnoses directly.
4. Stop asking questions when you have enough info.
5. When ready, output final structured JSON ONLY:

{
  "done": true,
  "result": {
    "symptoms": [],
    "possible_conditions": [],
    "recommendations": {},
    "emergency": false,
    "disclaimer": "Always consult a healthcare professional."
  }
}

6. If you need more info, respond using:

{
  "done": false,
  "reply": "Your follow-up question"
}

7. ALWAYS return valid JSON — nothing else.

Start by understanding their symptoms and asking one follow-up question at a time.
`,
        },

        // previous messages
        ...history.map((m) => ({
          role: m.role,
          content: m.content,
        })),

        // latest user message
        {
          role: "user",
          content: message,
        },
      ],
    });

    const raw = resp.choices?.[0]?.message?.content;
    const json = safeJSON(raw);

    if (json.error) {
      return res.status(200).json({
        done: false,
        reply: "Sorry, could you clarify that?",
      });
    }

    return res.json(json);
  } catch (err) {
    console.error("🔥 Chat Assessment Error:", err);
    return res.status(500).json({ error: "Chat engine failed" });
  }
}
    