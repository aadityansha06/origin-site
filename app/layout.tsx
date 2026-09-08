import type { Metadata } from "next";
// TEMP
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const fraunces = { variable: "font-display-temp" };
const inter = { variable: "font-body-temp" };
const jetbrainsMono = { variable: "font-mono-temp" };

const SITE_URL = "https://origindb.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OriginDB — a vector database that can't be deleted by a leaked key",
    template: "%s — OriginDB",
  },
  description:
    "OriginDB is a disk-backed approximate nearest neighbor vector database, written from scratch in C, built around a deferred-delete architecture: deletion can be requested over the network, but only ever executed locally, by a human.",
  keywords: [
    "OriginDB",
    "vector database",
    "ANN",
    "approximate nearest neighbor",
    "vector search",
    "C database",
    "deferred delete",
    "IVF index",
    "embedding database",
  ],
  authors: [{ name: "Aadityansh Verma", url: "https://x.com/aadityansha_06" }],
  creator: "Aadityansh Verma",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "OriginDB",
    title: "OriginDB — a vector database that can't be deleted by a leaked key",
    description:
      "A disk-backed ANN vector database written from scratch in C. Deletion can be requested over the network, but only ever executed locally, by a human.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "OriginDB" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aadityansha_06",
    creator: "@aadityansha_06",
    title: "OriginDB — a vector database that can't be deleted by a leaked key",
    description:
      "A disk-backed ANN vector database written from scratch in C, built around a deferred-delete architecture.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: "OriginDB",
    description:
      "A disk-backed approximate nearest neighbor vector database written from scratch in C, with a deferred-delete architecture.",
    programmingLanguage: "C",
    codeRepository: "https://github.com/aadityansha06/vecdb",
    author: {
      "@type": "Person",
      name: "Aadityansh Verma",
    },
    url: SITE_URL,
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="noise" aria-hidden="true" />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
