/**
 * ConcurrencyChart
 *
 * Renders the load-test numbers from Deployment-and-Capacity.md as a bar
 * chart instead of a plain table on the landing page. The full table with
 * p50/p99 latency stays on the docs page for readers who want every number;
 * this is the "read in 3 seconds" version.
 *
 * Data is hardcoded from the real, already-run load test (2 vCPU / 4GB VM,
 * over the public internet, hey load generator) — see
 * content/docs/deployment-and-capacity.md. Update both places together if
 * the numbers are re-measured.
 */
const DATA = [
  { concurrency: 64, rps: 136, failures: "0/1024" },
  { concurrency: 256, rps: 242, failures: "0/1024" },
  { concurrency: 500, rps: 540, failures: "0/1000" },
  { concurrency: 800, rps: 991, failures: "0/800" },
  { concurrency: 900, rps: 604, failures: "0/900" },
  { concurrency: 950, rps: 585, failures: "0/950" },
  { concurrency: 1000, rps: 400, failures: "0–113/1000, varies" },
];

const MAX_RPS = 1000;
const CHART_W = 880;
const CHART_H = 260;
const PAD_L = 56;
const PAD_B = 44;
const PAD_T = 16;
const BAR_GAP = 18;
const plotW = CHART_W - PAD_L - 16;
const plotH = CHART_H - PAD_T - PAD_B;
const barW = (plotW - BAR_GAP * (DATA.length - 1)) / DATA.length;

export function ConcurrencyChart() {
  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H + 20}`}
        className="w-full h-auto"
        role="img"
        aria-labelledby="conc-chart-title conc-chart-desc"
      >
        <title id="conc-chart-title">Requests per second by concurrency level</title>
        <desc id="conc-chart-desc">
          Throughput stays clean with zero failures up to 950 simultaneous
          connections. Right around 1000 concurrent, behavior becomes
          unpredictable — failures range from 0 to 113 out of 1000 depending
          on burst timing, though the server never crashes or corrupts data.
        </desc>

        {/* gridlines */}
        {[0, 250, 500, 750, 1000].map((v) => {
          const y = PAD_T + plotH - (v / MAX_RPS) * plotH;
          return (
            <g key={v}>
              <line x1={PAD_L} x2={CHART_W - 16} y1={y} y2={y} className="stroke-neutral-800" strokeWidth="1" />
              <text x={PAD_L - 10} y={y + 4} textAnchor="end" className="fill-neutral-500 text-[11px] font-mono">{v}</text>
            </g>
          );
        })}

        {/* clean zone shading (up to 950) */}
        <rect
          x={PAD_L}
          y={PAD_T}
          width={(6 / DATA.length) * plotW + BAR_GAP * 5}
          height={plotH}
          className="fill-emerald-500/5"
        />

        {DATA.map((d, i) => {
          const x = PAD_L + i * (barW + BAR_GAP);
          const h = (d.rps / MAX_RPS) * plotH;
          const y = PAD_T + plotH - h;
          const unpredictable = d.concurrency === 1000;
          return (
            <g key={d.concurrency}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="4"
                className={unpredictable ? "fill-red-500/70" : "fill-emerald-500/70"}
              />
              <text x={x + barW / 2} y={y - 8} textAnchor="middle" className="fill-neutral-200 text-[11px] font-mono">
                {unpredictable ? "varies" : d.rps}
              </text>
              <text x={x + barW / 2} y={PAD_T + plotH + 20} textAnchor="middle" className="fill-neutral-400 text-[11px] font-mono">
                {d.concurrency}
              </text>
            </g>
          );
        })}

        {/* axis labels */}
        <text x={PAD_L} y={CHART_H + 14} className="fill-neutral-500 text-[11px] font-mono">
          concurrent connections
        </text>
        <text x={16} y={PAD_T + 8} className="fill-neutral-500 text-[11px] font-mono">
          req/s
        </text>
      </svg>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-neutral-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/70" />
          0 failures, verified clean
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500/70" />
          ~1000: 0–113/1000 failures depending on burst timing
        </span>
      </div>
      <figcaption className="sr-only">
        Bar chart of requests per second at each tested concurrency level,
        from 64 to 1000 simultaneous connections. Zero failures through 950
        connections; behavior becomes unpredictable at 1000.
      </figcaption>
    </figure>
  );
}
