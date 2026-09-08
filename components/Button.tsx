import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  className?: string;
};

/**
 * Button
 *
 * Single button component for the whole site — replaces the ad hoc
 * `<a className="...">` styling that was scattered across the landing page.
 *
 * Variants:
 *  - primary:   solid fill, used once per section for the main action
 *               (e.g. "Read the delete architecture", "Get started").
 *  - secondary: outlined, used for supporting actions (e.g. "View on GitHub").
 *
 * States handled: default, hover, focus-visible (keyboard), active.
 * Accessibility: renders a real <a>/<Link>, so it's reachable and
 * operable via keyboard with no extra ARIA needed. focus-visible ring
 * uses a 2px offset outline so it's visible on both light and dark
 * backgrounds.
 */
export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 " +
    "text-sm font-medium transition-colors duration-150 " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-amber-500 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-amber-500 text-neutral-950 hover:bg-amber-400 active:bg-amber-600 shadow-sm shadow-amber-500/20",
    secondary:
      "border border-neutral-700 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-900 active:bg-neutral-800",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
