import { getPost, getAllPosts } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EmailSignup from "@/components/EmailSignup";
import { SITE_CONFIG } from "@/lib/config";

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
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <span className="text-xs font-black uppercase tracking-[0.25em] text-[#2f7d4b]">{post.meta.category}</span>
      <h1 className="my-4 text-4xl font-black leading-tight text-[#183b25] md:text-5xl">{post.meta.title}</h1>
      <p className="mb-8 text-sm font-semibold text-gray-500">
        {new Date(post.meta.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>
      {post.meta.image && (
        <figure className="mb-8 overflow-hidden rounded-3xl border border-green-900/10 bg-white shadow-lg shadow-green-900/5">
          <img src={post.meta.image} alt={post.meta.imageAlt || post.meta.title} className="aspect-video w-full object-cover" />
          {post.meta.imageCredit && <figcaption className="px-4 py-2 text-xs text-gray-500">{post.meta.imageCredit}</figcaption>}
        </figure>
      )}
      <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Affiliate links help support the channel at no extra cost to you.
      </div>
      <div className="prose prose-lg max-w-none rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 md:p-8">
        <MDXRemote source={post.content} />
      </div>
      <EmailSignup className="mt-10" heading="Want the next project notes?" subtext="Subscribe and we’ll send the newest Stiffler Homestead guide when it’s ready." />
    </article>
  );
}
