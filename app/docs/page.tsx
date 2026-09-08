import Link from "next/link";
import type { Metadata } from "next";
import { getAllDocsMeta } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "OriginDB documentation: the deferred-delete architecture, the usage & API reference, deployment and capacity numbers, and the concurrency model.",
};

export default function DocsIndexPage() {
  const docs = getAllDocsMeta();

  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl mb-3">Documentation</h1>
      <p className="text-[var(--color-ink-muted)] max-w-xl mb-12 leading-relaxed">
        Early / WIP. These write-ups describe what the code actually does
        today, rough edges included.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="group rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] p-6 hover:border-[var(--color-signal)] transition-colors"
          >
            <div className="font-mono text-xs text-[var(--color-ink-faint)] mb-3">
              {String(doc.order).padStart(2, "0")}
            </div>
            <h2 className="font-display text-lg mb-2 group-hover:text-[var(--color-signal-bright)] transition-colors">
              {doc.title}
            </h2>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {doc.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
