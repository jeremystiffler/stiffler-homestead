import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import OutboundClickTracker from "@/components/OutboundClickTracker";
import SubscribePopup from "@/components/SubscribePopup";
import { SITE_CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = SITE_CONFIG.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Stiffler Homestead | Local Food & Family Homesteading Near Lexington KY", template: `%s | Stiffler Homestead` },
  description: "Local homestead meat chickens, eggs, pork, lamb, practical family projects, and YouTube field notes from Lexington, Kentucky.",
  keywords: [
    "Stiffler Homestead",
    "Lexington KY homestead",
    "local meat chickens Lexington KY",
    "farm fresh eggs Lexington KY",
    "pasture raised chicken Kentucky",
    "family homesteading",
    "chicken coop automation",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Stiffler Homestead | Local Food & Family Homesteading Near Lexington KY",
    description: "Local farm food availability, practical homestead projects, and YouTube field notes.",
    url: siteUrl,
    siteName: "Stiffler Homestead",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stiffler Homestead",
    description: "Local food and family homesteading projects near Lexington, Kentucky.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 border-b border-green-900/10 bg-[#fffaf0]/85 shadow-sm backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="group flex min-w-0 items-center gap-3 font-black text-[#183b25]">
              <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 via-lime-200 to-[#2f7d4b] text-xl shadow-lg shadow-green-900/10 ring-2 ring-white transition group-hover:-rotate-3 group-hover:scale-105" aria-hidden="true">
                🐓
                <span className="absolute -right-1 -top-1 text-sm">🌿</span>
              </span>
              <span className="truncate text-base tracking-tight sm:text-lg">Stiffler Homestead</span>
            </Link>
            <div className="flex w-full flex-wrap items-center gap-2 rounded-full border border-green-900/10 bg-white/70 p-1 text-xs font-bold text-gray-700 shadow-sm sm:w-auto sm:justify-end sm:text-sm">
              <Link href="/products" className="rounded-full bg-[#2f7d4b] px-4 py-2 text-white shadow-sm">Storefront</Link>
              <Link href="/blog" className="rounded-full px-3 py-2 hover:bg-[#f7f3ea] hover:text-[#183b25]">Blog</Link>
              <SubscribePopup />
            </div>
          </div>
        </nav>
        <SubscribePopup floating label="Subscribe" />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-[#183b25] py-10 text-sm text-white/75">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-black text-white">© {new Date().getFullYear()} Stiffler Homestead</p>
              <p className="mt-1">Local pickup only near Lexington, KY. As an Amazon Associate I earn from qualifying purchases.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">Storefront</Link>
              <a href={SITE_CONFIG.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a>
              <Link href="/disclosure">Disclosure</Link>
              <Link href="/admin">Admin login</Link>
            </div>
          </div>
        </footer>
        <OutboundClickTracker />
        <Analytics />
      </body>
    </html>
  );
}
