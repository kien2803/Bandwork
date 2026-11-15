import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function DetailHeader({
  backHref,
  backLabel,
  title,
  meta,
  nextHref,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  meta?: string;
  nextHref?: string | null;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={15} />
          {backLabel}
        </Link>
        {nextHref && (
          <Link
            href={nextHref}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Next exercise
            <ArrowRight size={15} />
          </Link>
        )}
      </div>
      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-foreground">
        {title}
      </h1>
      {meta && <p className="mt-1 text-sm text-muted-foreground">{meta}</p>}
    </div>
  );
}
