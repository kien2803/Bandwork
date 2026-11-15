"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/panel";
import { cn } from "@/lib/utils";

/** Pick-the-paraphrase quiz shared by reading choices and listen & choose.
    Reports the final score (100 first-try, 50 after misses, 0 on reveal)
    through onResult exactly once. */
export function OptionsQuiz({
  title = "Choose the closest paraphrase",
  options,
  correct,
  onResult,
}: {
  title?: string;
  options: string[];
  correct: number;
  onResult: (score: number) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const [done, setDone] = useState(false);

  function pick(i: number) {
    if (done) return;
    if (i === correct) {
      setPicked(i);
      setDone(true);
      onResult(misses === 0 ? 100 : 50);
    } else {
      setPicked(i);
      setMisses((m) => m + 1);
    }
  }

  function reveal() {
    setPicked(correct);
    setDone(true);
    onResult(0);
  }

  return (
    <Panel>
      <PanelTitle>{title}</PanelTitle>
      <div className="mt-3 flex flex-col gap-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === correct;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={done}
              className={cn(
                "flex items-start gap-3 rounded-[14px] border border-border bg-sheet px-4 py-3 text-left text-[15px] leading-6 transition-colors",
                !done && "hover:border-input",
                isPicked && !isCorrect && !done && "border-[#f0b4ae] bg-negative-soft/60",
                done && isCorrect && "border-[#b7e4c2] bg-positive-soft/60",
                done && isPicked && !isCorrect && "border-[#f0b4ae] bg-negative-soft/60",
              )}
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-input text-xs text-muted-foreground">
                {done && isCorrect ? (
                  <Check size={12} className="text-positive" />
                ) : isPicked && !isCorrect ? (
                  <X size={12} className="text-negative" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-rule pt-3">
        {done && picked === correct && (
          <p className="text-sm font-medium text-positive">
            {misses === 0 ? "Correct, first try." : "Correct."}
          </p>
        )}
        {!done && picked !== null && (
          <p className="text-sm text-negative">
            That changes the meaning. Try another.
          </p>
        )}
        {!done && picked === null && (
          <p className="text-sm text-muted-foreground">
            A true paraphrase keeps the meaning, not just the words.
          </p>
        )}
        {!done && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={reveal}
          >
            Show answer
          </Button>
        )}
      </div>
    </Panel>
  );
}
