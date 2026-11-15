import { cn } from "@/lib/utils";

export function Panel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-xl bg-panel p-5", className)} {...props} />
  );
}

export function PanelTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}

/** A 63px row card: one step lighter than its panel, border one step darker. */
export function RowCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-[63px] items-center gap-4 rounded-[14px] border border-border bg-sheet px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
