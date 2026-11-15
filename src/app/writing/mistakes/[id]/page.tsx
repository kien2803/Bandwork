import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { DetailHeader } from "@/components/detail-header";
import { ErrorFixPractice } from "@/components/practice/error-fix";
import { AttemptHistory } from "@/components/attempt-history";

export default async function MistakeFixPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exId = Number(id);
  const item = await db.errorFix.findUnique({ where: { id: exId } });
  if (!item) notFound();

  const next = await db.errorFix.findFirst({
    where: { id: { gt: exId } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <DetailHeader
        backHref="/writing"
        backLabel="Writing"
        title={`Common mistake ${exId}`}
        meta="Spot the error, rewrite the sentence, learn why"
        nextHref={next ? `/writing/mistakes/${next.id}` : null}
      />
      <ErrorFixPractice item={item} />
      <AttemptHistory kind="errorfix" refId={item.id} />
    </div>
  );
}
