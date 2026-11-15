"use client";

import { useEffect, useState } from "react";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/panel";
import { OptionsQuiz } from "@/components/practice/options";
import { recordAttempt } from "@/lib/attempt";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

export interface ListenChoiceData {
  id: number;
  title: string;
  audio: string;
  options: string[];
  correct: number;
}

export function ListenChoicePractice({
  exercise,
}: {
  exercise: ListenChoiceData;
}) {
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(speechSupported());
    return () => stopSpeaking();
  }, []);

  async function play() {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    setPlays((p) => p + 1);
    await speak(exercise.audio, slow ? 0.72 : 1);
    setPlaying(false);
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <Panel>
        <PanelTitle>Listen</PanelTitle>
        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={play}
            variant={playing ? "secondary" : "default"}
            disabled={!supported}
          >
            {playing ? <Square size={14} /> : <Play size={14} />}
            {playing ? "Stop" : plays === 0 ? "Play" : "Play again"}
          </Button>
          <button
            onClick={() => setSlow((s) => !s)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              slow
                ? "border-teal bg-teal-soft text-teal"
                : "border-input text-muted-foreground hover:text-foreground",
            )}
          >
            Slower
          </button>
          <span className="num ml-auto text-xs text-muted-foreground">
            {plays === 0 ? "not played yet" : `played ${plays}×`}
          </span>
        </div>
        <p className="mt-4 text-[13px] leading-5 text-muted-foreground">
          {supported
            ? "You hear one sentence. Pick the option that says the same thing in different words."
            : "This browser doesn't support speech playback. Try Chrome or Edge."}
        </p>
      </Panel>

      <OptionsQuiz
        options={exercise.options}
        correct={exercise.correct}
        onResult={(score) =>
          recordAttempt({
            module: "listening",
            kind: "listenchoice",
            refId: exercise.id,
            score,
            detail: { plays },
          })
        }
      />
    </div>
  );
}
