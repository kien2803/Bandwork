// The band track — this product's signature element. A 4.0-9.0 band scale
// with the learner's current band (5.5) and goal (7.0) as markers, and a teal
// fill that moves with drills completed (~60 drills across the 1.5-band gap).

const MIN = 4;
const MAX = 9;
const CURRENT = 5.5;
const GOAL = 7.0;
const DRILLS_FOR_GOAL = 60;

function pct(v: number) {
  return ((v - MIN) / (MAX - MIN)) * 100;
}

export function BandTrack({ drillsDone }: { drillsDone: number }) {
  const progress = Math.min(GOAL - CURRENT, (drillsDone / DRILLS_FOR_GOAL) * (GOAL - CURRENT));
  const at = CURRENT + progress;
  const remaining = Math.max(0, DRILLS_FOR_GOAL - drillsDone);
  const ticks = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

  return (
    <div>
      <div className="relative h-3 rounded-full bg-[#eae9e4]">
        <div
          className="absolute inset-y-0 rounded-full bg-teal"
          style={{ left: `${pct(CURRENT)}%`, width: `${pct(at) - pct(CURRENT)}%` }}
        />
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute top-0 h-3 w-px bg-sheet"
            style={{ left: `${pct(t)}%` }}
          />
        ))}
        {/* current marker */}
        <span
          className="absolute top-1/2 size-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-ink bg-sheet"
          style={{ left: `${pct(CURRENT)}%` }}
        />
        {/* goal marker */}
        <span
          className="absolute top-1/2 size-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-teal bg-teal"
          style={{ left: `${pct(GOAL)}%` }}
        />
      </div>
      <div className="relative mt-2 h-4 text-xs text-muted-foreground">
        {[4, 5, 6, 7, 8, 9].map((t) => (
          <span
            key={t}
            className="num absolute -translate-x-1/2"
            style={{ left: `${pct(t)}%` }}
          >
            {t.toFixed(1)}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        <span>
          <span className="num font-medium">5.5</span>{" "}
          <span className="text-muted-foreground">current</span>
        </span>
        <span>
          <span className="num font-medium text-teal">7.0</span>{" "}
          <span className="text-muted-foreground">goal</span>
        </span>
        <span className="ml-auto text-muted-foreground">
          {drillsDone === 0
            ? `about ${DRILLS_FOR_GOAL} drills to close the gap`
            : remaining === 0
              ? "gap covered. Book a mock test"
              : `${drillsDone} ${drillsDone === 1 ? "drill" : "drills"} done · about ${remaining} to go`}
        </span>
      </div>
    </div>
  );
}
