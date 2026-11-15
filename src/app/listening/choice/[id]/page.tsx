import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { ListenChoicePractice } from "@/components/practice/listen-choice";
import { AttemptHistory } from "@/components/attempt-history";

export default async function ListenChoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exId = Number(id);
  const exercise = await db.listenChoice.findUnique({ where: { id: exId } });
  if (!exercise) notFound();

  const next = await db.listenChoice.findFirst({
    where: { id: { gt: exId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/listening"
        backLabel="Listening"
        title={exercise.title}
        meta="Hear the sentence, pick what it means"
        nextHref={next ? `/listening/choice/${next.id}` : null}
      />
      <ListenChoicePractice
        exercise={{
          id: exercise.id,
          title: exercise.title,
          audio: exercise.audio,
          options: JSON.parse(exercise.options) as string[],
          correct: exercise.correct,
        }}
      />
      <AttemptHistory kind="listenchoice" refId={exercise.id} />
    </div>
  );
}
