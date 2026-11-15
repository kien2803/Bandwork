import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 py-24">
      <h1 className="text-2xl font-semibold">That exercise doesn&rsquo;t exist</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        It may have been removed or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-teal hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
