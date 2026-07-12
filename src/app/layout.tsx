import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import OutboundClickTracker from "@/components/OutboundClickTracker";
import { SITE_CONFIG } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = SITE_CONFIG.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Stiffler Homestead", template: `%s | Stiffler Homestead` },
  description: "Family, faith, animals, simple systems, and practical homesteading projects from the Stiffler family.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Stiffler Homestead",
    description: "Family, faith, animals, simple systems, and practical homesteading projects.",
    url: siteUrl,
    siteName: "Stiffler Homestead",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 border-b border-green-900/10 bg-[#fffaf0]/90 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-black text-[#183b25]">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-300">SH</span>
              <span>Stiffler Homestead</span>
            </Link>
            <div className="flex items-center gap-5 text-sm font-semibold text-gray-700">
              <Link href="/#videos">Videos</Link>
              <Link href="/#newsletter">Subscribe</Link>
              <Link href="/blog">Blog</Link>
              <a href={SITE_CONFIG.supplyGuideUrl} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[#2f7d4b] px-4 py-2 text-white md:inline-block">
                Supply Guide
              </a>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-[#183b25] py-10 text-sm text-white/75">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-black text-white">© {new Date().getFullYear()} Stiffler Homestead</p>
              <p className="mt-1">As an Amazon Associate I earn from qualifying purchases.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href={SITE_CONFIG.youtubeUrl} target="_blank" rel="noreferrer">YouTube</a>
              <a href={SITE_CONFIG.supplyGuideUrl} target="_blank" rel="noreferrer">Homestead Supply Guide</a>
              <Link href="/disclosure">Disclosure</Link>
            </div>
          </div>
        </footer>
        <OutboundClickTracker />
        <Analytics />
      </body>
    </html>
  );
}
