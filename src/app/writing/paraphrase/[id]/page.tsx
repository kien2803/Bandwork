import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { ParaphrasePractice } from "@/components/practice/paraphrase";
import { AttemptHistory } from "@/components/attempt-history";

export default async function ParaphrasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exId = Number(id);
  const exercise = await db.paraphraseExercise.findUnique({
    where: { id: exId },
  });
  if (!exercise) notFound();

  const next = await db.paraphraseExercise.findFirst({
    where: { id: { gt: exId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/writing"
        backLabel="Writing"
        title={`Paraphrase ${exId}`}
        meta="Rewrite the sentence in your own words"
        nextHref={next ? `/writing/paraphrase/${next.id}` : null}
      />
      <ParaphrasePractice
        exercise={{
          id: exercise.id,
          original: exercise.original,
          models: JSON.parse(exercise.models) as string[],
          tips: JSON.parse(exercise.tips) as string[],
        }}
      />
      <AttemptHistory kind="paraphrase" refId={exercise.id} />
    </div>
  );
}
