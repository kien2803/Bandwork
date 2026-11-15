"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/panel";
import { recordAttempt } from "@/lib/attempt";
import { cn } from "@/lib/utils";

export interface SynonymData {
  id: number;
  passage: string;
  question: string;
  targetWord: string;
  answerWord: string;
  explanation: string | null;
}

const TOKEN_RE = /[\p{L}\p{N}''-]+|[^\s\p{L}\p{N}''-]+/gu;

function norm(w: string) {
  return w.toLowerCase().replace(/[']/g, "'");
}

/** Renders a sentence with one highlighted target word. */
function SentenceWithTarget({ text, target }: { text: string; target: string }) {
  const tokens = text.match(TOKEN_RE) ?? [];
  return (
    <p className="text-[15px] leading-7 text-foreground">
      {tokens.map((t, i) =>
        norm(t) === norm(target) ? (
          <mark
            key={i}
            className="rounded-[4px] bg-teal-soft px-1 font-medium text-teal"
          >
            {t}
          </mark>
        ) : (
          <span key={i}>
            {i > 0 && /[\p{L}\p{N}]/u.test(t) && /[\p{L}\p{N}]/u.test(tokens[i - 1])
              ? " "
              : ""}
            {t}
          </span>
        ),
      )}
    </p>
  );
}

export function SynonymPractice({ exercise }: { exercise: SynonymData }) {
  const tokens = useMemo(
    () => (exercise.passage.match(TOKEN_RE) ?? []),
    [exercise.passage],
  );
  const [picked, setPicked] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "wrong" | "correct" | "revealed">(
    "idle",
  );
  const [misses, setMisses] = useState(0);

  function pick(i: number) {
    if (state === "correct" || state === "revealed") return;
    const t = tokens[i];
    if (!/[\p{L}\p{N}]/u.test(t)) return;
    setPicked(i);
    if (norm(t) === norm(exercise.answerWord)) {
      setState("correct");
      recordAttempt({
        module: "reading",
        kind: "synonym",
        refId: exercise.id,
        score: misses === 0 ? 100 : 50,
      });
    } else {
      setState("wrong");
      setMisses((m) => m + 1);
    }
  }

  function reveal() {
    setState("revealed");
    const idx = tokens.findIndex((t) => norm(t) === norm(exercise.answerWord));
    setPicked(idx);
    recordAttempt({
      module: "reading",
      kind: "synonym",
      refId: exercise.id,
      score: 0,
    });
  }

  const done = state === "correct" || state === "revealed";

  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <PanelTitle>Question sentence</PanelTitle>
        <div className="mt-3">
          <SentenceWithTarget
            text={exercise.question}
            target={exercise.targetWord}
          />
        </div>
      </Panel>

      <Panel>
        <PanelTitle>From the passage — tap the matching word</PanelTitle>
        <p className="mt-3 text-[15px] leading-9">
          {tokens.map((t, i) => {
            const isWord = /[\p{L}\p{N}]/u.test(t);
            const isPicked = picked === i;
            const isAnswer = norm(t) === norm(exercise.answerWord);
            return (
              <span key={i}>
                {i > 0 && isWord && /[\p{L}\p{N}]/u.test(tokens[i - 1])
                  ? " "
                  : ""}
                {isWord ? (
                  <button
                    onClick={() => pick(i)}
                    disabled={done}
                    className={cn(
                      "rounded-[5px] px-[3px] transition-colors",
                      !done && "hover:bg-teal-soft hover:text-teal",
                      isPicked && state === "wrong" && "bg-negative-soft text-[#7a1d14] line-through",
                      isPicked && state === "correct" && "bg-positive-soft font-medium text-[#04250e]",
                      state === "revealed" && isAnswer && "bg-teal-soft font-medium text-teal",
                    )}
                  >
                    {t}
                  </button>
                ) : (
                  t
                )}
              </span>
            );
          })}
        </p>
        <div className="mt-4 flex items-center gap-3 border-t border-rule pt-3">
          {state === "correct" && (
            <p className="text-sm font-medium text-positive">
              Correct: “{exercise.answerWord}” means “{exercise.targetWord}”
              here.
            </p>
          )}
          {state === "wrong" && (
            <p className="text-sm text-negative">
              Not that one. Keep looking.
            </p>
          )}
          {state === "revealed" && (
            <p className="text-sm text-muted-foreground">
              The answer was “{exercise.answerWord}”.
            </p>
          )}
          {state === "idle" && (
            <p className="text-sm text-muted-foreground">
              Which word in the passage means “{exercise.targetWord}”?
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
        {done && exercise.explanation && (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {exercise.explanation}
          </p>
        )}
      </Panel>
    </div>
  );
}
