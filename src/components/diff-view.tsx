import type { DiffSegment } from "@/lib/diff";
import { cn } from "@/lib/utils";

// Renders the merged diff produced by diffWords(). Inline segments are joined
// with plain spaces; punctuation tokens hug the previous word.

function joinTokens(segments: DiffSegment[]) {
  const out: React.ReactNode[] = [];
  let prevWord = true;
  segments.forEach((seg, i) => {
    const isWord = /[\p{L}\p{N}]/u.test(seg.text);
    const needsSpace = out.length > 0 && isWord && prevWord;
    const cls = cn(
      seg.type === "missing" &&
        "rounded-[3px] bg-negative-soft px-0.5 text-[#7a1d14] line-through decoration-[#b42318]/60",
      seg.type === "extra" &&
        "rounded-[3px] bg-warning-soft px-0.5 text-[#92400e] underline decoration-[#92400e]/50 underline-offset-2",
    );
    const inner =
      seg.type === "extra" && seg.replaced ? (
        <span>
          <span className="mr-1 text-[#b42318]/80 line-through no-underline">
            {seg.replaced}
          </span>
          {seg.text}
        </span>
      ) : (
        seg.text
      );
    out.push(
      <span key={i} className={cls}>
        {needsSpace ? " " : ""}
        {inner}
      </span>,
    );
    prevWord = isWord;
  });
  return out;
}

export function DiffView({
  segments,
  className,
}: {
  segments: DiffSegment[];
  className?: string;
}) {
  return (
    <p className={cn("text-[15px] leading-7 text-foreground", className)}>
      {joinTokens(segments)}
    </p>
  );
}
