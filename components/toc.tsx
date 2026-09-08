"use client";

import { useEffect, useState } from "react";

export function TableOfContents({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <div className="font-mono text-[11px] tracking-wide text-[var(--color-ink-faint)] mb-3">
        ON THIS PAGE
      </div>
      <ul className="space-y-2 border-l border-[var(--color-border-soft)]">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block pl-3 -ml-px border-l transition-colors ${
                activeId === h.id
                  ? "border-[var(--color-signal)] text-[var(--color-ink)]"
                  : "border-transparent text-[var(--color-ink-faint)] hover:text-[var(--color-ink-muted)]"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
