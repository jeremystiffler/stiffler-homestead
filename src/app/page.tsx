import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";
import ProductOrderCard from "@/components/ProductOrderCard";
import { getAllPosts } from "@/lib/posts";
import { getFeaturedProducts } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/config";

export const dynamic = "force-dynamic";

const homepageFaqs = [
  {
    question: "Can I buy local meat chickens from Stiffler Homestead near Lexington, KY?",
    answer: "Yes. The products page is set up for local meat chicken reservations and pickup coordination near Lexington, Kentucky.",
  },
  {
    question: "Is the storefront local only?",
    answer: "Yes. Storefront orders are for local pickup near Lexington, Kentucky. We do not offer shipping or delivery through the storefront.",
  },
  {
    question: "How does Stiffler Homestead make money from gear links?",
    answer: "The site uses affiliate links for practical homestead supplies, Wisephone, and Covenant Eyes. Those links can support the homestead at no extra cost to buyers.",
  },
];

export default async function HomePage() {
  const posts = getAllPosts();
  const featured = posts.slice(0, 6);
  const products = await getFeaturedProducts();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.siteUrl,
      description: SITE_CONFIG.tagline,
      sameAs: [SITE_CONFIG.youtubeUrl],
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.siteUrl,
      email: SITE_CONFIG.contactEmail,
      sameAs: [SITE_CONFIG.youtubeUrl],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: homepageFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden bg-[#f7f3ea]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#d9f99d55,transparent_35%),radial-gradient(circle_at_80%_20%,#f6c45366,transparent_28%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:py-14 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24">
          <div>
            <p className="inline-flex rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#2f7d4b] shadow-sm sm:px-4 sm:text-sm sm:tracking-[0.2em]">Family homestead • Lexington, KY</p>
            <h1 className="mt-5 text-4xl font-black leading-[0.98] text-[#183b25] sm:text-5xl md:text-7xl">
              Local homestead food, family-tested projects, and field notes from the Stiffler place.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700 sm:text-xl">
              Reserve currently available homestead food for local pickup near Lexington, KY, follow practical notes from our family projects, and subscribe for upcoming farm product openings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/products" className="rounded-full bg-[#2f7d4b] px-6 py-3 text-center font-black text-white shadow-lg shadow-green-900/10 hover:bg-[#27683f]">
                Buy local meat & eggs
              </Link>
              <Link href="/products" className="rounded-full border-2 border-[#2f7d4b] bg-white px-6 py-3 text-center font-black text-[#2f7d4b] hover:bg-green-50">
                See current availability
              </Link>

            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-3 shadow-2xl shadow-green-900/10 sm:p-4 md:rotate-1">
            <div className="rounded-[1.5rem] bg-[#ddf8e8] p-6">
              <div className="grid grid-cols-2 gap-3 text-center">
                {[
                  ["60+", "laying hens"],
                  ["20 min", "weekly coop work"],
                  ["9", "starter guides"],
                  ["100%", "family-tested"],
                ].map(([big, small]) => (
                  <div key={big} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                    <p className="text-2xl font-black text-[#183b25] sm:text-3xl">{big}</p>
                    <p className="mt-1 text-sm font-semibold text-gray-600">{small}</p>
                  </div>
                ))}
              </div>
              <blockquote className="mt-5 rounded-2xl bg-[#183b25] p-5 text-white">
                “We are not experts on everything. We are just stubborn enough to learn, fix it, and show you what actually worked.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Buy from the homestead</p>
            <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Current local pickup items</h2>
            <p className="mt-3 max-w-3xl leading-7 text-gray-700">Choose what is currently listed, select your quantity, and we will coordinate a scheduled pickup near Lexington, KY.</p>
          </div>
          <Link href="/products" className="w-full rounded-full bg-amber-300 px-5 py-3 text-center font-black text-[#183b25] sm:w-auto">See full availability</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductOrderCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-6xl px-4 py-12">
        <EmailSignup />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 rounded-[2rem] bg-[#183b25] p-5 text-white shadow-xl shadow-green-900/10 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Around the homestead</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Food, field notes, and farm updates.</h2>
            <p className="mt-4 max-w-3xl leading-8 text-white/80">
              The storefront is for local pickup orders. The blog shares what we are learning. The email list lets local families know when farm products and new homestead updates are available.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:min-w-80 md:grid-cols-1">
            <Link href="/products" className="rounded-full bg-amber-300 px-5 py-3 text-center font-black text-[#183b25]">Visit the storefront</Link>
            <Link href="/#newsletter" className="rounded-full border border-white/30 px-5 py-3 text-center font-black text-white hover:bg-white/10">Join the email list</Link>
          </div>
        </div>
      </section>

      <section id="videos" className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">From the videos</p>
            <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Homestead notes, turned into useful guides</h2>
          </div>
          <Link href="/blog" className="w-full rounded-full bg-amber-300 px-5 py-3 text-center font-black text-[#183b25] sm:w-auto">See all posts</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-900/5 transition hover:-translate-y-1 hover:shadow-xl">
              {post.image && <img src={post.image} alt={post.imageAlt || post.title} className="h-44 w-full object-cover" />}
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2f7d4b]">{post.category}</p>
                <h3 className="mt-2 text-xl font-black leading-tight text-[#183b25] group-hover:text-[#2f7d4b]">{post.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
