"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelTitle } from "@/components/panel";
import { recordAttempt } from "@/lib/attempt";

export interface ParaphraseData {
  id: number;
  original: string;
  models: string[];
}

export function ParaphrasePractice({ exercise }: { exercise: ParaphraseData }) {
  const [typed, setTyped] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const words = useMemo(
    () => (typed.trim() ? typed.trim().split(/\s+/).length : 0),
    [typed],
  );

  function submit() {
    setSubmitted(true);
    recordAttempt({
      module: "writing",
      kind: "paraphrase",
      refId: exercise.id,
      detail: { answer: typed.trim().slice(0, 500) },
    });
  }

  function reset() {
    setTyped("");
    setSubmitted(false);
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
            {!submitted ? (
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

        {submitted && (
          <>
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
              <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
                Check yourself: same meaning, different words, no copied chunks
                of three or more words.
              </p>
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
