import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";
import { getAllProducts } from "@/lib/products";
import ProductOrderCard from "@/components/ProductOrderCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Local Farm Food Lexington KY | Eggs, Pasture-Raised Chicken & Lamb",
  description:
    "Reserve local farm food near Lexington, KY from Stiffler Homestead: farm-fresh eggs, pasture-raised meat chickens, seasonal lamb, and pickup-only homestead food.",
  alternates: { canonical: "/local-food-lexington-ky" },
  openGraph: {
    title: "Local Farm Food Lexington KY | Stiffler Homestead",
    description:
      "A local pickup storefront for currently listed Stiffler Homestead food near Lexington, KY.",
    url: "/local-food-lexington-ky",
    siteName: SITE_CONFIG.name,
    type: "website",
  },
};

const faqs = [
  {
    question: "Where is Stiffler Homestead located?",
    answer:
      "Stiffler Homestead serves local pickup customers near Lexington, Kentucky. Exact pickup details are confirmed after a reservation or order request.",
  },
  {
    question: "What local farm food can I reserve?",
    answer:
      "The storefront shows currently listed farm-fresh eggs, pasture-raised meat chickens, seasonal lamb, and other homestead food when available. Availability changes by season and batch size.",
  },
  {
    question: "Do you sell farm fresh eggs near Lexington, KY?",
    answer:
      "Egg availability is seasonal and depends on the laying hens. When eggs are available, they are listed on the storefront for local pickup near Lexington, Kentucky.",
  },
  {
    question: "Do you offer pasture-raised chicken near Lexington, KY?",
    answer:
      "Yes, Stiffler Homestead lists pasture-raised meat chickens when a batch is available for local pickup. Quantities are limited because this is a small family homestead.",
  },
  {
    question: "Do you ship meat or eggs?",
    answer:
      "No. The storefront is for local pickup near Lexington, KY only. We do not offer shipping or delivery through this site.",
  },
  {
    question: "How do I get notified about local food availability?",
    answer:
      "Use the contact links on each product card or subscribe for food availability updates from Stiffler Homestead.",
  },
];

export default async function LocalFoodLexingtonPage() {
  const products = await getAllProducts();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_CONFIG.siteUrl}/#localbusiness`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.siteUrl,
      email: SITE_CONFIG.contactEmail,
      priceRange: "$$",
      description:
        "Local farm food and seasonal homestead food availability for scheduled pickup near Lexington, Kentucky.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lexington",
        addressRegion: "KY",
        addressCountry: "US",
      },
      areaServed: SITE_CONFIG.areaServed.map((name) => ({ "@type": "Place", name })),
      sameAs: [SITE_CONFIG.youtubeUrl],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
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
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Lexington, Kentucky local farm food</p>
        <h1 className="mt-3 max-w-5xl text-3xl font-black leading-tight sm:text-5xl md:text-6xl">
          Local homestead food for scheduled pickup near Lexington, KY.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          Stiffler Homestead offers a simple local pickup storefront for Lexington-area families who want farm-fresh eggs, pasture-raised meat chickens, seasonal lamb, and other food from a real family homestead. Choose what is currently listed, select a quantity, and we will coordinate pickup details.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/products#availability" className="rounded-full bg-amber-300 px-6 py-3 text-center font-black text-[#183b25]">
            See current availability
          </Link>
          <a href={`mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent("Local food availability question")}`} className="rounded-full border border-white/30 px-6 py-3 text-center font-black text-white hover:bg-white/10">
            Ask about pickup
          </a>
        </div>
      </section>


      <section className="mt-10 rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Lexington local food</p>
        <h2 className="mt-2 text-3xl font-black text-[#183b25]">Farm-fresh food raised close to home</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["Farm-fresh eggs Lexington KY", "Egg availability from our laying hens is posted when there are enough eggs for local pickup."],
            ["Pasture-raised chicken Lexington KY", "Meat chicken batches are seasonal, limited, and listed when processing and pickup windows are ready."],
            ["Local lamb and homestead food", "Seasonal lamb and other homestead products are offered as availability allows, with pickup coordinated after ordering."],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-2xl bg-[#f7f3ea] p-5">
              <h3 className="text-lg font-black text-[#183b25]">{title}</h3>
              <p className="mt-2 leading-7 text-gray-700">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-3xl bg-[#fffaf0] p-6 shadow-lg shadow-green-900/5 ring-1 ring-green-900/10 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Pickup area</p>
        <h2 className="mt-2 text-3xl font-black text-[#183b25]">Serving Lexington and nearby Central Kentucky families</h2>
        <p className="mt-4 max-w-4xl leading-8 text-gray-700">
          Orders are local pickup only near Lexington, KY. Families from Lexington, Nicholasville, Georgetown, Versailles, Winchester, Richmond, and surrounding Central Kentucky communities can subscribe for availability notices and reserve from current storefront listings.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {SITE_CONFIG.areaServed.map((city) => (
            <span key={city} className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#183b25] shadow-sm ring-1 ring-green-900/10">{city}</span>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["Choose a product", "Browse currently listed items from the storefront."],
          ["Select quantity", "Choose how many you want and enter your contact information."],
          ["Schedule pickup", "Pay or reserve, then we will coordinate a local pickup time near Lexington, KY."],
        ].map(([title, copy]) => (
          <div key={title} className="rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5">
            <h2 className="text-xl font-black text-[#183b25]">{title}</h2>
            <p className="mt-3 leading-7 text-gray-700">{copy}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Current availability board</p>
            <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Reserve local homestead food</h2>
          </div>
          <Link href="/products" className="w-full rounded-full bg-white px-5 py-3 text-center font-black text-[#2f7d4b] shadow-sm sm:w-auto">
            Open full products page
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductOrderCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Local food FAQ</p>
        <h2 className="mt-2 text-3xl font-black text-[#183b25]">Questions people search before buying from a homestead</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {faqs.map((faq) => (
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
