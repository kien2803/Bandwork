"use client";

export interface AttemptPayload {
  module: string;
  kind: string;
  refId: number;
  score?: number;
  detail?: unknown;
}

export async function recordAttempt(payload: AttemptPayload) {
  try {
    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Progress is a nicety in the MVP — never block the drill on it.
  }
}
