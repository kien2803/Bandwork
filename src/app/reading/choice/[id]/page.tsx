import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { ChoicePractice } from "@/components/practice/choice";
import { AttemptHistory } from "@/components/attempt-history";

export default async function ChoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exId = Number(id);
  const exercise = await db.paraphraseChoice.findUnique({
    where: { id: exId },
  });
  if (!exercise) notFound();

  const next = await db.paraphraseChoice.findFirst({
    where: { id: { gt: exId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/reading"
        backLabel="Reading"
        title={`Paraphrase ${exId}`}
        meta="One option keeps the meaning — the others change it"
        nextHref={next ? `/reading/choice/${next.id}` : null}
      />
      <ChoicePractice
        exercise={{
          id: exercise.id,
          original: exercise.original,
          options: JSON.parse(exercise.options) as string[],
          correct: exercise.correct,
        }}
      />
      <AttemptHistory kind="choice" refId={exercise.id} />
    </div>
  );
}
