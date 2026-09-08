const ROWS = [
  { concurrency: 64, rps: 136, p99: "0.66s", failures: "0/1024" },
  { concurrency: 256, rps: 242, p99: "1.27s", failures: "0/1024" },
  { concurrency: 500, rps: 540, p99: "1.08s", failures: "0/1000" },
  { concurrency: 800, rps: 991, p99: "—", failures: "0/800" },
  { concurrency: 900, rps: 604, p99: "1.01s", failures: "0/900" },
  { concurrency: 950, rps: 585, p99: "1.48s", failures: "0/950" },
];

const MAX_RPS = Math.max(...ROWS.map((r) => r.rps));

export function CapacityChart() {
  return (
    <div className="font-mono text-sm">
      <div className="grid grid-cols-[64px_1fr_70px_60px] sm:grid-cols-[72px_1fr_80px_90px] gap-x-3 sm:gap-x-5 pb-3 mb-1 border-b border-[var(--color-border-soft)] text-[11px] text-[var(--color-ink-faint)]">
        <span>conc.</span>
        <span>req/sec</span>
        <span className="text-right">p99</span>
        <span className="text-right">fails</span>
      </div>
      {ROWS.map((row) => (
        <div
          key={row.concurrency}
          className="grid grid-cols-[64px_1fr_70px_60px] sm:grid-cols-[72px_1fr_80px_90px] gap-x-3 sm:gap-x-5 items-center py-2.5 border-b border-[var(--color-border-soft)] last:border-0"
        >
          <span className="text-[var(--color-ink-muted)]">{row.concurrency}</span>
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 flex-1 bg-[var(--color-border-soft)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(row.rps / MAX_RPS) * 100}%`,
                  background:
                    "linear-gradient(90deg, var(--color-signal-dim), var(--color-signal))",
                }}
              />
            </div>
            <span className="text-[var(--color-ink)] text-xs w-9 text-right">{row.rps}</span>
          </div>
          <span className="text-right text-[var(--color-ink-muted)] text-xs">{row.p99}</span>
          <span className="text-right text-[var(--color-ok)] text-xs">{row.failures}</span>
        </div>
      ))}
    </div>
  );
}
