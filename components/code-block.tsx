import { cn } from "@/lib/utils";

type CodeBlockProps = {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
  /** Elevated surface for muted/build bands (works in light + dark) */
  tone?: "default" | "elevated";
  /** 1-based line numbers to emphasize in How-to-build walkthroughs */
  highlightLines?: readonly number[];
};

export function CodeBlock({
  code,
  filename,
  language = "tsx",
  className,
  tone = "default",
  highlightLines = [],
}: CodeBlockProps) {
  const highlighted = new Set(highlightLines);
  const lines = code.replace(/\n$/, "").split("\n");
  const showHighlights = highlighted.size > 0;

  return (
    <div
      data-slot="code-block"
      className={cn(
        "border rounded-lg overflow-hidden",
        tone === "elevated"
          ? "bg-background border-border shadow-xs"
          : "bg-muted/60 border-border",
        className,
      )}
    >
      {filename ? (
        <div className="px-4 py-2 border-border border-b font-mono text-[11px] text-muted-foreground">
          {filename}
        </div>
      ) : null}
      <pre className="py-4 overflow-x-auto text-foreground text-xs leading-6">
        <code data-language={language} className="block min-w-full">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlighted.has(lineNumber);

            return (
              <span
                key={lineNumber}
                className={cn(
                  "block px-4",
                  isHighlighted &&
                    "bg-amber-500/15 border-amber-500/70 border-l-2 dark:bg-amber-400/15 dark:border-amber-400/70",
                  showHighlights && !isHighlighted && "border-l-2 border-transparent",
                )}
              >
                {line.length > 0 ? line : "\u00A0"}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
