import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Homestead Blog & YouTube Field Notes",
  description: "Practical Stiffler Homestead blog posts from YouTube videos: chickens, sheep, composting, family homesteading, automation, and affiliate-linked gear guides.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <div className="mb-8 rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:mb-10 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Blog</p>
        <h1 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl md:text-5xl">Every video, turned into a practical field note.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-700">Each post includes the video, what we learned, and the gear/search links we would use again. Amazon affiliate links are tagged with stifflerhom01-20.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-green-900/5 transition hover:-translate-y-1 hover:shadow-xl">
            {post.image && <img src={post.image} alt={post.imageAlt || post.title} className="h-44 w-full object-cover" />}
            <div className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#2f7d4b]">{post.category}</p>
              <h2 className="mt-2 text-xl font-black leading-tight text-[#183b25] group-hover:text-[#2f7d4b]">{post.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{post.description}</p>
              <p className="mt-4 text-xs font-semibold text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
