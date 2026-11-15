"use client";

import { useEffect, useRef, useState } from "react";
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

export function ShadowingPractice({ clip }: { clip: ShadowingData }) {
  const [playing, setPlaying] = useState(false);
  const [showText, setShowText] = useState(true);
  const [recState, setRecState] = useState<RecState>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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

  function markDone() {
    setDone(true);
    recordAttempt({
      module: "speaking",
      kind: "shadowing",
      refId: clip.id,
      detail: { recorded: recState === "recorded" },
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
          <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-5 text-muted-foreground">
            Replay both recordings and compare rhythm, linking and stress, not
            just the words.
          </p>
        </Panel>

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
            <Button variant="secondary" onClick={markDone}>
              Mark as done
            </Button>
          )}
        </Panel>
      </div>
    </div>
  );
}
