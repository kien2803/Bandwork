export function BandworkMark({ size = 22 }: { size?: number }) {
  // Ascending steps: the climb from band 5.5 to 7.0.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3" y="14.5" width="5" height="6.5" rx="1.6" fill="#1b6e66" />
      <rect x="9.5" y="9.5" width="5" height="11.5" rx="1.6" fill="#1b6e66" />
      <rect x="16" y="4.5" width="5" height="16.5" rx="1.6" fill="#1b6e66" />
    </svg>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BandworkMark />
      {!compact && (
        <span className="text-[15px] font-semibold tracking-[-0.01em]">
          Bandwork
        </span>
      )}
    </span>
  );
}
