"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocMeta } from "@/lib/docs";

export function DocsSidebar({ docs }: { docs: DocMeta[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs navigation" className="space-y-6">
      <div>
        <div className="font-mono text-[11px] tracking-wide text-[var(--color-ink-faint)] mb-3">
          WRITE-UPS
        </div>
        <ul className="space-y-1">
          {docs.map((doc) => {
            const href = `/docs/${doc.slug}`;
            const active = pathname === href;
            return (
              <li key={doc.slug}>
                <Link
                  href={href}
                  className={`block text-sm py-1.5 pl-3 border-l transition-colors ${
                    active
                      ? "border-[var(--color-signal)] text-[var(--color-ink)]"
                      : "border-transparent text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-border)]"
                  }`}
                >
                  {doc.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <a
        href="https://github.com/aadityansha06/vecdb"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-sm text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] pt-4 border-t border-[var(--color-border-soft)]"
      >
        Edit on GitHub ↗
      </a>
    </nav>
  );
}
