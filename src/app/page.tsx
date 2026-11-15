import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel, PanelTitle, RowCard } from "@/components/panel";
import { BandTrack } from "@/components/band-track";
import {
  getNextUp,
  getProgress,
  getRecentAttempts,
  KIND_NOUN,
} from "@/lib/practice";

const MODULE_LABEL: Record<string, string> = {
  writing: "Writing",
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking",
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function relDate(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diff === 0)
    return `Today ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

export default async function Dashboard() {
  const [progress, nextUp, recent] = await Promise.all([
    getProgress(),
    getNextUp(),
    getRecentAttempts(5),
  ]);

  const dateLine = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const tiles = (Object.keys(MODULE_LABEL) as (keyof typeof MODULE_LABEL)[]).map(
    (m) => ({
      module: m,
      label: MODULE_LABEL[m],
      done: progress.done[m as keyof typeof progress.done],
      total: progress.total[m as keyof typeof progress.total],
    }),
  );

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-10 md:px-6 md:pt-[72px]">
      {/* Greeting */}
      <h1 className="font-serif text-[34px] leading-[1.15] text-foreground md:text-5xl">
        {greeting()}.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {dateLine} ·{" "}
        {progress.todayDrills === 0
          ? "no drills yet today. Pick one below."
          : progress.todayDrills === 1
            ? "1 drill done today"
            : `${progress.todayDrills} drills done today`}
      </p>

      {/* Module tiles — 12-col grid, 3 cols each */}
      <div className="mt-[50px] grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.module} href={`/${t.module}`}>
            <Panel className="h-full transition-colors hover:bg-[#f5f4ef]">
              <p className="text-sm text-muted-foreground">{t.label}</p>
              <p className="num mt-2 text-[32px] leading-9 text-foreground">
                {t.done}
                <span className="text-base text-muted-foreground">
                  {" "}
                  / {t.total}
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                exercises done
              </p>
            </Panel>
          </Link>
        ))}
      </div>

      {/* Band track + Today — 9 + 3 */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-4">
        <Panel className="lg:col-span-3">
          <PanelTitle>Band track</PanelTitle>
          <div className="mt-5">
            <BandTrack drillsDone={progress.totalDrills} />
          </div>
        </Panel>
        <Panel>
          <PanelTitle>Today</PanelTitle>
          <p className="num mt-3 text-[32px] leading-9 text-foreground">
            {progress.todayDrills}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {progress.todayDrills === 1 ? "drill" : "drills"} so far
          </p>
          <p className="num mt-4 border-t border-rule pt-3 text-sm text-foreground">
            {progress.totalDrills}{" "}
            <span className="text-xs text-muted-foreground">all time</span>
          </p>
        </Panel>
      </div>

      {/* Continue + Recent — 6 + 6 */}
      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <PanelTitle>Continue practising</PanelTitle>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {nextUp.length === 0 && (
              <p className="rounded-lg border border-dashed border-input px-4 py-3 text-sm text-muted-foreground">
                Every exercise is done. Review your hardest ones again.
              </p>
            )}
            {nextUp.map((n) => (
              <Link key={n.module} href={n.href} className="block">
                <RowCard className="justify-between transition-colors hover:border-input">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {MODULE_LABEL[n.module]} · {KIND_NOUN[n.kind]}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                      {n.label}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-muted-foreground"
                  />
                </RowCard>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Recent activity</PanelTitle>
          <div className="mt-4 flex flex-col gap-2">
            {recent.length === 0 && (
              <p className="rounded-lg border border-dashed border-input px-4 py-3 text-sm text-muted-foreground">
                Nothing yet. Your completed drills will show up here.
              </p>
            )}
            {recent.map((r) => (
              <Link key={r.id} href={r.href} className="block">
                <RowCard className="justify-between transition-colors hover:border-input">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{r.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {MODULE_LABEL[r.module]} · {relDate(r.createdAt)}
                    </p>
                  </div>
                  {r.score != null && (
                    <span className="num shrink-0 text-sm text-foreground">
                      {Math.round(r.score)}%
                    </span>
                  )}
                </RowCard>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
