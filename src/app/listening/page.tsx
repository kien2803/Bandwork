import { db } from "@/lib/db";
import { getKindStats, getLatestScores } from "@/lib/practice";
import { Panel, PanelTitle } from "@/components/panel";
import { ExerciseRow } from "@/components/exercise-list";

export default async function ListeningPage() {
  const [clips, scores] = await Promise.all([
    db.dictationClip.findMany({ orderBy: { id: "asc" } }),
    getLatestScores("dictation"),
  ]);
  const stats = await getKindStats("dictation", clips.length);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Listening</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Dictation builds the ear for connected speech. Write exactly what you
        hear.
      </p>

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle>Dictation clips</PanelTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Play, type what you hear, then compare with the transcript.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {clips.map((c) => (
              <ExerciseRow
                key={c.id}
                href={`/listening/dictation/${c.id}`}
                title={c.title}
                meta={`Level ${c.level} · one sentence`}
                done={scores.has(c.id)}
                score={scores.get(c.id)}
              />
            ))}
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <PanelTitle>How to drill</PanelTitle>
            <ol className="mt-3 flex flex-col gap-3 text-sm leading-6 text-foreground">
            <li className="flex gap-3">
              <span className="num text-muted-foreground">1.</span>
              <span>
                Play the clip once at full speed and write what you catch, even
                if it is only half the sentence.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="num text-muted-foreground">2.</span>
              <span>
                Replay with “Slower” on and fill the gaps. Watch for linked
                words like “an hour” sounding like “a nour”.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="num text-muted-foreground">3.</span>
              <span>
                Check against the transcript. Read the missed words aloud:
                that is where your ear is weakest.
              </span>
            </li>
          </ol>
          <p className="mt-4 border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
            Audio uses your browser&rsquo;s speech voices in this MVP; real recordings
            can drop in later without changing the flow.
          </p>
          </Panel>

          <Panel>
            <PanelTitle>Progress</PanelTitle>
            <div className="mt-3 flex flex-col gap-2.5 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Clips done</span>
                <span className="num font-medium">
                  {stats.done} / {stats.total}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Dictations played</span>
                <span className="num font-medium">{stats.drills}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Average accuracy</span>
                <span className="num font-medium">
                  {stats.avgScore != null ? `${stats.avgScore}%` : "—"}
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
