import Link from "next/link";
import { BoundaryVisual } from "@/components/boundary-visual";
import { CapacityChart } from "@/components/capacity-chart";
import { Mark } from "@/components/mark";

const REPO_URL = "https://github.com/aadityansha06/vecdb";

const FEATURES = [
  {
    name: "Variable-length storage engine",
    detail:
      "Zero-padding disk persistence, backed by a memory-mapped data file for concurrent, thread-safe reads.",
  },
  {
    name: "K-means IVF indexing",
    detail: "Mathematical centroid clustering for fast approximate search.",
  },
  {
    name: "Byte-offset random access",
    detail:
      "pread-based direct record retrieval from disk — no full-table scan for a known offset, safe under concurrent reads.",
  },
  {
    name: "Persistent IVF index",
    detail:
      "Trained clusters are serialized to disk and reloaded, so the index survives a restart without retraining.",
  },
  {
    name: "Pluggable distance metrics",
    detail: "Cosine and euclidean, selected per table via a function-pointer router.",
  },
  {
    name: "Cached, shared tables",
    detail:
      "Each table opens once and stays in memory across requests, with inserts and pending deletes synced in on a short background cycle.",
  },
  {
    name: "TCP server, JSON API",
    detail:
      "/search, /insert, /train, /delete-request over raw sockets, parsed with cJSON, backed by a 128-thread worker pool.",
  },
  {
    name: "Per-table API key auth",
    detail: "Key generation and verification scoped to each table, checked on every request.",
  },
  {
    name: "Interactive TUI + one-shot CLI",
    detail: "A REPL for exploring a table, or run a single command directly from the shell.",
  },
];

const GOOD_FIT = [
  "A bank's transaction/document search — insert and search constantly, almost never delete, and a leaked key must never wipe history.",
  "A government records or compliance archive — write-once-ish, read-heavy, deletion is a rare, audited event.",
  "A media recommendation catalog — batch inserts, heavy search, removals are infrequent and can wait for a human.",
  "An internal analytics dataset — ingested periodically, queried often, rarely needs records pulled on demand.",
];

const POOR_FIT = [
  "A chat app, social feed, or anything where users delete their own content in real time.",
  "Any system that needs instant delete visibility with no review step at all.",
];

