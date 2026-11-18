import { db } from "@/lib/db";

// The error notebook. Attempts are the source of truth; this module derives
// typed error entries from them (see logErrorsFromAttempt) and aggregates
// them into category cards with weekly trends (see getErrorSummary).

const ARTICLES = new Set(["the", "a", "an"]);
const PREPOSITIONS = new Set(
  "of to in on for with at by from about between through during under over against without within".split(
    " ",
  ),
);

interface AttemptLike {
  module: string;
  kind: string;
  refId: number;
  score: number | null;
}

type Detail = Record<string, unknown> | null;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, 300) : null;
}

function missingWords(detail: Detail): string[] {
  const m = detail?.missing;
  return Array.isArray(m)
    ? m.filter((w): w is string => typeof w === "string")
    : [];
}

function quoted(words: string[]): string {
  return `missed: ${[...new Set(words)].map((w) => `“${w}”`).join(", ")}`;
}

async function resolveCategory(category: string) {
  await db.errorEntry.updateMany({
    where: { category, resolved: false },
    data: { resolved: true },
  });
}

/** Derive error-log entries from a recorded attempt. Never throws — the
    caller wraps this so logging can't break attempt recording. */
export async function logErrorsFromAttempt(
  attempt: AttemptLike,
  detail: Detail,
) {
  const src = `${attempt.kind}:${attempt.refId}`;
  const entries: {
    category: string;
    excerpt?: string | null;
    note?: string | null;
  }[] = [];

  switch (attempt.kind) {
    case "errorfix": {
      const item = await db.errorFix.findUnique({
        where: { id: attempt.refId },
      });
      if (!item || attempt.score == null) break;
      if (attempt.score >= 90) await resolveCategory(item.mistake);
      else if (attempt.score < 85) {
        entries.push({
          category: item.mistake,
          excerpt: str(detail?.answer) ?? item.flawed,
          note: item.explanation,
        });
      }
      break;
    }

    case "paraphrase": {
      if (attempt.score == null) break;
      if (attempt.score >= 75) await resolveCategory("unchanged wording");
      else if (attempt.score < 55) {
        entries.push({
          category: "unchanged wording",
          excerpt: str(detail?.answer),
          note: "Too much of the original survived — swap the highlighted words and rebuild the opening.",
        });
      }
      break;
    }

    case "copy":
    case "dictation": {
      const missed = missingWords(detail);
      const art = missed.filter((w) => ARTICLES.has(w.toLowerCase()));
      const prep = missed.filter((w) =>
        PREPOSITIONS.has(w.toLowerCase()),
      );
      if (art.length > 0) {
        entries.push({
          category: "articles",
          excerpt: quoted(art),
          note: "You dropped articles when reproducing the text — 'the', 'a' and 'an' all carry marks.",
        });
      } else if ((attempt.score ?? 0) >= 95) {
        await resolveCategory("articles");
      }
      if (prep.length > 0) {
        entries.push({
          category: "prepositions",
          excerpt: quoted(prep),
          note: "Missing prepositions — the small function words like 'of', 'in', 'for' slip easily.",
        });
      } else if ((attempt.score ?? 0) >= 95) {
        await resolveCategory("prepositions");
      }
      if (
        attempt.kind === "dictation" &&
        attempt.score != null &&
        attempt.score < 70 &&
        missed.length > 0
      ) {
        entries.push({
          category: "missed words",
          excerpt: quoted(missed.slice(0, 6)),
          note: "Words your ear dropped. Replay the clip and read them aloud.",
        });
      }
      break;
    }

    case "shadowing": {
      const a = detail?.assessment;
      if (a && typeof a === "object") {
        for (const [key, level] of Object.entries(
          a as Record<string, number>,
        )) {
          if (level === 1) {
            entries.push({
              category: `speaking: ${key}`,
              note: `You rated your ${key} “Needs work” after shadowing.`,
            });
          } else if (level === 3) {
            await resolveCategory(`speaking: ${key}`);
          }
        }
      }
      break;
    }
  }

  for (const e of entries) {
    await db.errorEntry.create({
      data: {
        category: e.category,
        module: attempt.module,
        source: src,
        excerpt: e.excerpt ?? null,
        note: e.note ?? null,
      },
    });
  }
}

// --- Display helpers -------------------------------------------------------

function title(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function categoryLabel(category: string): string {
  return category.startsWith("speaking:")
    ? `${title(category.slice(9))} · speaking`
    : title(category);
}

/** Where to send the learner to work on this error type. */
export async function drillHrefFor(category: string): Promise<string> {
  if (category.startsWith("speaking:")) return "/speaking";
  const fix = await db.errorFix.findFirst({ where: { mistake: category } });
  if (fix) return `/writing/mistakes/${fix.id}`;
  if (category === "unchanged wording") return "/writing";
  if (category === "missed words") return "/listening";
  return "/writing";
}

export type Trend = "new" | "recurring" | "improving" | "quiet" | "mastered";

export interface CategorySummary {
  category: string;
  label: string;
  module: string;
  total: number;
  open: number;
  lastSeen: Date;
  thisWeek: number;
  lastWeek: number;
  trend: Trend;
  drillHref: string;
}

export interface ErrorSummary {
  open: number;
  mastered: number;
  thisWeek: number;
  categories: CategorySummary[];
  recent: {
    id: number;
    category: string;
    label: string;
    module: string;
    excerpt: string | null;
    note: string | null;
    resolved: boolean;
    createdAt: Date;
  }[];
}

export async function getErrorSummary(): Promise<ErrorSummary> {
  const entries = await db.errorEntry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const now = Date.now();
  const weekAgo = now - 7 * 86400000;
  const twoWeeksAgo = now - 14 * 86400000;

  const byCat = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = byCat.get(e.category) ?? [];
    list.push(e);
    byCat.set(e.category, list);
  }

  const categories: CategorySummary[] = [];
  for (const [category, list] of byCat) {
    const open = list.filter((e) => !e.resolved).length;
    const thisWeek = list.filter(
      (e) => e.createdAt.getTime() >= weekAgo,
    ).length;
    const lastWeek = list.filter(
      (e) =>
        e.createdAt.getTime() >= twoWeeksAgo &&
        e.createdAt.getTime() < weekAgo,
    ).length;
    const trend: Trend =
      open === 0
        ? "mastered"
        : thisWeek === 0
          ? "quiet"
          : lastWeek === 0
            ? "new"
            : thisWeek > lastWeek
              ? "recurring"
              : "improving";
    categories.push({
      category,
      label: categoryLabel(category),
      module: list[0].module,
      total: list.length,
      open,
      lastSeen: list[0].createdAt,
      thisWeek,
      lastWeek,
      trend,
      drillHref: await drillHrefFor(category),
    });
  }
  categories.sort((a, b) => b.open - a.open || b.total - a.total);

  return {
    open: entries.filter((e) => !e.resolved).length,
    mastered: entries.filter((e) => e.resolved).length,
    thisWeek: entries.filter((e) => e.createdAt.getTime() >= weekAgo).length,
    categories,
    recent: entries.slice(0, 10).map((e) => ({
      id: e.id,
      category: e.category,
      label: categoryLabel(e.category),
      module: e.module,
      excerpt: e.excerpt,
      note: e.note,
      resolved: e.resolved,
      createdAt: e.createdAt,
    })),
  };
}
