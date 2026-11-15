import { db } from "@/lib/db";
import { getLatestScores } from "@/lib/practice";
import { Panel, PanelTitle } from "@/components/panel";
import { ExerciseRow } from "@/components/exercise-list";

export default async function ReadingPage() {
  const [synonyms, choices, synScores, choiceScores] = await Promise.all([
    db.synonymExercise.findMany({ orderBy: { id: "asc" } }),
    db.paraphraseChoice.findMany({ orderBy: { id: "asc" } }),
    getLatestScores("synonym"),
    getLatestScores("choice"),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Reading</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Train the skill IELTS tests most: spotting paraphrases and synonyms.
      </p>

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Panel>
          <PanelTitle>Synonym finder</PanelTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Find the word in the passage that the question paraphrases.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {synonyms.map((s) => (
              <ExerciseRow
                key={s.id}
                href={`/reading/synonym/${s.id}`}
                title={`“${s.targetWord}” → ?`}
                meta={s.question}
                done={synScores.has(s.id)}
                score={synScores.get(s.id)}
              />
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Paraphrase recognition</PanelTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Pick the option that keeps the original meaning.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {choices.map((c, i) => (
              <ExerciseRow
                key={c.id}
                href={`/reading/choice/${c.id}`}
                title={c.original}
                meta={`Exercise ${i + 1} of ${choices.length}`}
                done={choiceScores.has(c.id)}
                score={choiceScores.get(c.id)}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
