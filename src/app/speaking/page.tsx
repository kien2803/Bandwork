import { db } from "@/lib/db";
import { getKindStats, getLatestScores } from "@/lib/practice";
import { Panel, PanelTitle } from "@/components/panel";
import { ExerciseRow } from "@/components/exercise-list";

export default async function SpeakingPage() {
  const [clips, scores] = await Promise.all([
    db.shadowingClip.findMany({ orderBy: { id: "asc" } }),
    getLatestScores("shadowing"),
  ]);
  const stats = await getKindStats("shadowing", clips.length);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Speaking</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Shadow model answers to build rhythm, stress and fluency.
      </p>

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle>Shadowing clips</PanelTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Play the model, speak along, record yourself, compare.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {clips.map((c) => (
              <ExerciseRow
                key={c.id}
                href={`/speaking/shadowing/${c.id}`}
                title={c.question}
                meta={`Part ${c.part} · short model answer`}
                done={scores.has(c.id)}
                score={scores.get(c.id)}
              />
            ))}
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <PanelTitle>How to shadow</PanelTitle>
            <ol className="mt-3 flex flex-col gap-3 text-sm leading-6 text-foreground">
            <li className="flex gap-3">
              <span className="num text-muted-foreground">1.</span>
              <span>
                Listen to the model once with the text hidden, just for the
                melody of the sentence.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="num text-muted-foreground">2.</span>
              <span>
                Play it again and speak almost at the same time — half a beat
                behind, copying stress and linking.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="num text-muted-foreground">3.</span>
              <span>
                Record yourself, replay both, and note where your rhythm breaks.
                Two or three passes per clip is enough.
              </span>
            </li>
          </ol>
          <p className="mt-4 border-t border-rule pt-3 text-xs leading-5 text-muted-foreground">
            Recording uses your microphone and never leaves this device.
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
                <span className="text-muted-foreground">Sessions</span>
                <span className="num font-medium">{stats.drills}</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
