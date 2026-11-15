"use client";

// Thin wrapper over the Web Speech API. Used for dictation and shadowing
// playback in the MVP — real audio files can replace this later by swapping
// speak() for an <audio> element pointed at clip URLs.

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  if (typeof speechSynthesis === "undefined") {
    cachedVoice = null;
    return null;
  }
  const voices = speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => /en[-_]GB/i.test(v.lang) && /google/i.test(v.name)) ??
    voices.find((v) => /en[-_]GB/i.test(v.lang)) ??
    voices.find((v) => /^en/i.test(v.lang)) ??
    null;
  return cachedVoice;
}

export function speechSupported() {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance !== "undefined"
  );
}

export function speak(text: string, rate = 1): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!speechSupported()) {
      reject(new Error("Speech synthesis is not available in this browser."));
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve(); // treat cancel/interrupt as done
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (speechSupported()) speechSynthesis.cancel();
}
