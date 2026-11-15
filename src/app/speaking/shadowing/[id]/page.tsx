import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { ShadowingPractice } from "@/components/practice/shadowing";
import { AttemptHistory } from "@/components/attempt-history";

export default async function ShadowingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clipId = Number(id);
  const clip = await db.shadowingClip.findUnique({ where: { id: clipId } });
  if (!clip) notFound();

  const next = await db.shadowingClip.findFirst({
    where: { id: { gt: clipId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/speaking"
        backLabel="Speaking"
        title={`Shadowing — Part ${clip.part}`}
        meta={clip.question}
        nextHref={next ? `/speaking/shadowing/${next.id}` : null}
      />
      <ShadowingPractice clip={clip} />
      <AttemptHistory kind="shadowing" refId={clip.id} />
    </div>
  );
}
