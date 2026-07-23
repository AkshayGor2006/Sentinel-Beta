import * as React from "react";

/**
 * Your backend's ai_summary/fix fields contain markdown-ish text
 * (**bold**, \n line breaks, numbered lists) as plain strings. No markdown
 * library is added here since package.json isn't being touched — this just
 * handles **bold** and paragraph breaks safely via React elements (no
 * dangerouslySetInnerHTML).
 */
export function AiProse({ text }: { text?: string }) {
  if (!text) return null;

  const paragraphs = text.split(/\n{1,}/).filter(Boolean);

  return (
    <div className="space-y-2.5 text-[13px] leading-relaxed text-foreground/65">
      {paragraphs.map((para, i) => (
        <p key={i}>{renderBold(para)}</p>
      ))}
    </div>
  );
}

function renderBold(line: string): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground/85">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
