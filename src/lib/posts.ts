import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "src/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  imageCreditUrl?: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".mdx"));
  return files.map(file => {
    const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
    const { data } = matter(raw);
    return { slug: file.replace(".mdx", ""), ...data } as PostMeta;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): { meta: PostMeta; content: string } | null {
  if (!fs.existsSync(postsDir)) return null;

  const directPath = path.join(postsDir, `${slug}.mdx`);
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".mdx"));
  const filePath = fs.existsSync(directPath)
    ? directPath
    : files
        .map(file => path.join(postsDir, file))
        .find(candidate => {
          const raw = fs.readFileSync(candidate, "utf-8");
          const { data } = matter(raw);
          return data.slug === slug;
        });

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: { slug: path.basename(filePath, ".mdx"), ...data } as PostMeta, content };
}
