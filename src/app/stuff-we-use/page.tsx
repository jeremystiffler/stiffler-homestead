import type { Metadata } from "next";
import Link from "next/link";
import LinksSearch from "@/components/LinksSearch";
import { GEAR_ITEMS } from "@/content/gearItems";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Stuff We Use | Stiffler Homestead Gear, Resources & Affiliate Links",
  description:
    "Search the homestead gear, kitchen tools, chicken supplies, family tech, and practical resources the Stiffler family actually uses or recommends.",
  alternates: { canonical: "/stuff-we-use" },
  openGraph: {
    title: "Stuff We Use | Stiffler Homestead",
    description:
      "A searchable shelf of Stiffler Homestead gear, family tech, homestead tools, and affiliate resources.",
    url: "/stuff-we-use",
    siteName: SITE_CONFIG.name,
    type: "website",
  },
};

export default function StuffWeUsePage() {
  const pageUrl = `${SITE_CONFIG.siteUrl}/stuff-we-use`;
  const allTags = Array.from(new Set(GEAR_ITEMS.flatMap((item) => item.tags))).sort();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Stuff We Use",
      url: pageUrl,
      description:
        "Searchable link hub for Stiffler Homestead gear, tools, family tech, affiliate resources, and homestead supply recommendations.",
      isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Stiffler Homestead stuff we use",
      itemListElement: GEAR_ITEMS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.affiliateUrl,
        name: item.name,
        description: item.recommendation,
        keywords: item.tags.join(", "),
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="rounded-[2rem] bg-[#183b25] p-5 text-white shadow-xl shadow-green-900/10 sm:p-8 md:p-12">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Searchable homestead shelf</p>
        <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
          Stuff We Use
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          A practical shelf of the chicken gear, kitchen tools, food preservation supplies, family tech, and homestead resources we actually use or would recommend after learning the muddy way. Search by link title, filter by tags, or browse categories when you are trying to find “that thing Jeremy mentioned” without spelunking through the internet like a raccoon with Wi‑Fi.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#link-search" className="rounded-full bg-amber-300 px-6 py-3 text-center font-black text-[#183b25]">
            Search the shelf
          </a>
          <Link href="/blog" className="rounded-full border border-white/30 px-6 py-3 text-center font-black text-white hover:bg-white/10">
            Read the blog
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6">
        <strong>Affiliate disclosure:</strong> As an Amazon Associate, Stiffler Homestead earns from qualifying purchases. Some links also support us through Wisephone or Covenant Eyes partnerships. Links should be useful first; commission is just the feed bucket riding in the back of the truck.
      </section>

      <section className="mt-10 rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:p-6">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Popular tags</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.slice(0, 24).map((tag) => (
            <a key={tag} href="#link-search" className="rounded-full bg-[#f7f3ea] px-3 py-1 text-xs font-black text-[#183b25] hover:bg-amber-200">
              #{tag}
            </a>
          ))}
        </div>
      </section>

      <LinksSearch items={GEAR_ITEMS} />
    </div>
  );
}
