import { db } from "@/lib/db";
import { Panel, PanelTitle } from "@/components/panel";

function relDate(d: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - day.getTime()) / 86400000);
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (diff === 0) return `Today ${time}`;
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

function detailBits(detail: string | null): string[] {
  if (!detail) return [];
  try {
    const d = JSON.parse(detail) as Record<string, unknown>;
    const bits: string[] = [];
    if (typeof d.plays === "number") bits.push(`played ${d.plays}×`);
    if (typeof d.words === "number") bits.push(`${d.words} words`);
    if (typeof d.kept === "number") bits.push(`${d.kept} words kept`);
    if (d.recorded === true) bits.push("recorded");
    if (d.assessment && typeof d.assessment === "object")
      bits.push("self-checked");
    return bits;
  } catch {
    return [];
  }
}

export async function AttemptHistory({
  kind,
  refId,
}: {
  kind: string;
  refId: number;
}) {
  const attempts = await db.attempt.findMany({
    where: { kind, refId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <Panel className="mt-4">
      <PanelTitle>Your attempts</PanelTitle>
      {attempts.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-input px-4 py-3 text-[13px] text-muted-foreground">
          No attempts yet. Your results will be listed here.
        </p>
      ) : (
        <div className="mt-2 flex flex-col">
          {attempts.map((a) => {
            const bits = detailBits(a.detail);
            return (
              <div
                key={a.id}
                className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5 text-sm last:border-0"
              >
                <span className="text-muted-foreground">
                  {relDate(a.createdAt)}
                  {bits.length > 0 && (
                    <span className="text-muted-foreground"> · {bits.join(" · ")}</span>
                  )}
                </span>
                {a.score != null && (
                  <span className="num font-medium text-foreground">
                    {Math.round(a.score)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
