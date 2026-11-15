import { db } from "@/lib/db";
import { getLatestScores } from "@/lib/practice";
import { Panel, PanelTitle } from "@/components/panel";
import { ExerciseRow } from "@/components/exercise-list";

export default async function WritingPage() {
  const [essays, paraphrases, copyScores, paraScores] = await Promise.all([
    db.sampleEssay.findMany({ orderBy: { id: "asc" } }),
    db.paraphraseExercise.findMany({ orderBy: { id: "asc" } }),
    getLatestScores("copy"),
    getLatestScores("paraphrase"),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Writing</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Copy model essays from memory and rebuild sentences in your own words.
      </p>

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle>Copy sample essays</PanelTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Read the model, hide it, write it from memory, then compare.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {essays.map((e) => (
              <ExerciseRow
                key={e.id}
                href={`/writing/copy/${e.id}`}
                title={e.title}
                meta={`Task ${e.task === "task1" ? "1" : "2"} · ~${e.wordTarget} words · band ${e.band.toFixed(1)}`}
                done={copyScores.has(e.id)}
                score={copyScores.get(e.id)}
              />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Paraphrase practice</PanelTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Rewrite each sentence, then check against two models.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {paraphrases.map((p, i) => (
              <ExerciseRow
                key={p.id}
                href={`/writing/paraphrase/${p.id}`}
                title={p.original}
                meta={`Exercise ${i + 1} of ${paraphrases.length}`}
                done={paraScores.has(p.id)}
                score={paraScores.get(p.id)}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
