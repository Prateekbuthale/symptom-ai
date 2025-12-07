// // src/utils/redFlags.js
// export function checkRedFlags(text) {
//   if (!text) return null;
//   const t = text.toLowerCase();

//   if (
//     t.includes("chest pain") &&
//     (t.includes("shortness of breath") ||
//       t.includes("breathless") ||
//       t.includes("sweating"))
//   ) {
//     return "Possible cardiac emergency. Seek immediate medical care.";
//   }
//   if (
//     t.includes("slurred speech") ||
//     t.includes("facial droop") ||
//     t.includes("one sided weakness") ||
//     t.includes("sudden weakness")
//   ) {
//     return "Possible stroke. Call emergency services immediately.";
//   }
//   if (t.includes("suicidal") || t.includes("want to die")) {
//     return "Mental health emergency. Contact emergency services or a crisis hotline immediately.";
//   }
//   if (
//     t.includes("severe bleeding") ||
//     t.includes("unconscious") ||
//     t.includes("not breathing")
//   ) {
//     return "Emergency: seek immediate medical attention.";
//   }
//   return null;
// }
