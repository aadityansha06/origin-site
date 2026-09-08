import { getAllDocsMeta } from "@/lib/docs";
import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = getAllDocsMeta();

  return (
    <div className="container-page py-12 md:py-16">
      <div className="grid md:grid-cols-[220px_1fr] gap-12">
        <aside className="md:sticky md:top-24 md:self-start">
          <DocsSidebar docs={docs} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
