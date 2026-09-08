"use client";

import { useMemo, useState } from "react";

type Point = { x: number; y: number; id: number };

// Deterministic pseudo-random scatter so server and client render identically.
function seededPoints(count: number): Point[] {
  const pts: Point[] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i++) {
    const angle = rand() * Math.PI * 2;
    const radius = 8 + rand() * 150;
    pts.push({
      x: 150 + Math.cos(angle) * radius,
      y: 150 + Math.sin(angle) * radius,
      id: i,
    });
  }
  return pts;
}

export function BoundaryVisual() {
  const points = useMemo(() => seededPoints(42), []);
  const [radius, setRadius] = useState(72);

  const inside = points.filter(
    (p) => Math.hypot(p.x - 150, p.y - 150) <= radius
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="0 0 300 300" width="100%" height="100%" className="max-w-[320px]">
        <defs>
          <radialGradient id="wash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {[1, 2, 3].map((i) => (
          <line
            key={i}
            x1="150"
            y1="150"
            x2={150 + 150 * Math.cos((i * Math.PI) / 6)}
            y2={150 + 150 * Math.sin((i * Math.PI) / 6)}
            stroke="var(--color-border-soft)"
            strokeWidth="1"
          />
        ))}

        <circle cx="150" cy="150" r={radius} fill="url(#wash)" />
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.6"
          strokeDasharray="4 4"
        />

        {points.map((p) => {
          const isInside = Math.hypot(p.x - 150, p.y - 150) <= radius;
          return (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={isInside ? 3.4 : 2.4}
              fill={isInside ? "var(--color-signal-bright)" : "var(--color-ink-faint)"}
              className="transition-all duration-300"
            />
          );
        })}

        <circle cx="150" cy="150" r="4.5" fill="var(--color-ink)" />
      </svg>

      <div className="w-full max-w-[280px]">
        <div className="flex justify-between font-mono text-xs text-[var(--color-ink-faint)] mb-2">
          <span>r = {radius}</span>
          <span>{inside.length} of {points.length} in range</span>
        </div>
        <input
          type="range"
          min={20}
          max={150}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-[var(--color-signal)]"
          aria-label="Search radius"
        />
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-[var(--color-ink-faint)]">
          x² + y² = r² — every ANN query is the same question: which vectors
          fall inside this boundary around the point you asked about.
        </p>
      </div>
    </div>
  );
}
