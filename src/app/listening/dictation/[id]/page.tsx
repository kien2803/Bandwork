import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { DictationPractice } from "@/components/practice/dictation";
import { AttemptHistory } from "@/components/attempt-history";

export default async function DictationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clipId = Number(id);
  const clip = await db.dictationClip.findUnique({ where: { id: clipId } });
  if (!clip) notFound();

  const next = await db.dictationClip.findFirst({
    where: { id: { gt: clipId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/listening"
        backLabel="Listening"
        title={`Dictation — ${clip.title}`}
        meta={`Level ${clip.level}`}
        nextHref={next ? `/listening/dictation/${next.id}` : null}
      />
      <DictationPractice clip={clip} />
      <AttemptHistory kind="dictation" refId={clip.id} />
    </div>
  );
}
