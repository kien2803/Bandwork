import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { CopyEssayPractice } from "@/components/practice/copy-essay";
import { AttemptHistory } from "@/components/attempt-history";

export default async function CopyEssayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const essayId = Number(id);
  const essay = await db.sampleEssay.findUnique({ where: { id: essayId } });
  if (!essay) notFound();

  const next = await db.sampleEssay.findFirst({
    where: { id: { gt: essayId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/writing"
        backLabel="Writing"
        title={essay.title}
        meta={`Task ${essay.task === "task1" ? "1" : "2"} · aim for ~${essay.wordTarget} words · band ${essay.band.toFixed(1)} model`}
        nextHref={next ? `/writing/copy/${next.id}` : null}
      />
      <CopyEssayPractice essay={essay} />
      <AttemptHistory kind="copy" refId={essay.id} />
    </div>
  );
}
