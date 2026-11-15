import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { SynonymPractice } from "@/components/practice/synonym";
import { AttemptHistory } from "@/components/attempt-history";

export default async function SynonymPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exId = Number(id);
  const exercise = await db.synonymExercise.findUnique({
    where: { id: exId },
  });
  if (!exercise) notFound();

  const next = await db.synonymExercise.findFirst({
    where: { id: { gt: exId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/reading"
        backLabel="Reading"
        title={`Synonym finder ${exId}`}
        meta="The question says it one way — the passage says it another"
        nextHref={next ? `/reading/synonym/${next.id}` : null}
      />
      <SynonymPractice exercise={exercise} />
      <AttemptHistory kind="synonym" refId={exercise.id} />
    </div>
  );
}
