import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RowCard } from "@/components/panel";

export function ExerciseRow({
  href,
  title,
  meta,
  done,
  score,
}: {
  href: string;
  title: string;
  meta: string;
  done: boolean;
  score?: number | null;
}) {
  return (
    <Link href={href} className="block">
      <RowCard className="justify-between transition-colors hover:border-input">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {title}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {meta}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {done ? (
            <span className="num text-xs font-medium text-positive">
              Done{score != null ? ` · ${Math.round(score)}%` : ""}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Not started</span>
          )}
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      </RowCard>
    </Link>
  );
}
