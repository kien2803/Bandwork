"use client";

import { useEffect, useState } from "react";
import { Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Panel, PanelTitle } from "@/components/panel";
import { DiffView } from "@/components/diff-view";
import { diffWords, type DiffResult } from "@/lib/diff";
import { recordAttempt } from "@/lib/attempt";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

export interface DictationData {
  id: number;
  title: string;
  transcript: string;
}

export function DictationPractice({ clip }: { clip: DictationData }) {
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<DiffResult | null>(null);
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
    await speak(clip.transcript, slow ? 0.72 : 1);
    setPlaying(false);
  }

  function check() {
    const r = diffWords(clip.transcript, typed);
    setResult(r);
    recordAttempt({
      module: "listening",
      kind: "dictation",
      refId: clip.id,
      score: r.accuracy,
      detail: { plays },
    });
  }

  function reset() {
    stopSpeaking();
    setTyped("");
    setResult(null);
    setPlays(0);
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
            aria-label={playing ? "Stop" : "Play"}
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
            ? "Listen as many times as you need, then type exactly what you hear. Punctuation counts."
            : "This browser doesn't support speech playback. Try Chrome or Edge."}
        </p>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel>
          <PanelTitle>Type what you hear</PanelTitle>
          <Textarea
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="The sentence you heard…"
            className="mt-3 min-h-[150px] resize-y rounded-lg border-input bg-sheet text-[15px] leading-7"
          />
          <div className="mt-4 flex items-center gap-2">
            <Button onClick={check} disabled={typed.trim().length < 5}>
              Check
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
              <PanelTitle>Correct transcript</PanelTitle>
              <span className="num text-sm">
                <span className="font-medium">{result.accuracy}%</span>{" "}
                <span className="text-muted-foreground">correct</span>
              </span>
            </div>
            <DiffView segments={result.segments} className="mt-3" />
            <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
              <span className="text-[#7a1d14]">Struck through</span>: words you
              missed ·{" "}
              <span className="text-[#92400e]">Underlined</span>: words you
              added or misheard.
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
