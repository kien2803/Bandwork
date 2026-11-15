// Heuristic paraphrase feedback (no AI): which words the learner kept from the
// original, whether they copied a chunk, and whether the opening structure
// survived. Drives the "what stayed the same" panel in ParaphrasePractice.

const STOPWORDS = new Set(
  "the a an and or but if of to in on for with at by from as is are was were be been being have has had do does did will would can could should may might must that this these those it its they them their we our you your he she his her i not no so than then there here when where which who whom whose what how all any both each few more most other some such only own same also very just about into over after again further once because until while during before between through under above below up down out off".split(
    " ",
  ),
);

const WORD_RE = /[\p{L}]+(?:['’-][\p{L}]+)*/gu;
// Splits text into word / whitespace / punctuation pieces for re-rendering.
const PIECE_RE = /[\p{L}]+(?:['’-][\p{L}]+)*|\s+|[^\s\p{L}'’-]+/gu;

function words(text: string): string[] {
  return (text.match(WORD_RE) ?? []).map((w) => w.toLowerCase());
}

function isContent(w: string): boolean {
  return w.length >= 4 && !STOPWORDS.has(w);
}

export interface ParaphrasePiece {
  text: string;
  word: boolean;
  /** content word carried over unchanged from the original */
  kept: boolean;
  /** part of a copied run of 3+ consecutive original words */
  inChunk: boolean;
}

export interface ParaphraseCheck {
  pieces: ParaphrasePiece[];
  keptCount: number;
  userContentCount: number;
  /** kept content words / user's content words, 0–1 */
  keptRatio: number;
  longestRun: number;
  sameOpening: boolean;
  verdict: "close" | "partial" | "good";
  /** paraphrase degree, 0–100 — higher means further from the original */
  score: number;
}

export function analyzeParaphrase(
  original: string,
  attempt: string,
): ParaphraseCheck {
  const origWords = words(original);
  const origContent = new Set(origWords.filter(isContent));
  const attemptWords = words(attempt);

  // Longest run of consecutive original words copied verbatim, and the
  // attempt-word indices covered by runs of 3+.
  const n = origWords.length;
  const m = attemptWords.length;
  // dp[i][j] = length of common run ending at orig[i], attempt[j]
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  const chunkIdx = new Set<number>();
  let longestRun = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        origWords[i - 1] === attemptWords[j - 1] ? dp[i - 1][j - 1] + 1 : 0;
      if (dp[i][j] > longestRun) longestRun = dp[i][j];
    }
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (dp[i][j] >= 3) {
        for (let k = j - dp[i][j]; k < j; k++) chunkIdx.add(k);
      }
    }
  }

  const attemptContentIdx: number[] = [];
  attemptWords.forEach((w, i) => {
    if (isContent(w)) attemptContentIdx.push(i);
  });
  const keptIdx = new Set(
    attemptContentIdx.filter((i) => origContent.has(attemptWords[i])),
  );
  const userContentCount = attemptContentIdx.length;
  const keptCount = keptIdx.size;
  const keptRatio = userContentCount === 0 ? 0 : keptCount / userContentCount;

  const firstOrig = origWords.find(isContent);
  const firstMine = attemptWords.find(isContent);
  const sameOpening =
    firstOrig !== undefined &&
    firstMine !== undefined &&
    (firstOrig === firstMine ||
      attemptWords.slice(0, 3).join(" ") === origWords.slice(0, 3).join(" "));

  // Map word-index flags onto display pieces (words/space/punct in order).
  const pieces: ParaphrasePiece[] = [];
  let wordPos = 0;
  for (const p of attempt.match(PIECE_RE) ?? []) {
    if (/^[\p{L}]/u.test(p)) {
      pieces.push({
        text: p,
        word: true,
        kept: keptIdx.has(wordPos),
        inChunk: chunkIdx.has(wordPos),
      });
      wordPos++;
    } else {
      pieces.push({ text: p, word: false, kept: false, inChunk: false });
    }
  }

  const score = Math.max(5, Math.min(100, Math.round((1 - keptRatio) * 100)));
  const verdict =
    longestRun >= 5 || keptRatio > 0.65 || (sameOpening && keptRatio > 0.5)
      ? "close"
      : keptRatio > 0.4 || longestRun >= 3 || sameOpening
        ? "partial"
        : "good";

  return {
    pieces,
    keptCount,
    userContentCount,
    keptRatio,
    longestRun,
    sameOpening,
    verdict,
    score,
  };
}
