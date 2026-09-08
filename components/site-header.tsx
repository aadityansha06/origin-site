"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark } from "./mark";

const NAV = [
  { href: "/#architecture", label: "Architecture" },
  { href: "/#capacity", label: "Capacity" },
  { href: "/docs", label: "Docs" },
];

const REPO_URL = "https://github.com/aadityansha06/vecdb";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      key={pathname}
      className="sticky top-0 z-40 border-b border-[var(--color-border-soft)] bg-[var(--color-bg)]/85 backdrop-blur"
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Mark size={24} />
          <span className="font-display text-[1.05rem] tracking-tight">
            OriginDB
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--color-ink-muted)]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-[var(--color-ink)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="#getting-started"
            className="text-sm font-medium px-3.5 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-signal)] hover:text-[var(--color-signal-bright)] transition-colors"
          >
            Read the design
          </a>
        </div>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center text-[var(--color-ink)]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 5H18M2 10H18M2 15H18" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-border-soft)] px-6 py-5 flex flex-col gap-4 text-sm">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-[var(--color-ink-muted)]">
              {item.label}
            </Link>
          ))}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--color-ink-muted)]">
            GitHub
          </a>
        </div>
      )}
    </header>
  );
}
