"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Mic,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/panel";
import { recordAttempt } from "@/lib/attempt";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

export interface ShadowingData {
  id: number;
  part: number;
  question: string;
  transcript: string;
}

type RecState = "idle" | "recording" | "recorded";

const CRITERIA = [
  { key: "fluency", label: "Fluency", hint: "smooth, few hesitations" },
  { key: "pronunciation", label: "Pronunciation", hint: "clear sounds and stress" },
  { key: "lexical", label: "Lexical resource", hint: "varied, precise words" },
  { key: "grammar", label: "Grammar", hint: "accurate structures" },
] as const;
type CriterionKey = (typeof CRITERIA)[number]["key"];
const LEVELS = ["Needs work", "Getting there", "Confident"];

export function ShadowingPractice({ clip }: { clip: ShadowingData }) {
  const [playing, setPlaying] = useState(false);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [showText, setShowText] = useState(true);
  const [recState, setRecState] = useState<RecState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Partial<Record<CriterionKey, number>>>({});
  const [done, setDone] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const sentences = useMemo(
    () =>
      clip.transcript
        .match(/[^.!?]+[.!?]+["'’]?/g)
        ?.map((s) => s.trim()) ?? [clip.transcript],
    [clip.transcript],
  );

  const allRated = CRITERIA.every((c) => ratings[c.key] != null);

  useEffect(() => {
    setSupported(speechSupported());
    return () => {
      stopSpeaking();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function playModel() {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    await speak(clip.transcript, 0.92);
    setPlaying(false);
  }

  async function playSentence(i: number) {
    if (playingIdx === i) {
      stopSpeaking();
      setPlayingIdx(null);
      return;
    }
    setPlayingIdx(i);
    await speak(sentences[i], 0.92);
    setPlayingIdx((cur) => (cur === i ? null : cur));
  }

  async function startRecording() {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: rec.mimeType || "audio/webm",
        });
        setAudioUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecState("recorded");
      };
      recRef.current = rec;
      rec.start();
      setRecState("recording");
    } catch {
      setMicError("Microphone access was denied or is unavailable.");
    }
  }

  function stopRecording() {
    recRef.current?.stop();
  }

  function rerecord() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecState("idle");
  }

  function saveCheck(withAssessment: boolean) {
    setDone(true);
    const vals = CRITERIA.map((c) => ratings[c.key] ?? 0);
    recordAttempt({
      module: "speaking",
      kind: "shadowing",
      refId: clip.id,
      score:
        withAssessment && allRated
          ? Math.round((vals.reduce((a, b) => a + b, 0) / (4 * 3)) * 100)
          : undefined,
      detail: {
        recorded: recState === "recorded",
        assessment: withAssessment && allRated ? ratings : undefined,
      },
    });
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
      <Panel>
        <PanelTitle>Model answer · Part {clip.part}</PanelTitle>
        <p className="mt-3 text-sm italic leading-6 text-muted-foreground">
          {clip.question}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Button
            onClick={playModel}
            variant={playing ? "secondary" : "default"}
            disabled={!supported}
          >
            {playing ? <Square size={14} /> : <Play size={14} />}
            {playing ? "Stop" : "Play model"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowText((s) => !s)}>
            {showText ? <EyeOff size={14} /> : <Eye size={14} />}
            {showText ? "Hide text" : "Show text"}
          </Button>
        </div>
        <p
          className={cn(
            "mt-4 text-[15px] leading-7 text-foreground transition-opacity",
            !showText && "select-none opacity-0",
          )}
          aria-hidden={!showText}
        >
          {clip.transcript}
        </p>
        {!showText && (
          <p className="-mt-6 text-sm text-muted-foreground">
            Hidden. Listen and speak along.
          </p>
        )}

        {sentences.length > 1 && (
          <div className="mt-4 border-t border-rule pt-3">
            <p className="text-[13px] font-medium text-foreground">
              Sentence by sentence
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {sentences.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <button
                    onClick={() => playSentence(i)}
                    disabled={!supported}
                    aria-label={`Play sentence ${i + 1}`}
                    className={cn(
                      "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                      playingIdx === i
                        ? "border-teal bg-teal text-white"
                        : "border-input text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {playingIdx === i ? <Square size={10} /> : <Play size={11} />}
                  </button>
                  <span
                    className={cn(
                      "text-sm leading-7 text-foreground",
                      !showText && "text-muted-foreground",
                    )}
                  >
                    {showText ? s : `Sentence ${i + 1}`}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
              Play one model sentence, replay your recording, and compare the
              rhythm of just that line.
            </p>
          </div>
        )}

        <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
          {supported
            ? "Shadowing: play the model and speak at almost the same time, copying the rhythm and stress, then record yourself."
            : "This browser doesn't support speech playback. Try Chrome or Edge."}
        </p>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel>
          <PanelTitle>Your recording</PanelTitle>
          {micError && (
            <p className="mt-3 rounded-lg bg-negative-soft px-3 py-2 text-xs text-[#7a1d14]">
              {micError}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {recState !== "recording" ? (
              <Button onClick={startRecording}>
                <Mic size={14} />
                {recState === "recorded" ? "Record again" : "Record"}
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="secondary">
                <Square size={14} />
                Stop
              </Button>
            )}
            {recState === "recorded" && (
              <Button variant="ghost" onClick={rerecord}>
                <RotateCcw size={14} />
                Clear
              </Button>
            )}
          </div>
          {recState === "recording" && (
            <p className="mt-3 flex items-center gap-2 text-sm text-negative">
              <span className="size-2 rounded-full bg-negative" />
              Recording. Play the model and speak along.
            </p>
          )}
          {audioUrl && (
            <audio controls src={audioUrl} className="mt-4 h-10 w-full" />
          )}
        </Panel>

        {recState === "recorded" && (
          <Panel>
            <PanelTitle>Self-check</PanelTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Replay your recording and rate each criterion honestly.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {CRITERIA.map((c) => (
                <div
                  key={c.key}
                  className="flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {c.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{c.hint}</p>
                  </div>
                  <div className="flex gap-1">
                    {LEVELS.map((level, i) => (
                      <button
                        key={level}
                        onClick={() =>
                          setRatings((r) => ({ ...r, [c.key]: i + 1 }))
                        }
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs transition-colors",
                          ratings[c.key] === i + 1
                            ? "border-teal bg-teal-soft text-teal"
                            : "border-input text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-rule pt-3">
              {done ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-positive">
                  <Check size={15} />
                  Saved
                </span>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => saveCheck(true)}
                    disabled={!allRated}
                  >
                    Save self-check
                  </Button>
                  <button
                    onClick={() => saveCheck(false)}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Skip rating
                  </button>
                </>
              )}
            </div>
          </Panel>
        )}

        {recState !== "recorded" && (
          <Panel className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Finished shadowing this clip?
            </p>
            {done ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-positive">
                <Check size={15} />
                Done
              </span>
            ) : (
              <Button variant="secondary" onClick={() => saveCheck(false)}>
                Mark as done
              </Button>
            )}
          </Panel>
        )}
      </div>
    </div>
  );
}
