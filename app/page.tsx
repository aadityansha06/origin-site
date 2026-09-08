import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { DeleteFlowDiagram } from "@/components/DeleteFlowDiagram";
import { ConcurrencyChart } from "@/components/ConcurrencyChart";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "OriginDB — A vector database built so a stolen API key can never delete anything.",
  description:
    "OriginDB is a disk-backed ANN vector database built in C, with one core guarantee: a delete request can travel over the network, but the actual deletion only ever happens locally, by a human, with explicit confirmation.",
  openGraph: {
    title: "OriginDB — deferred, human-only delete for vector search",
    description:
      "A leaked API key can queue a delete request. It can never execute one. See how OriginDB's deferred delete architecture compares to Pinecone, pgvector, Qdrant, Milvus, and Weaviate.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OriginDB — deferred, human-only delete for vector search",
    description:
      "A leaked API key can queue a delete request. It can never execute one.",
  },
};

const GOOD_FIT = [
  {
    title: "Bank transaction / document search",
    body: "History accumulates for years and is searched constantly. A single leaked key should never be the reason a decade of records disappears in a night.",
  },
  {
    title: "Government records / compliance archive",
    body: "The data is written once and read for the rest of its life. Deletion, when it happens at all, is a deliberate, auditable event — never a side effect of a stolen credential.",
  },
  {
    title: "Song / media recommendation catalog",
    body: "Catalogs grow in batches and get searched millions of times between them. Pulling one track can wait the few minutes it takes a human to look and confirm.",
  },
  {
    title: "Internal analytics / BI dataset",
    body: "Ingested on a schedule, queried constantly, rarely touched by a delete at all — exactly the shape of workload this design was built around.",
  },
];

const POOR_FIT = [
  {
    title: "Chat apps, social feeds, user-facing delete",
    body: "If deletion is something your users do dozens of times a day as a normal action, a human-in-the-loop queue isn't a safeguard — it's a bottleneck. This isn't that database.",
  },
  {
    title: "Anything needing instant delete visibility",
    body: "The delay between a request and an execution isn't a bug waiting to be optimized away. It's the entire point of the architecture.",
  },
];

