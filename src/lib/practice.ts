import { db } from "@/lib/db";

export const KIND_MODULE = {
  copy: "writing",
  paraphrase: "writing",
  synonym: "reading",
  choice: "reading",
  dictation: "listening",
  shadowing: "speaking",
} as const;

export type Kind = keyof typeof KIND_MODULE;
export type Module = (typeof KIND_MODULE)[Kind];

const MODULES: Module[] = ["writing", "reading", "listening", "speaking"];

export async function getExerciseTotals() {
  const [copy, paraphrase, synonym, choice, dictation, shadowing] =
    await Promise.all([
      db.sampleEssay.count(),
      db.paraphraseExercise.count(),
      db.synonymExercise.count(),
      db.paraphraseChoice.count(),
      db.dictationClip.count(),
      db.shadowingClip.count(),
    ]);
  return { copy, paraphrase, synonym, choice, dictation, shadowing };
}

export async function getDoneRefIds(kind: Kind): Promise<Set<number>> {
  const rows = await db.attempt.findMany({
    where: { kind },
    select: { refId: true },
    distinct: ["refId"],
  });
  return new Set(rows.map((r) => r.refId));
}

export async function getTodayCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return db.attempt.count({ where: { createdAt: { gte: today } } });
}

export interface Progress {
  totalDrills: number;
  todayDrills: number;
  /** distinct exercises completed, per module */
  done: Record<Module, number>;
  total: Record<Module, number>;
}

