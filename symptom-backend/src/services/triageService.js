// src/services/triageService.js
import { extractSymptoms, generateConditions } from "./llmService.js";
import { checkRedFlags } from "../utils/redFlags.js";

export async function assessSymptoms(text, age, sex) {
  // 1. run red flags early
  const emergency = checkRedFlags(text);
  if (emergency) return { safe: false, emergency };

  // 2. extract structured symptoms (LLM)
  const structured = await extractSymptoms(text);

  // 3. generate possible conditions (LLM)
  const cond = await generateConditions(structured, age, sex);

  return {
    safe: true,
    structured,
    ...cond,
  };
}
