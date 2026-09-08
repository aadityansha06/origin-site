import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDoc, getDocSlugs, extractHeadings } from "@/lib/docs";
import { TableOfContents } from "@/components/toc";

export async function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getDocSlugs();
  if (!slugs.includes(slug)) return {};

  const { meta } = await getDoc(slug);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/docs/${slug}` },
    openGraph: {
      title: `${meta.title} — OriginDB`,
      description: meta.description,
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getDocSlugs();
  if (!slugs.includes(slug)) notFound();

  const { meta, html } = await getDoc(slug);
  const headings = extractHeadings(html);

  return (
    <div className="grid lg:grid-cols-[1fr_180px] gap-12">
      <article>
        <div className="font-mono text-xs text-[var(--color-ink-faint)] mb-3">
          {String(meta.order).padStart(2, "0")} / DOCS
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mb-3 tracking-tight">
          {meta.title}
        </h1>
        <p className="text-[var(--color-ink-muted)] max-w-2xl mb-10 leading-relaxed">
          {meta.description}
        </p>
        <div className="doc-prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {headings.length > 0 && (
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </div>
      )}
    </div>
  );
}
