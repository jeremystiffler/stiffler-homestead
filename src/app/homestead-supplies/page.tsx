import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Homestead Supplies & Family Tech We Recommend",
  description:
    "Shop practical homestead supply guides, Amazon affiliate searches, Wisephone, and Covenant Eyes resources recommended by Stiffler Homestead.",
  alternates: { canonical: "/homestead-supplies" },
  openGraph: {
    title: "Homestead Supplies & Family Tech We Recommend | Stiffler Homestead",
    description:
      "A practical hub for homestead gear, Amazon affiliate search links, family-tech tools, and Stiffler Homestead buying guides.",
    url: "/homestead-supplies",
    siteName: SITE_CONFIG.name,
    type: "website",
  },
};

function amazonSearch(query: string) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${SITE_CONFIG.amazonTag}`;
}

const supplyCategories = [
  {
    title: "Chicken coop automation",
    copy: "Doors, waterers, feeders, cameras, fencing, and winter water supplies that reduce daily chores.",
    href: `${SITE_CONFIG.supplyGuideUrl}/posts/automatic-chicken-coop-supply-guide`,
    cta: "Read the coop automation guide",
  },
  {
    title: "Composting & garden basics",
    copy: "Simple compost bins, soil tools, garden hand tools, and practical starter equipment for backyard food systems.",
    href: amazonSearch("homestead compost bin garden tools"),
    cta: "Search compost gear on Amazon",
  },
  {
    title: "Food preservation",
    copy: "Pressure canners, water-bath canning tools, dehydrators, freeze dryers, and pantry storage for preserving the harvest.",
    href: amazonSearch("homestead food preservation pressure canner dehydrator"),
    cta: "Search preservation gear on Amazon",
  },
  {
    title: "Outdoor cooking & cast iron",
    copy: "Dutch ovens, campfire cooking tools, cast iron, and durable kitchen gear that can survive family meals and farm days.",
    href: amazonSearch("cast iron dutch oven outdoor cooking homestead"),
    cta: "Search outdoor cooking gear",
  },
  {
    title: "Family-safe phones",
    copy: "Wisephone is a calmer phone option for families trying to reduce screen chaos without disappearing from modern life.",
    href: SITE_CONFIG.wisephoneDiscountUrl,
    cta: "See Wisephone discount",
  },
  {
    title: "Digital accountability",
    copy: "Covenant Eyes is a practical accountability tool for internet-connected devices in homes that care about digital discipleship.",
    href: SITE_CONFIG.covenantEyesUrl,
    cta: "See Covenant Eyes",
  },
];

const monetizationFaqs = [
  {
    question: "Do affiliate links cost extra?",
    answer:
      "No. Affiliate links can support Stiffler Homestead at no extra cost to you when you buy through a qualifying link.",
  },
  {
    question: "Why use Amazon search links instead of only exact products?",
    answer:
      "Search links stay useful when inventory changes. They help readers compare current prices, reviews, and sizes while still crediting the Stiffler Homestead affiliate tag.",
  },
  {
    question: "How do these guides connect to the videos?",
    answer:
      "Video posts explain what the Stiffler family is building or learning, then the supply guides turn those lessons into practical buying checklists.",
  },
];

export default function HomesteadSuppliesPage() {
  const pageUrl = `${SITE_CONFIG.siteUrl}/homestead-supplies`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Homestead Supplies & Family Tech We Recommend",
      url: pageUrl,
      description:
        "Affiliate-supported homestead supply guides and family technology resources from Stiffler Homestead.",
      isPartOf: { "@type": "WebSite", name: SITE_CONFIG.name, url: SITE_CONFIG.siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: monetizationFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="rounded-[2rem] bg-[#183b25] p-5 text-white shadow-xl shadow-green-900/10 sm:p-8 md:p-12">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Affiliate-supported buying guides</p>
        <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
          Homestead supplies, family tech, and gear guides we can keep recommending.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          This page turns Stiffler Homestead videos and projects into practical shopping paths: chicken automation, composting, food preservation, outdoor cooking, Wisephone, Covenant Eyes, and the full Homestead Supply Guide library.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={SITE_CONFIG.supplyGuideUrl} target="_blank" rel="noreferrer" className="rounded-full bg-amber-300 px-6 py-3 text-center font-black text-[#183b25]">
            Browse all supply guides
          </a>
          <Link href="/blog" className="rounded-full border border-white/30 px-6 py-3 text-center font-black text-white hover:bg-white/10">
            Read project posts
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 sm:p-6">
        <strong>Affiliate disclosure:</strong> As an Amazon Associate, Stiffler Homestead earns from qualifying purchases. Some links also support us through Wisephone or Covenant Eyes partnerships. The goal is simple: recommend useful tools, not digital snake oil with a coupon code wearing overalls.
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {supplyCategories.map((category) => (
          <a key={category.title} href={category.href} target="_blank" rel="noreferrer" className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 transition hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-2xl font-black text-[#183b25] group-hover:text-[#2f7d4b]">{category.title}</h2>
            <p className="mt-3 flex-1 leading-7 text-gray-700">{category.copy}</p>
            <span className="mt-5 inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-[#183b25]">{category.cta}</span>
          </a>
        ))}
      </section>

      <section className="mt-12 rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Monetization FAQ</p>
        <h2 className="mt-2 text-3xl font-black text-[#183b25]">How this supports the homestead</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {monetizationFaqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl bg-[#f7f3ea] p-5">
              <h3 className="font-black text-[#183b25]">{faq.question}</h3>
              <p className="mt-2 leading-7 text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
