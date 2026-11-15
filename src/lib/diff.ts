// Word-level diff between a reference text and what the learner produced.
// Tokens are words and punctuation; matching is case-insensitive on the word
// core so "The" matches "the". An LCS backtrack produces three segment kinds:
//   same    — the learner wrote it (or an equivalent word)
//   missing — in the reference but not in the learner's text
//   extra   — in the learner's text but not in the reference

export type DiffType = "same" | "missing" | "extra";

export interface DiffSegment {
  type: DiffType;
  text: string;
  /** the reference word that was replaced, when an "extra" word lines up
      positionally with a "missing" one — lets the UI show "wrote X, meant Y" */
  replaced?: string;
}

export interface DiffResult {
  segments: DiffSegment[];
  /** matched reference tokens / total reference tokens, 0-100 */
  accuracy: number;
  refTokens: number;
  matchedTokens: number;
}

const TOKEN_RE = /[\p{L}\p{N}''-]+|[^\s\p{L}\p{N}''-]+/gu;

function tokenize(text: string): string[] {
  return text.match(TOKEN_RE) ?? [];
}

function key(token: string): string {
  return token.toLowerCase().replace(/[']/g, "'");
}

export function diffWords(reference: string, typed: string): DiffResult {
  const ref = tokenize(reference.trim());
  const got = tokenize(typed.trim());
  const n = ref.length;
  const m = got.length;

  // LCS table
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        key(ref[i]) === key(got[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  // Backtrack: merge runs of missing+extra so a substitution renders as
  // extra tokens that carry the reference word they stand in for.
  const raw: { type: DiffType; text: string }[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (key(ref[i]) === key(got[j])) {
      raw.push({ type: "same", text: got[j] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      raw.push({ type: "missing", text: ref[i] });
      i++;
    } else {
      raw.push({ type: "extra", text: got[j] });
      j++;
    }
  }
  while (i < n) raw.push({ type: "missing", text: ref[i++] });
  while (j < m) raw.push({ type: "extra", text: got[j++] });

  // Pair up adjacent missing/extra tokens into substitutions.
  const segments: DiffSegment[] = [];
  let k = 0;
  while (k < raw.length) {
    const t = raw[k];
    if (t.type === "same") {
      segments.push(t);
      k++;
      continue;
    }
    // Collect a run of non-same tokens.
    const miss: string[] = [];
    const extra: string[] = [];
    while (k < raw.length && raw[k].type !== "same") {
      if (raw[k].type === "missing") miss.push(raw[k].text);
      else extra.push(raw[k].text);
      k++;
    }
    const pairs = Math.min(miss.length, extra.length);
    for (let p = 0; p < pairs; p++) {
      segments.push({ type: "extra", text: extra[p], replaced: miss[p] });
    }
    for (let p = pairs; p < miss.length; p++) {
      segments.push({ type: "missing", text: miss[p] });
    }
    for (let p = pairs; p < extra.length; p++) {
      segments.push({ type: "extra", text: extra[p] });
    }
  }

  const matched = dp[0][0];
  return {
    segments,
    accuracy: n === 0 ? 100 : Math.round((matched / n) * 100),
    refTokens: n,
    matchedTokens: matched,
  };
}