const DOCS = [
  {
    slug: "delete-architecture",
    title: "Deferred Delete Architecture",
    body: "The full design: why a leaked API key can never delete your data, what it costs to guarantee that, and how it compares to Postgres soft-delete and LSM-tree tombstones.",
    tag: "Start here",
  },
  {
    slug: "usage-api-docs",
    title: "Usage & API Docs",
    body: "The admin CLI, the four network routes, auth, error codes, and working client examples in Python and TypeScript.",
    tag: "Reference",
  },
  {
    slug: "deployment-and-capacity",
    title: "Deployment & Capacity",
    body: "Build it, run it, and see the real load-test numbers behind the claims — verified clean up to ~950 concurrent connections, not estimated.",
    tag: "Ops",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      {/* status banner */}
      <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs font-mono text-neutral-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Not ready for production · v0.1 in progress
      </div>

      {/* hero */}
      <section>
        <h1 className="max-w-3xl font-serif text-4xl leading-tight text-neutral-50 md:text-5xl">
          A vector database a leaked API key can&apos;t empty.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-400">
          Every other vector database treats deletion as just another
          authenticated call — leak the key, lose the data, instantly.
          OriginDB was built from scratch in C to make that specific failure
          structurally impossible: a delete request can travel over the
          network, but nothing on the network can ever cause a byte to
          actually disappear. Only a human, locally, on the machine itself,
          can do that.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/docs/delete-architecture" variant="primary">
            Read the delete architecture
          </Button>
          <Button
            href="https://github.com/aadityansha06/vecdb"
            variant="secondary"
            external
          >
            View on GitHub
          </Button>
        </div>
      </section>

      {/* delete flow diagram */}
      <section className="mt-24">
        <h2 className="font-serif text-2xl text-neutral-50">
          How a delete actually happens
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Deletion is split into two steps that live in two separate,
          non-overlapping code paths on purpose. Requesting one takes a
          normal API key over the network. Executing one takes a person,
          typing a confirmation, on the server itself — after seeing exactly
          how many records are about to go.
        </p>
        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
          <DeleteFlowDiagram />
        </div>
      </section>

      {/* comparison */}
      <section className="mt-24">
        <h2 className="font-serif text-2xl text-neutral-50">
          How this compares to other vector databases
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Soft-delete flags and LSM-tree tombstones aren&apos;t new — Postgres
          and Cassandra have used mechanisms like them for years. What they
          control is how long deleted data stays recoverable. What they
          don&apos;t control is who can trigger a real deletion in the first
          place: any valid credential can, the instant it wants to. OriginDB
          adds a second gate that no network request — authenticated or
          not — can cross on its own.
        </p>
        <div className="mt-8">
          <ComparisonTable />
        </div>
      </section>

      {/* fit */}
      <section className="mt-24 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl text-neutral-50">Good fit</h2>
          <ul className="mt-4 space-y-4">
            {GOOD_FIT.map((f) => (
              <li key={f.title} className="rounded-lg border border-neutral-800 p-4">
                <p className="text-sm font-medium text-neutral-100">{f.title}</p>
                <p className="mt-1 text-sm text-neutral-400">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-xl text-neutral-50">Poor fit — for now</h2>
          <ul className="mt-4 space-y-4">
            {POOR_FIT.map((f) => (
              <li key={f.title} className="rounded-lg border border-neutral-800 p-4">
                <p className="text-sm font-medium text-neutral-100">{f.title}</p>
                <p className="mt-1 text-sm text-neutral-400">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* concurrency */}
      <section className="mt-24">
        <h2 className="font-serif text-2xl text-neutral-50">
          Real load-test numbers, not estimates
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          A security guarantee is only worth as much as the system that
          enforces it stays up. Tested over the public internet against a
          2 vCPU / 4GB VM: zero failures up to roughly 950 simultaneous
          connections, and no crash, hang, or data corruption even past that
          point — just rising latency as the queue does exactly what it was
          designed to do under load.
        </p>
        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
          <ConcurrencyChart />
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          Full table with p50/p99 latency in{" "}
          <a href="/docs/deployment-and-capacity" className="underline underline-offset-4 hover:text-neutral-300">
            Deployment &amp; Capacity
          </a>
          .
        </p>
      </section>

      {/* docs grid */}
      <section className="mt-24">
        <h2 className="font-serif text-2xl text-neutral-50">Docs</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {DOCS.map((d) => (
            <a
              key={d.slug}
              href={`/docs/${d.slug}`}
              className="group rounded-xl border border-neutral-800 p-5 transition-colors hover:border-neutral-600 hover:bg-neutral-900/40"
            >
              <span className="text-xs font-mono uppercase tracking-wide text-amber-400">
                {d.tag}
              </span>
              <h3 className="mt-2 text-base font-medium text-neutral-100 group-hover:text-white">
                {d.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">{d.body}</p>
            </a>
          ))}
        </div>
      </section>

      {/* faq */}
      <section className="mt-24">
        <h2 className="font-serif text-2xl text-neutral-50">
          Frequently asked questions
        </h2>
        <div className="mt-8">
          <Faq />
        </div>
      </section>

      {/* closing cta */}
      <section className="mt-24 rounded-2xl border border-neutral-800 bg-neutral-950 p-10 text-center">
        <h2 className="font-serif text-2xl text-neutral-50">
          Have an idea for where this should go next?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-neutral-400">
          This started as an attempt to learn low-level memory management and
          real performance work in C, not to reinvent the vector database.
          There&apos;s nothing here that Pinecone or Qdrant can&apos;t already
          do faster at scale. The one thing worth arguing about is the trust
          boundary around deletion — and that argument is genuinely still
          open.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="mailto:vermaadityansh@gmail.com" variant="primary" external>
            Email a suggestion
          </Button>
          <Button href="https://x.com/aadityansha_06" variant="secondary" external>
            Reply on X
          </Button>
        </div>
      </section>
    </main>
  );
}
