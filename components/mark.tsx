type MarkProps = {
  size?: number;
  className?: string;
};

/**
 * The OriginDB mark: a circle defined by x^2 + y^2 = r^2, the same boundary
 * a nearest-neighbor search draws around a query vector. Four axis points
 * mark where the circle crosses x=0 / y=0, echoing the original sketch.
 */
export function Mark({ size = 28, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="15.5"
        stroke="var(--color-signal)"
        strokeWidth="2.6"
      />
      <circle cx="20" cy="4.5" r="1.7" fill="var(--color-ink-muted)" />
      <circle cx="20" cy="35.5" r="1.7" fill="var(--color-ink-muted)" />
      <circle cx="4.5" cy="20" r="1.7" fill="var(--color-ink-muted)" />
      <circle cx="35.5" cy="20" r="1.7" fill="var(--color-ink-muted)" />
      <circle cx="20" cy="20" r="1.6" fill="var(--color-signal-bright)" />
    </svg>
  );
}
