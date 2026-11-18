import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getErrorSummary, type Trend } from "@/lib/errors";
import { Panel, PanelTitle } from "@/components/panel";
import { cn } from "@/lib/utils";

function relDate(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "yesterday";
  return `${diff} days ago`;
}

const TREND_STYLE: Record<Trend, { label: string; cls: string }> = {
  new: { label: "New", cls: "text-muted-foreground" },
  recurring: { label: "Recurring", cls: "text-[#92400e]" },
  improving: { label: "Improving", cls: "text-positive" },
  quiet: { label: "Quiet", cls: "text-muted-foreground" },
  mastered: { label: "Mastered", cls: "text-teal" },
};

export default async function NotebookPage() {
  const s = await getErrorSummary();

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">
        Error notebook
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every mistake the app catches, grouped by type and tracked over time.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Open issues", value: s.open },
          { label: "Caught this week", value: s.thisWeek },
          { label: "Mastered", value: s.mastered },
        ].map((t) => (
          <div key={t.label} className="rounded-[18px] bg-panel p-4">
            <p className="text-xs text-muted-foreground">{t.label}</p>
            <p className="num mt-1 text-2xl font-medium tracking-[-0.01em]">
              {t.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle>By error type</PanelTitle>
          {s.categories.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-input px-4 py-3 text-[13px] text-muted-foreground">
              Nothing logged yet. Do a few drills — mistakes you make will show
              up here with a trend and a practice link.
            </p>
          ) : (
            <div className="mt-3 flex flex-col">
              {s.categories.map((c) => (
                <div
                  key={c.category}
                  className="flex items-center gap-3 border-b border-rule py-3 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.label}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {c.module} · {c.open} open · {c.total} total · last{" "}
                      {relDate(c.lastSeen)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-xs font-medium",
                      TREND_STYLE[c.trend].cls,
                    )}
                  >
                    {c.trend === "mastered" && (
                      <Check size={12} className="mr-1 inline" />
                    )}
                    {TREND_STYLE[c.trend].label}
                  </span>
                  {c.open > 0 && (
                    <Link
                      href={c.drillHref}
                      className="flex shrink-0 items-center gap-1 rounded-full border border-input px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Practise
                      <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel>
          <PanelTitle>Recent entries</PanelTitle>
          {s.recent.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-input px-4 py-3 text-[13px] text-muted-foreground">
              No entries yet.
            </p>
          ) : (
            <div className="mt-3 flex flex-col">
              {s.recent.map((e) => (
                <div
                  key={e.id}
                  className={cn(
                    "border-b border-rule py-3 last:border-0",
                    e.resolved && "opacity-55",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {e.label}
                    </p>
                    <p className="num shrink-0 text-xs text-muted-foreground">
                      {relDate(e.createdAt)}
                    </p>
                  </div>
                  {e.excerpt && (
                    <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                      {e.excerpt}
                    </p>
                  )}
                  {e.note && (
                    <p className="mt-1 text-[13px] leading-5 text-foreground">
                      {e.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
