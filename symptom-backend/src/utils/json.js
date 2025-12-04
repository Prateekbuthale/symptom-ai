export function safeJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.log("JSON Parse Error:", raw);
    return { error: true, raw };
  }
}
