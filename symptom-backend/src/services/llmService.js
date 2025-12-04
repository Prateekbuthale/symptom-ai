// src/services/llmService.js
import { groq } from "../config/llm.js";

const safetySystem = `
You are a medical information assistant. You are NOT a doctor.
Always return JSON ONLY.
Never add commentary, warnings, explanations outside JSON.
`;

function safeJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("❌ LLM JSON parse failed:");
    console.error(raw);
    return {
      error: "Invalid JSON from LLM",
      raw,
    };
  }
}

export async function extractSymptoms(text) {
  const prompt = `
Extract key symptoms from this text and return JSON ONLY:
{
  "symptoms": [
    { "name": "", "duration": "", "severity": "" }
  ]
}
Text: """${text}"""
`;

  const resp = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: safetySystem },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const raw = resp.choices?.[0]?.message?.content?.trim();
  return safeJSON(raw);
}

export async function generateConditions(structuredSymptoms, age, sex) {
  const prompt = `
Given these symptoms return JSON ONLY:
{
  "possible_conditions": [
    { "name": "", "likelihood": "", "reasoning": "" }
  ],
  "recommendations": {
    "mild": "",
    "moderate": "",
    "warning": ""
  },
  "disclaimer": ""
}
Symptoms: ${JSON.stringify(structuredSymptoms)}
Age: ${age}
Sex: ${sex}
`;

  const resp = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: safetySystem },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const raw = resp.choices?.[0]?.message?.content?.trim();
  return safeJSON(raw);
}