export async function getProgress(): Promise<Progress> {
  const [totals, attempts] = await Promise.all([
    getExerciseTotals(),
    db.attempt.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const doneSets: Record<Kind, Set<number>> = {
    copy: new Set(),
    paraphrase: new Set(),
    synonym: new Set(),
    choice: new Set(),
    dictation: new Set(),
    shadowing: new Set(),
  };
  let todayDrills = 0;
  for (const a of attempts) {
    if (a.createdAt >= today) todayDrills++;
    (doneSets[a.kind as Kind] ?? new Set()).add(a.refId);
  }

  const done: Record<Module, number> = {
    writing: 0,
    reading: 0,
    listening: 0,
    speaking: 0,
  };
  const total: Record<Module, number> = {
    writing: 0,
    reading: 0,
    listening: 0,
    speaking: 0,
  };
  for (const kind of Object.keys(totals) as Kind[]) {
    const mod = KIND_MODULE[kind];
    done[mod] += doneSets[kind].size;
    total[mod] += totals[kind];
  }

  return {
    totalDrills: attempts.length,
    todayDrills,
    done,
    total,
  };
}

/** A short label for an exercise, used in "continue practising" lists. */
export function exerciseLabel(kind: Kind, item: {
  title?: string;
  prompt?: string;
  original?: string;
  passage?: string;
  question?: string;
  transcript?: string;
}): string {
  if (item.title) return item.title;
  const text =
    item.original ?? item.passage ?? item.question ?? item.transcript ?? "";
  return text.length > 64 ? text.slice(0, 64).trimEnd() + "…" : text;
}

export const KIND_HREF: Record<Kind, (id: number) => string> = {
  copy: (id) => `/writing/copy/${id}`,
  paraphrase: (id) => `/writing/paraphrase/${id}`,
  synonym: (id) => `/reading/synonym/${id}`,
  choice: (id) => `/reading/choice/${id}`,
  dictation: (id) => `/listening/dictation/${id}`,
  shadowing: (id) => `/speaking/shadowing/${id}`,
};

export interface RecentAttempt {
  id: number;
  module: string;
  kind: Kind;
  refId: number;
  score: number | null;
  createdAt: Date;
  label: string;
  href: string;
}

function clip(s: string, n = 72) {
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
}

export async function getRecentAttempts(limit = 6): Promise<RecentAttempt[]> {
  const attempts = await db.attempt.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const byKind = new Map<Kind, Set<number>>();
  for (const a of attempts) {
    const k = a.kind as Kind;
    if (!byKind.has(k)) byKind.set(k, new Set());
    byKind.get(k)!.add(a.refId);
  }

  const labels = new Map<string, string>();
  const ids = (k: Kind) => [...(byKind.get(k) ?? new Set<number>())];

  const [essays, paraphrases, synonyms, choices, dictations, shadowings] =
    await Promise.all([
      db.sampleEssay.findMany({ where: { id: { in: ids("copy") } } }),
      db.paraphraseExercise.findMany({ where: { id: { in: ids("paraphrase") } } }),
      db.synonymExercise.findMany({ where: { id: { in: ids("synonym") } } }),
      db.paraphraseChoice.findMany({ where: { id: { in: ids("choice") } } }),
      db.dictationClip.findMany({ where: { id: { in: ids("dictation") } } }),
      db.shadowingClip.findMany({ where: { id: { in: ids("shadowing") } } }),
    ]);
  for (const e of essays) labels.set(`copy:${e.id}`, e.title);
  for (const e of paraphrases) labels.set(`paraphrase:${e.id}`, clip(e.original));
  for (const e of synonyms) labels.set(`synonym:${e.id}`, `“${e.targetWord}” in the passage`);
  for (const e of choices) labels.set(`choice:${e.id}`, clip(e.original));
  for (const e of dictations) labels.set(`dictation:${e.id}`, e.title);
  for (const e of shadowings) labels.set(`shadowing:${e.id}`, clip(e.question));

  return attempts.map((a) => {
    const kind = a.kind as Kind;
    return {
      id: a.id,
      module: a.module,
      kind,
      refId: a.refId,
      score: a.score,
      createdAt: a.createdAt,
      label: labels.get(`${a.kind}:${a.refId}`) ?? `${a.kind} #${a.refId}`,
      href: KIND_HREF[kind]?.(a.refId) ?? "/",
    };
  });
}

export interface NextUp {
  module: Module;
  kind: Kind;
  refId: number;
  label: string;
  href: string;
  remaining: number;
  total: number;
}

/** For each module, the first exercise not yet attempted. */
export async function getNextUp(): Promise<NextUp[]> {
  const [
    essays, paraphrases, synonyms, choices, dictations, shadowings,
    doneCopy, donePara, doneSyn, doneChoice, doneDict, doneShad,
  ] = await Promise.all([
    db.sampleEssay.findMany({ orderBy: { id: "asc" } }),
    db.paraphraseExercise.findMany({ orderBy: { id: "asc" } }),
    db.synonymExercise.findMany({ orderBy: { id: "asc" } }),
    db.paraphraseChoice.findMany({ orderBy: { id: "asc" } }),
    db.dictationClip.findMany({ orderBy: { id: "asc" } }),
    db.shadowingClip.findMany({ orderBy: { id: "asc" } }),
    getDoneRefIds("copy"),
    getDoneRefIds("paraphrase"),
    getDoneRefIds("synonym"),
    getDoneRefIds("choice"),
    getDoneRefIds("dictation"),
    getDoneRefIds("shadowing"),
  ]);

  const groups: {
    kind: Kind;
    items: { id: number; label: string }[];
    done: Set<number>;
  }[] = [
    { kind: "copy", done: doneCopy, items: essays.map((e) => ({ id: e.id, label: e.title })) },
    { kind: "paraphrase", done: donePara, items: paraphrases.map((e) => ({ id: e.id, label: clip(e.original) })) },
    { kind: "synonym", done: doneSyn, items: synonyms.map((e) => ({ id: e.id, label: `“${e.targetWord}” in the passage` })) },
    { kind: "choice", done: doneChoice, items: choices.map((e) => ({ id: e.id, label: clip(e.original) })) },
    { kind: "dictation", done: doneDict, items: dictations.map((e) => ({ id: e.id, label: e.title })) },
    { kind: "shadowing", done: doneShad, items: shadowings.map((e) => ({ id: e.id, label: clip(e.question) })) },
  ];

  const next: NextUp[] = [];
  for (const mod of MODULES) {
    const modGroups = groups.filter((g) => KIND_MODULE[g.kind] === mod);
    const remaining = modGroups.reduce(
      (n, g) => n + g.items.filter((i) => !g.done.has(i.id)).length,
      0,
    );
    const total = modGroups.reduce((n, g) => n + g.items.length, 0);
    for (const g of modGroups) {
      const item = g.items.find((i) => !g.done.has(i.id));
      if (item) {
        next.push({
          module: mod,
          kind: g.kind,
          refId: item.id,
          label: item.label,
          href: KIND_HREF[g.kind](item.id),
          remaining,
          total,
        });
        break;
      }
    }
  }
  return next;
}

/** Latest score per exercise, for list badges. */
export async function getLatestScores(
  kind: Kind,
): Promise<Map<number, number | null>> {
  const rows = await db.attempt.findMany({
    where: { kind },
    orderBy: { createdAt: "desc" },
    select: { refId: true, score: true },
  });
  const map = new Map<number, number | null>();
  for (const r of rows) if (!map.has(r.refId)) map.set(r.refId, r.score);
  return map;
}

/** Per-kind practice stats for the small progress panel on module pages. */
export async function getKindStats(kind: Kind, total: number) {
  const rows = await db.attempt.findMany({
    where: { kind },
    select: { refId: true, score: true },
  });
  const done = new Set(rows.map((r) => r.refId)).size;
  const scored = rows.filter((r) => r.score != null).map((r) => r.score!);
  const avg =
    scored.length > 0
      ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
      : null;
  return { done, total, drills: rows.length, avgScore: avg };
}

export const KIND_NOUN: Record<Kind, string> = {
  copy: "essay copy",
  paraphrase: "paraphrase",
  synonym: "synonym",
  choice: "paraphrase choice",
  dictation: "dictation",
  shadowing: "shadowing",
};
