import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export type DocMeta = {
  slug: string;
  title: string;
  description: string;
  order: number;
};

export function getDocSlugs(): string[] {
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllDocsMeta(): DocMeta[] {
  return getDocSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(DOCS_DIR, `${slug}.md`), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title: (data.title as string) ?? slug,
        description: (data.description as string) ?? "",
        order: (data.order as number) ?? 999,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export async function getDoc(slug: string) {
  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    // unified's plugin overloads don't line up with this plugin's options
    // type across versions; this is a type-level mismatch only.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(rehypeAutolinkHeadings as any, {
      behavior: "wrap" as const,
      properties: { className: "anchor" },
    })
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeStringify)
    .process(content);

  return {
    meta: {
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      order: (data.order as number) ?? 999,
    } as DocMeta,
    html: processed.toString(),
  };
}

/** Lightweight heading extraction for an in-page table of contents. */
export function extractHeadings(html: string) {
  const headingRegex = /<h2 id="([^"]+)"[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/g;
  const headings: { id: string; text: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({ id: match[1], text: match[2].replace(/<[^>]+>/g, "").trim() });
  }
  return headings;
}
