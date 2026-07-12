import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";
import ProductOrderCard from "@/components/ProductOrderCard";
import { getAllPosts } from "@/lib/posts";
import { getFeaturedProducts } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/config";

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts.slice(0, 6);
  const products = getFeaturedProducts();

  return (
    <div>
      <section className="relative overflow-hidden bg-[#f7f3ea]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#d9f99d55,transparent_35%),radial-gradient(circle_at_80%_20%,#f6c45366,transparent_28%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:py-14 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-24">
          <div>
            <p className="inline-flex rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#2f7d4b] shadow-sm sm:px-4 sm:text-sm sm:tracking-[0.2em]">Family homestead • Lexington, KY</p>
            <h1 className="mt-5 text-4xl font-black leading-[0.98] text-[#183b25] sm:text-5xl md:text-7xl">
              Local homestead food, family-tested projects, and field notes from the Stiffler place.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-700 sm:text-xl">
              Reserve meat chickens, see future pork/lamb/egg availability, follow the blog from our YouTube videos, and shop the supplies and family-tech tools we actually recommend.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/products" className="rounded-full bg-[#2f7d4b] px-6 py-3 text-center font-black text-white shadow-lg shadow-green-900/10 hover:bg-[#27683f]">
                Buy local meat & eggs
              </Link>
              <a href={SITE_CONFIG.youtubeUrl} target="_blank" rel="noreferrer" className="rounded-full border-2 border-[#2f7d4b] bg-white px-6 py-3 text-center font-black text-[#2f7d4b] hover:bg-green-50">
                Watch the videos
              </a>
              <a href={SITE_CONFIG.supplyGuideUrl} target="_blank" rel="noreferrer" className="rounded-full border-2 border-[#2f7d4b] bg-white px-6 py-3 text-center font-black text-[#2f7d4b] hover:bg-green-50">
                Shop the supply guide
              </a>
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
            <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Current meat, eggs, and future availability</h2>
            <p className="mt-3 max-w-3xl leading-7 text-gray-700">Reserve available batches, ask about the next round, or join the interest list for pork, lamb, eggs, and future honey.</p>
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
