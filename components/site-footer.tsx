import Link from "next/link";
import { Mark } from "./mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] mt-32">
      <div className="container-page py-14 flex flex-col md:flex-row md:items-start justify-between gap-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <Mark size={20} />
            <span className="font-display text-base">OriginDB</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-faint)]">
            A disk-backed ANN vector database, written from scratch in C.
            Not ready for production — v0.1 soon.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
          <div>
            <div className="font-mono text-xs text-[var(--color-ink-faint)] mb-3">Project</div>
            <ul className="space-y-2.5 text-[var(--color-ink-muted)]">
              <li>
                <a href="https://github.com/aadityansha06/vecdb" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-ink)]">
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/#architecture" className="hover:text-[var(--color-ink)]">
                  Architecture
                </Link>
              </li>
              <li>
                <Link href="/#capacity" className="hover:text-[var(--color-ink)]">
                  Load testing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs text-[var(--color-ink-faint)] mb-3">Docs</div>
            <ul className="space-y-2.5 text-[var(--color-ink-muted)]">
              <li>
                <Link href="/docs/delete-architecture" className="hover:text-[var(--color-ink)]">
                  Delete architecture
                </Link>
              </li>
              <li>
                <Link href="/docs/usage-api" className="hover:text-[var(--color-ink)]">
                  Usage &amp; API
                </Link>
              </li>
              <li>
                <Link href="/docs/deployment-and-capacity" className="hover:text-[var(--color-ink)]">
                  Deployment
                </Link>
              </li>
              <li>
                <Link href="/docs/concurrency" className="hover:text-[var(--color-ink)]">
                  Concurrency
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-xs text-[var(--color-ink-faint)] mb-3">Contact</div>
            <ul className="space-y-2.5 text-[var(--color-ink-muted)]">
              <li>
                <a href="mailto:vermaadityansh@gmail.com" className="hover:text-[var(--color-ink)]">
                  Email
                </a>
              </li>
              <li>
                <a href="https://x.com/aadityansha_06" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-ink)]">
                  X / Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page py-5 border-t border-[var(--color-border-soft)] text-xs text-[var(--color-ink-faint)] font-mono">
        origindb — built by Aadityansh Verma
      </div>
    </footer>
  );
}
