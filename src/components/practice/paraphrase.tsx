"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelTitle } from "@/components/panel";
import { recordAttempt } from "@/lib/attempt";
import { analyzeParaphrase, type ParaphraseCheck } from "@/lib/paraphrase-check";
import { cn } from "@/lib/utils";

export interface ParaphraseData {
  id: number;
  original: string;
  models: string[];
  tips: string[];
}

const VERDICT_TEXT: Record<ParaphraseCheck["verdict"], string> = {
  close:
    "Too close to the original. Change the key words and rebuild the sentence shape.",
  partial:
    "Partly paraphrased. Good start — now swap the highlighted words and vary the opening.",
  good: "Well paraphrased. The meaning is kept but the words and shape are your own.",
};

export function ParaphrasePractice({ exercise }: { exercise: ParaphraseData }) {
  const [typed, setTyped] = useState("");
  const [check, setCheck] = useState<ParaphraseCheck | null>(null);

  const words = useMemo(
    () => (typed.trim() ? typed.trim().split(/\s+/).length : 0),
    [typed],
  );

  function submit() {
    const result = analyzeParaphrase(exercise.original, typed);
    setCheck(result);
    recordAttempt({
      module: "writing",
      kind: "paraphrase",
      refId: exercise.id,
      score: result.score,
      detail: {
        answer: typed.trim().slice(0, 500),
        words,
        kept: result.keptCount,
      },
    });
  }

  function reset() {
    setTyped("");
    setCheck(null);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <Panel>
        <PanelTitle>Original</PanelTitle>
        <p className="mt-3 text-[15px] leading-7 text-foreground">
          {exercise.original}
        </p>
        <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
          Rewrite this in your own words. Keep the meaning; change the words and
          the structure.
        </p>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <PanelTitle>Your paraphrase</PanelTitle>
            <span className="num text-xs text-muted-foreground">
              {words} words
            </span>
          </div>
          <Textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Write your version here…"
            className="mt-3 min-h-[140px] resize-y rounded-lg border-input bg-sheet text-[15px] leading-7"
          />
          <div className="mt-4 flex items-center gap-2">
            {!check ? (
              <Button onClick={submit} disabled={words < 4}>
                Compare
              </Button>
            ) : (
              <Button variant="ghost" onClick={reset}>
                <RotateCcw size={14} />
                Try again
              </Button>
            )}
          </div>
        </Panel>

        {check && (
          <>
            <Panel>
              <div className="flex items-baseline justify-between gap-3">
                <PanelTitle>What stayed the same</PanelTitle>
                <span className="num text-sm">
                  <span className="font-medium">{check.score}</span>{" "}
                  <span className="text-muted-foreground">/ 100</span>
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-7 text-foreground">
                {check.pieces.map((p, i) => (
                  <span
                    key={i}
                    className={cn(
                      p.inChunk && "rounded bg-[#fde9d9] text-[#92400e]",
                      p.kept &&
                        !p.inChunk &&
                        "underline decoration-[#d97706] decoration-2 underline-offset-4",
                    )}
                  >
                    {p.text}
                  </span>
                ))}
              </p>
              <div className="mt-4 flex flex-col gap-1.5 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
                <p>
                  {check.keptCount} of {check.userContentCount} content words
                  unchanged
                  {check.longestRun >= 3 &&
                    ` · copied run of ${check.longestRun} words highlighted`}
                  {check.sameOpening && " · same opening as the original"}
                </p>
                <p
                  className={cn(
                    check.verdict === "good"
                      ? "text-positive"
                      : check.verdict === "partial"
                        ? "text-[#92400e]"
                        : "text-negative",
                  )}
                >
                  {VERDICT_TEXT[check.verdict]}
                </p>
              </div>
            </Panel>

            {exercise.tips.length > 0 && (
              <Panel>
                <PanelTitle>Ways to push it further</PanelTitle>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {exercise.tips.map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-6">
                      <span className="num mt-0.5 shrink-0 text-xs text-muted-foreground">
                        {i + 1}.
                      </span>
                      <span className="text-foreground">{t}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            <Panel>
              <PanelTitle>Side by side</PanelTitle>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Original</p>
                  <p className="mt-1 text-sm leading-6 text-foreground">
                    {exercise.original}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Yours</p>
                  <p className="mt-1 text-sm leading-6 text-foreground">
                    {typed}
                  </p>
                </div>
              </div>
            </Panel>
            <Panel>
              <PanelTitle>Model paraphrases</PanelTitle>
              <ol className="mt-3 flex flex-col gap-3">
                {exercise.models.map((m, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="num mt-0.5 text-xs text-muted-foreground">
                      {i + 1}.
                    </span>
                    <p className="text-[15px] leading-7 text-foreground">{m}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </>
        )}
      </div>
    </div>
  );
}
