"use client";

import { useState } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelTitle } from "@/components/panel";
import { DiffView } from "@/components/diff-view";
import { diffWords, type DiffResult } from "@/lib/diff";
import { recordAttempt } from "@/lib/attempt";

export interface ErrorFixData {
  id: number;
  mistake: string;
  flawed: string;
  corrected: string;
  explanation: string;
}

export function ErrorFixPractice({ item }: { item: ErrorFixData }) {
  const [hint, setHint] = useState(false);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);

  function check() {
    const r = diffWords(item.corrected, typed);
    setResult(r);
    recordAttempt({
      module: "writing",
      kind: "errorfix",
      refId: item.id,
      score: r.accuracy,
      detail: { answer: typed.trim().slice(0, 500) },
    });
  }

  function reset() {
    setTyped("");
    setResult(null);
    setHint(false);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <Panel>
        <PanelTitle>Learner sentence</PanelTitle>
        <p className="mt-3 text-[15px] leading-7 text-foreground">
          {item.flawed}
        </p>
        <div className="mt-4 flex items-center gap-3 border-t border-rule pt-3">
          <p className="text-[13px] leading-5 text-muted-foreground">
            A typical IELTS mistake is hiding in this sentence. Rewrite it
            correctly.
          </p>
          {!hint ? (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto shrink-0"
              onClick={() => setHint(true)}
            >
              <Lightbulb size={14} />
              Hint
            </Button>
          ) : (
            <span className="ml-auto shrink-0 rounded-full border border-input px-3 py-1 text-xs text-muted-foreground">
              {item.mistake}
            </span>
          )}
        </div>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel>
          <PanelTitle>Your correction</PanelTitle>
          <Textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Write the corrected version…"
            className="mt-3 min-h-[130px] resize-y rounded-lg border-input bg-sheet text-[15px] leading-7"
          />
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={check} disabled={typed.trim().length < 5}>
              Check
            </Button>
            {result && (
              <Button variant="ghost" onClick={reset}>
                <RotateCcw size={14} />
                Try again
              </Button>
            )}
          </div>
        </Panel>

        {result && (
          <>
            <Panel>
              <div className="flex items-baseline justify-between gap-3">
                <PanelTitle>Model correction</PanelTitle>
                <span className="num text-sm">
                  <span className="font-medium">{result.accuracy}%</span>{" "}
                  <span className="text-muted-foreground">match</span>
                </span>
              </div>
              <DiffView segments={result.segments} className="mt-3" />
              <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
                <span className="text-[#7a1d14]">Struck through</span>: the fix
                you missed ·{" "}
                <span className="text-[#92400e]">Underlined</span>: what you
                wrote instead.
              </p>
            </Panel>
            <Panel>
              <PanelTitle>The mistake: {item.mistake}</PanelTitle>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {item.explanation}
              </p>
            </Panel>
          </>
        )}
      </div>
    </div>
  );
}
