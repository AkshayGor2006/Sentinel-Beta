/**
 * Shared by Priority Fixes and Developer Fix panel so both derive the same
 * one-line risk/fix text from the same issue object — avoids the two
 * sections drifting into different summaries of the same backend field.
 */

/** Strips markdown syntax from backend prose fields (**bold**, `code`, # headers). */
export function stripMarkdown(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`+/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Reduces a prose field down to one clean sentence, no markdown. */
export function oneSentence(text?: string, maxLen = 130): string {
  const clean = stripMarkdown(text);
  if (!clean) return "";
  const match = clean.match(/^.*?[.!?](?=\s|$)/);
  let sentence = match ? match[0] : clean;
  if (sentence.length > maxLen) sentence = sentence.slice(0, maxLen).trim() + "…";
  return sentence;
}
