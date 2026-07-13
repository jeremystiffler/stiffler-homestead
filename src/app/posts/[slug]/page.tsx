import { getPost, getAllPosts } from "@/lib/posts";
import { getAllProducts, productPriceLabel } from "@/lib/products";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";
import { SITE_CONFIG } from "@/lib/config";
import Link from "next/link";

const siteUrl = SITE_CONFIG.siteUrl;
const siteName = SITE_CONFIG.name;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const canonicalPath = `/posts/${post.meta.slug}`;
  const imageUrl = post.meta.image ? new URL(post.meta.image, siteUrl).toString() : undefined;
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url: canonicalPath,
      siteName,
      type: "article",
      publishedTime: post.meta.date,
      images: imageUrl ? [{ url: imageUrl, alt: post.meta.imageAlt || post.meta.title }] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const [products, allPosts] = await Promise.all([getAllProducts(), Promise.resolve(getAllPosts())]);
  const relatedPosts = allPosts.filter((item) => item.slug !== post.meta.slug);

  const postUrl = `${siteUrl}/posts/${post.meta.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    mainEntityOfPage: postUrl,
    image: post.meta.image ? new URL(post.meta.image, siteUrl).toString() : undefined,
    author: { "@type": "Organization", name: siteName },
    publisher: { "@type": "Organization", name: siteName },
  };

  return (
    <main className="pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="rounded-[2rem] bg-[#eef8e8] p-5 shadow-lg shadow-green-900/5 ring-1 ring-green-900/10 sm:p-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#2f7d4b]">{post.meta.category}</span>
          <h1 className="my-4 text-3xl font-black leading-tight text-[#183b25] sm:text-4xl md:text-5xl">{post.meta.title}</h1>
          <p className="text-sm font-semibold text-gray-600">
            {new Date(post.meta.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </header>

        {post.meta.image && (
          <figure className="my-8 overflow-hidden rounded-3xl border border-green-900/10 bg-white shadow-lg shadow-green-900/5">
            <img src={post.meta.image} alt={post.meta.imageAlt || post.meta.title} className="aspect-video w-full object-cover" />
            {post.meta.imageCredit && <figcaption className="px-4 py-2 text-xs text-gray-500">{post.meta.imageCredit}</figcaption>}
          </figure>
        )}

        <div className="prose prose-lg max-w-none rounded-3xl bg-white p-4 shadow-lg shadow-green-900/5 sm:p-6 md:p-8">
          <MDXRemote source={post.content} />
        </div>
      </article>

      {products.length > 0 && (
        <section className="mx-auto mt-4 max-w-6xl px-4">
          <div className="overflow-hidden rounded-[2rem] bg-[#fff4d8] p-5 shadow-xl shadow-amber-900/5 ring-1 ring-amber-900/10 sm:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#a15b08]">From the storefront</p>
                <h2 className="mt-2 text-2xl font-black text-[#183b25] sm:text-3xl">Local pickup products for sale</h2>
                <p className="mt-2 max-w-2xl leading-7 text-[#6d4b16]">Scroll sideways to see what is currently listed from the homestead.</p>
              </div>
              <Link href="/products" className="rounded-full bg-[#183b25] px-5 py-3 text-center font-black text-white shadow-sm hover:bg-[#2f7d4b]">
                View storefront
              </Link>
            </div>
            <div className="flex snap-x gap-4 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products#${product.slug}`}
                  className="group flex min-w-[250px] snap-start flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-amber-900/5 ring-1 ring-amber-900/10 transition hover:-translate-y-1 hover:shadow-xl sm:min-w-[310px]"
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.imageAlt || product.name} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="grid h-40 place-items-center bg-gradient-to-br from-amber-100 to-green-100 text-6xl" aria-hidden="true">
                      {product.imageEmoji}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a15b08]">{product.category}</p>
                    <h3 className="mt-2 text-xl font-black leading-tight text-[#183b25] group-hover:text-[#2f7d4b]">{product.name}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <span className="rounded-full bg-[#eef8e8] px-3 py-2 text-sm font-black text-[#183b25]">{productPriceLabel(product.priceCents, product.priceLabel)}</span>
                      <span className="text-sm font-black text-[#2f7d4b]">Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto mt-8 max-w-6xl px-4">
        <div className="grid gap-4 rounded-[2rem] bg-[#f7f3ea] p-5 shadow-lg shadow-green-900/5 md:grid-cols-3">
          <Link href="/products" className="rounded-2xl bg-white p-5 font-bold text-[#183b25] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Browse the storefront <span className="block pt-2 text-sm font-semibold text-gray-600">See local meat, eggs, seasonal products, and pickup availability from the homestead.</span>
          </Link>
          <a href={SITE_CONFIG.youtubeSubscribeUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-white p-5 font-bold text-[#183b25] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Subscribe on YouTube <span className="block pt-2 text-sm font-semibold text-gray-600">Watch the projects behind these notes and follow the next family homestead experiment.</span>
          </a>
          <Link href="/#newsletter" className="rounded-2xl bg-white p-5 font-bold text-[#183b25] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Get email updates <span className="block pt-2 text-sm font-semibold text-gray-600">Choose food availability, new blog posts, YouTube updates, or the whole farm bundle.</span>
          </Link>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="mx-auto mt-8 max-w-6xl px-4">
          <div className="overflow-hidden rounded-[2rem] bg-[#eaf7ff] p-5 shadow-xl shadow-sky-900/5 ring-1 ring-sky-900/10 sm:p-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-[#176b87]">Keep reading</p>
                <h2 className="mt-2 text-2xl font-black text-[#183b25] sm:text-3xl">More homestead blog posts</h2>
                <p className="mt-2 max-w-2xl leading-7 text-[#31586a]">Swipe or scroll through the latest project notes, field lessons, and family homestead guides.</p>
              </div>
              <Link href="/blog" className="rounded-full bg-white px-5 py-3 text-center font-black text-[#176b87] shadow-sm hover:bg-sky-50">
                All blog posts
              </Link>
            </div>
            <div className="flex snap-x gap-4 overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/posts/${related.slug}`}
                  className="group min-w-[260px] snap-start overflow-hidden rounded-3xl bg-white shadow-lg shadow-sky-900/5 ring-1 ring-sky-900/10 transition hover:-translate-y-1 hover:shadow-xl sm:min-w-[330px]"
                >
                  {related.image ? (
                    <img src={related.image} alt={related.imageAlt || related.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-sky-100 to-green-100" aria-hidden="true" />
                  )}
                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#176b87]">{related.category}</p>
                    <h3 className="mt-2 text-xl font-black leading-tight text-[#183b25] group-hover:text-[#176b87]">{related.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{related.description}</p>
                    <p className="mt-4 text-xs font-semibold text-gray-400">{new Date(related.date).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto mt-8 max-w-6xl px-4">
        <div className="grid gap-4 rounded-[2rem] bg-[#edf7ee] p-5 md:grid-cols-2">
          <a href={SITE_CONFIG.wisephoneDiscountUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-white p-5 font-bold text-[#183b25] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Wisephone discount link <span className="block pt-2 text-sm font-semibold text-gray-600">A calmer phone option for families trying to keep homestead life less screen-frantic.</span>
          </a>
          <a href={SITE_CONFIG.covenantEyesUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-white p-5 font-bold text-[#183b25] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Covenant Eyes accountability <span className="block pt-2 text-sm font-semibold text-gray-600">A practical tool for digital accountability on devices with broader internet access.</span>
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4">
        <EmailSignup className="mt-10" heading="Want the next project notes?" subtext="Subscribe and we’ll send the newest Stiffler Homestead guide when it’s ready." />
      </div>
    </main>
  );
}
