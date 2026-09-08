import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { DeleteFlowDiagram } from "@/components/DeleteFlowDiagram";
import { ConcurrencyChart } from "@/components/ConcurrencyChart";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "OriginDB — the vector database a leaked API key can't empty",
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
    body: "Records get inserted and searched constantly, almost never deleted, and a leaked key must never be able to wipe history.",
  },
  {
    title: "Government records / compliance archive",
    body: "Write-once-ish, read-heavy — deletion is a rare, deliberate, audited event, not a routine action.",
  },
  {
    title: "Song / media recommendation catalog",
    body: "Entries are inserted in batches and searched heavily; removing a track is infrequent and can wait for a human to confirm.",
  },
  {
    title: "Internal analytics / BI dataset",
    body: "Ingested periodically, queried often, rarely if ever needs individual records removed on demand.",
  },
];

const POOR_FIT = [
  {
    title: "Chat apps, social feeds, user-facing delete",
    body: "This design assumes deletion is the exception, not a constant background operation.",
  },
  {
    title: "Anything needing instant delete visibility",
    body: "The deferred-delete model is the point of this project, not a limitation to route around.",
  },
];

const DOCS = [
  {
    slug: "delete-architecture",
    title: "Deferred Delete Architecture",
    body: "Why a leaked API key can never delete your data — the full design, plus how it compares to other vector databases.",
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
    body: "Build and run it, plus real load-test numbers — verified clean up to ~950 concurrent connections.",
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
          OriginDB is a disk-backed Approximate Nearest Neighbor vector
          database, built from scratch in C. A delete request can be sent
          over the network — but it can only ever become an actual deletion
          locally, by a human, on the server itself.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/docs/delete-architecture" variant="primary">
            Read the delete architecture
          </Button>
          <Button
            href="https://github.com/aadityansha06/OriginDB"
            variant="secondary"
            external
          >
            View on GitHub
          </Button>
        </div>
      </section>

      {/* delete flow diagram — replaces the old circle demo */}
      <section className="mt-24">
        <h2 className="font-serif text-2xl text-neutral-50">
          How a delete actually happens
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Deletion is split into two steps on purpose: requesting one can be
          done over the network with a normal API key; executing one can
          only happen here, locally, with an explicit human confirmation.
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
          In most vector databases, a valid API key is the only thing
          standing between a caller and permanent data loss. OriginDB adds a
          second gate that a network request can never cross on its own.
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
          Tested over the public internet on a 2 vCPU / 4GB VM — clean, zero
          failures up to ~950 simultaneous connections; unpredictable right
          around 1000.
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
          This started as a toy project to learn low-level memory management
          and performance work in C — suggestions on where to take the
          deferred-delete idea are genuinely welcome.
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
