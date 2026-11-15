"use client";

import { useMemo, useState } from "react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelTitle } from "@/components/panel";
import { DiffView } from "@/components/diff-view";
import { diffWords, type DiffResult } from "@/lib/diff";
import { recordAttempt } from "@/lib/attempt";
import { cn } from "@/lib/utils";

export interface EssayData {
  id: number;
  task: string;
  title: string;
  prompt: string;
  content: string;
  band: number;
  wordTarget: number;
}

export function CopyEssayPractice({ essay }: { essay: EssayData }) {
  const [hidden, setHidden] = useState(false);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);

  const words = useMemo(
    () => (typed.trim() ? typed.trim().split(/\s+/).length : 0),
    [typed],
  );

  function check() {
    const r = diffWords(essay.content, typed);
    setResult(r);
    recordAttempt({
      module: "writing",
      kind: "copy",
      refId: essay.id,
      score: r.accuracy,
      detail: { words },
    });
  }

  function reset() {
    setTyped("");
    setResult(null);
    setHidden(false);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      {/* Original */}
      <Panel>
        <div className="flex items-center justify-between gap-3">
          <PanelTitle>Sample answer · band {essay.band.toFixed(1)}</PanelTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHidden((h) => !h)}
          >
            {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
            {hidden ? "Show" : "Hide"}
          </Button>
        </div>
        <p className="mt-3 text-sm italic leading-6 text-muted-foreground">
          {essay.prompt}
        </p>
        <div className="relative mt-3">
          <p
            className={cn(
              "whitespace-pre-wrap text-[15px] leading-7 text-foreground transition-opacity",
              hidden && "select-none opacity-0",
            )}
            aria-hidden={hidden}
          >
            {essay.content}
          </p>
          {hidden && (
            <div className="absolute inset-0 flex items-start pt-2">
              <p className="text-sm text-muted-foreground">
                Hidden. Write it from memory, then compare.
              </p>
            </div>
          )}
        </div>
      </Panel>

      {/* Your version */}
      <div className="flex flex-col gap-4">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <PanelTitle>Your version from memory</PanelTitle>
            <span className="num text-xs text-muted-foreground">
              {words} words
            </span>
          </div>
          <Textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={
              hidden
                ? "Write the essay from memory…"
                : "Hide the sample first, then write it from memory…"
            }
            className="mt-3 min-h-[280px] resize-y rounded-lg border-input bg-sheet text-[15px] leading-7"
          />
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={check} disabled={words < 10}>
              Compare with the original
            </Button>
            <Button variant="ghost" onClick={reset}>
              <RotateCcw size={14} />
              Start over
            </Button>
          </div>
        </Panel>

        {result && (
          <Panel>
            <div className="flex items-baseline justify-between gap-3">
              <PanelTitle>Comparison</PanelTitle>
              <span className="num text-sm">
                <span className="font-medium">{result.accuracy}%</span>{" "}
                <span className="text-muted-foreground">
                  matched ({result.matchedTokens}/{result.refTokens} words)
                </span>
              </span>
            </div>
            <DiffView segments={result.segments} className="mt-3" />
            <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
              <span className="text-[#7a1d14]">Struck through</span>: words from
              the original you missed ·{" "}
              <span className="text-[#92400e]">Underlined</span>: words you
              added or wrote differently.
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