export default function Home() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="container-page pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-ink-faint)] border border-[var(--color-border)] rounded-full px-3 py-1 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
              v0.1 in progress — not ready for production
            </div>

            <h1 className="font-display text-[2.5rem] leading-[1.08] sm:text-[3.1rem] sm:leading-[1.06] tracking-[-0.01em]">
              A vector database that a stolen key can never empty.
            </h1>

            <p className="mt-6 text-lg text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
              OriginDB is a disk-backed approximate nearest neighbor engine,
              written from scratch in C. A deletion can be requested over the
              network — but it can only ever be carried out locally, by a
              human, on the server itself.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium px-5 py-3 rounded-[var(--radius-sm)] hover:bg-[var(--color-signal-bright)] hover:text-white transition-colors"
              >
                View on GitHub
              </a>
              <Link
                href="/docs/delete-architecture"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal-bright)] transition-colors"
              >
                Read the deferred-delete design
              </Link>
            </div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] p-8">
            <BoundaryVisual />
          </div>
        </div>
      </section>

      {/* ---------------- Why ---------------- */}
      <section className="container-page py-16 md:py-20 border-t border-[var(--color-border-soft)]">
        <div className="grid md:grid-cols-[0.4fr_0.6fr] gap-10">
          <h2 className="font-display text-2xl sm:text-3xl leading-tight">
            Delete requires a human, on purpose.
          </h2>
          <div className="text-[var(--color-ink-muted)] leading-relaxed space-y-4 max-w-2xl">
            <p>
              In most vector databases, delete is just another authenticated
              API call — whoever holds a valid key can remove data over the
              network the same way they insert it. One leaked credential is
              enough to destroy everything, instantly, with no extra steps.
            </p>
            <p>
              OriginDB splits that single action into two code paths that
              never overlap. A network request only ever appends an entry to
              a pending-delete queue — it never opens the data file for
              writing. Only a local admin, on the machine, running{" "}
              <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-soft)]">
                origin process-deletes
              </code>
              , can turn a queued request into a real, on-disk deletion.
            </p>
            <p>
              The result: a fully compromised API key can queue junk requests,
              but it can never make a single byte of real data disappear on
              its own.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Architecture ---------------- */}
      <section id="architecture" className="container-page py-16 md:py-20 border-t border-[var(--color-border-soft)] scroll-mt-20">
        <div className="flex items-baseline justify-between gap-6 mb-10">
          <h2 className="font-display text-2xl sm:text-3xl">Two paths, never overlapping</h2>
          <Link
            href="/docs/delete-architecture"
            className="hidden sm:inline text-sm text-[var(--color-signal-bright)] whitespace-nowrap"
          >
            Full write-up →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-[var(--color-border-soft)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border-soft)]">
          <div className="bg-[var(--color-bg-raised)] p-7">
            <div className="font-mono text-xs text-[var(--color-ink-faint)] mb-3">01 — REQUEST</div>
            <h3 className="font-display text-xl mb-3">Over the network</h3>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed mb-5">
              Triggered by a backend, authenticated with the table&rsquo;s
              normal API key.
            </p>
            <ul className="space-y-2.5 text-sm text-[var(--color-ink-muted)]">
              <li>Appends one entry to the table&rsquo;s pending-delete file</li>
              <li>Never opens data.db for writing</li>
              <li>Never calls db_delete</li>
              <li>Same response whether the id is real or not</li>
            </ul>
          </div>
          <div className="bg-[var(--color-bg-raised)] p-7">
            <div className="font-mono text-xs text-[var(--color-signal-bright)] mb-3">02 — EXECUTION</div>
            <h3 className="font-display text-xl mb-3">Local, human-confirmed</h3>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed mb-5">
              Triggered by an administrator, on the machine, via SSH or a
              local terminal.
            </p>
            <ul className="space-y-2.5 text-sm text-[var(--color-ink-muted)]">
              <li>Reads the pending queue and shows a count</li>
              <li>Asks for y/n confirmation before touching anything</li>
              <li>The only code path that ever calls db_delete</li>
              <li>Clears the queue once every entry is processed</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--color-ink-faint)] max-w-2xl">
          This is a structural guarantee, not a permission check — there is no
          misconfiguration or bypass that turns a network request back into a
          direct delete, because that code path doesn&rsquo;t exist.
        </p>
      </section>

      {/* ---------------- Feature spec sheet ---------------- */}
      <section className="container-page py-16 md:py-20 border-t border-[var(--color-border-soft)]">
        <h2 className="font-display text-2xl sm:text-3xl mb-10">What&rsquo;s built so far</h2>
        <div className="border-t border-[var(--color-border-soft)]">
          {FEATURES.map((f) => (
            <div
              key={f.name}
              className="grid sm:grid-cols-[280px_1fr] gap-2 sm:gap-8 py-5 border-b border-[var(--color-border-soft)]"
            >
              <div className="font-mono text-[0.83rem] text-[var(--color-ink)]">{f.name}</div>
              <div className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{f.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Capacity ---------------- */}
      <section id="capacity" className="container-page py-16 md:py-20 border-t border-[var(--color-border-soft)] scroll-mt-20">
        <div className="grid md:grid-cols-[0.45fr_0.55fr] gap-12">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl mb-4">
              Verified clean to ~950 connections
            </h2>
            <p className="text-[var(--color-ink-muted)] leading-relaxed mb-5">
              Load-tested against a 2 vCPU / 4GB VM over the public internet,
              not localhost — these numbers include real network latency. 128
              worker threads, a 512-slot connection queue. A burst past 512
              pending connections is closed immediately rather than queued
              without bound.
            </p>
            <p className="text-sm text-[var(--color-ink-faint)] leading-relaxed">
              Right around 1,000 concurrent, behavior becomes less
              predictable — never a crash, but latency or rejection rates
              rise. Below that, it&rsquo;s been verified to just work.
            </p>
            <Link
              href="/docs/deployment-and-capacity"
              className="mt-6 inline-block text-sm text-[var(--color-signal-bright)]"
            >
              Full methodology and numbers →
            </Link>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] p-6 sm:p-7">
            <CapacityChart />
          </div>
        </div>
      </section>

      {/* ---------------- Fit ---------------- */}
      <section className="container-page py-16 md:py-20 border-t border-[var(--color-border-soft)]">
        <h2 className="font-display text-2xl sm:text-3xl mb-10">Where this fits</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ok)]" />
              <span className="font-mono text-xs text-[var(--color-ink-faint)]">GOOD FIT</span>
            </div>
            <ul className="space-y-4 text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {GOOD_FIT.map((item) => (
                <li key={item} className="pl-4 border-l border-[var(--color-border)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-signal)]" />
              <span className="font-mono text-xs text-[var(--color-ink-faint)]">POOR FIT, FOR NOW</span>
            </div>
            <ul className="space-y-4 text-sm text-[var(--color-ink-muted)] leading-relaxed">
              {POOR_FIT.map((item) => (
                <li key={item} className="pl-4 border-l border-[var(--color-border)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- Getting started ---------------- */}
      <section id="getting-started" className="container-page py-16 md:py-20 border-t border-[var(--color-border-soft)] scroll-mt-20">
        <div className="grid md:grid-cols-[0.5fr_0.5fr] gap-12 items-start">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl mb-4">Get it running</h2>
            <p className="text-[var(--color-ink-muted)] leading-relaxed mb-6 max-w-md">
              Build the binary, create a table, and start the server. The
              admin CLI runs locally; the network API is what your backend
              talks to.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/docs/usage-api"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-3 rounded-[var(--radius-sm)] bg-[var(--color-ink)] text-[var(--color-bg)] hover:bg-[var(--color-signal-bright)] hover:text-white transition-colors w-fit"
              >
                Read the full docs
              </Link>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] w-fit"
              >
                Clone the repository →
              </a>
            </div>
          </div>

          <pre className="rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] p-6 font-mono text-[0.82rem] leading-relaxed overflow-x-auto">
{`$ make clean && make

$ ./origin
> init movies 128 1000 0
SUCCESS: Initialized DB 'movies'
API key: 8f2c...   (save this)

$ ./origin server 8000
listening on :8000`}
          </pre>
        </div>
      </section>

      {/* ---------------- Docs teaser ---------------- */}
      <section className="container-page py-16 md:py-20 border-t border-[var(--color-border-soft)]">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-2xl sm:text-3xl">Read the write-ups</h2>
          <Link href="/docs" className="hidden sm:inline text-sm text-[var(--color-signal-bright)]">
            All docs →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              href: "/docs/delete-architecture",
              title: "Deferred Delete Architecture",
              desc: "Why a leaked API key can never delete your data.",
            },
            {
              href: "/docs/usage-api",
              title: "Usage & API",
              desc: "The admin CLI and the network API, route by route.",
            },
            {
              href: "/docs/deployment-and-capacity",
              title: "Deployment & Capacity",
              desc: "Build, run, and real load-test numbers.",
            },
            {
              href: "/docs/concurrency",
              title: "Concurrency Model",
              desc: "The thread pool, locking, and the reader-writer lock.",
            },
          ].map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="group rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-[var(--color-bg-raised)] p-6 hover:border-[var(--color-signal)] transition-colors"
            >
              <Mark size={18} className="mb-4 opacity-70" />
              <h3 className="font-display text-base mb-2 group-hover:text-[var(--color-signal-bright)] transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-[var(--color-ink-faint)] leading-relaxed">{doc.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
