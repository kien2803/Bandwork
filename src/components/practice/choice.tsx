"use client";

import { Panel, PanelTitle } from "@/components/panel";
import { OptionsQuiz } from "@/components/practice/options";
import { recordAttempt } from "@/lib/attempt";

export interface ChoiceData {
  id: number;
  original: string;
  options: string[];
  correct: number;
}

export function ChoicePractice({ exercise }: { exercise: ChoiceData }) {
  return (
    <div className="flex flex-col gap-4">
      <Panel>
        <PanelTitle>Original</PanelTitle>
        <p className="mt-3 text-[15px] leading-7 text-foreground">
          {exercise.original}
        </p>
      </Panel>

      <OptionsQuiz
        options={exercise.options}
        correct={exercise.correct}
        onResult={(score) =>
          recordAttempt({
            module: "reading",
            kind: "choice",
            refId: exercise.id,
            score,
          })
        }
      />
    </div>
  );
}
