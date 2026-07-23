/**
 * Your backend's `patches` field (from patch_agent.generate_patch) has an
 * unconfirmed shape — I've never seen a full sample of it. This assumes
 * patches[i] corresponds to issues[i] by index, since generate_patch() is
 * called directly on agent_result["issues"] in the same order in repo.py.
 * That's a structural inference, not a confirmed guarantee — flag it to
 * Claude if patches don't line up with the right issue.
 *
 * Nothing here fabricates diff content. If no usable patch is found, the
 * caller shows an explicit empty state instead of a fake diff.
 */

export interface ExtractedPatch {
  /** Raw text found for this issue's patch, if any. */
  text: string | null;
  /** Whether `text` looks like an actual unified diff (has +/-/@@ lines). */
  isDiff: boolean;
  /** True if we found *something* but had to fall back to JSON.stringify because it wasn't a plain string. */
  isRawObject: boolean;
}

function looksLikeDiff(text: string): boolean {
  const lines = text.split("\n");
  return lines.some(
    (line) =>
      line.startsWith("diff --git") ||
      line.startsWith("@@") ||
      line.startsWith("+++") ||
      line.startsWith("---") ||
      /^[+-][^+-]/.test(line)
  );
}

export function extractPatchForIssue(patches: unknown, index: number | null): ExtractedPatch {
  if (index === null || patches === null || patches === undefined) {
    return { text: null, isDiff: false, isRawObject: false };
  }

  let candidate: unknown = undefined;

  if (Array.isArray(patches)) {
    candidate = patches[index];
  } else if (typeof patches === "object") {
    // Occasionally backends key patches by file or id rather than a plain array — best effort only.
    candidate = (patches as Record<string, unknown>)[String(index)];
  }

  if (candidate === undefined || candidate === null) {
    return { text: null, isDiff: false, isRawObject: false };
  }

  if (typeof candidate === "string") {
    return { text: candidate, isDiff: looksLikeDiff(candidate), isRawObject: false };
  }

  if (typeof candidate === "object") {
    const obj = candidate as Record<string, unknown>;
    const stringField = obj.patch ?? obj.diff ?? obj.content ?? obj.code;
    if (typeof stringField === "string") {
      return { text: stringField, isDiff: looksLikeDiff(stringField), isRawObject: false };
    }
    return { text: JSON.stringify(candidate, null, 2), isDiff: false, isRawObject: true };
  }

  return { text: String(candidate), isDiff: false, isRawObject: false };
}
