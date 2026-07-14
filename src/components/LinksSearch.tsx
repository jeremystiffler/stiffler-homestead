"use client";

import { useMemo, useState } from "react";
import type { GearItem } from "@/content/gearItems";

export default function LinksSearch({ items }: { items: GearItem[] }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const tags = useMemo(
    () => ["All", ...Array.from(new Set(items.flatMap((item) => item.tags))).sort()],
    [items],
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category))).sort()],
    [items],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const searchableText = [
      item.name,
      item.linkLabel,
      item.category,
      item.priority,
      item.recommendation,
      item.notes,
      item.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
      (selectedTag === "All" || item.tags.includes(selectedTag)) &&
      (selectedCategory === "All" || item.category === selectedCategory)
    );
  });

  return (
    <section id="link-search" className="mt-10 rounded-[2rem] bg-white p-5 shadow-lg shadow-green-900/5 sm:p-8">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Searchable links</p>
          <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Find the exact link by title or tag</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">
            Search the link title, category, notes, or tags. Filter by tag when you want a narrow list — chickens, canning, family tech, water, fencing, and more.
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
          Affiliate disclosure: some links may support Stiffler Homestead at no extra cost to you.
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <label>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Search by title or tag</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: chicken door, water, canning, kids..."
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#fffaf0] px-4 py-3 font-semibold text-[#183b25] outline-none ring-[#2f7d4b]/20 focus:ring-4"
          />
        </label>
        <label>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Tag</span>
          <select
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#fffaf0] px-4 py-3 font-semibold text-[#183b25] outline-none ring-[#2f7d4b]/20 focus:ring-4"
          >
            {tags.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#fffaf0] px-4 py-3 font-semibold text-[#183b25] outline-none ring-[#2f7d4b]/20 focus:ring-4"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-bold text-gray-600">
        <span>{filteredItems.length} of {items.length} links showing</span>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setSelectedTag("All");
            setSelectedCategory("All");
          }}
          className="rounded-full bg-amber-100 px-3 py-1 text-amber-900"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {tags.filter((tag) => tag !== "All").slice(0, 18).map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`rounded-full px-3 py-1 text-xs font-black transition ${selectedTag === tag ? "bg-[#2f7d4b] text-white" : "bg-[#f7f3ea] text-[#183b25] hover:bg-amber-200"}`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article key={item.slug} className="flex h-full flex-col rounded-3xl border border-green-900/10 bg-[#fffaf0] p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#2f7d4b] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">{item.category}</span>
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#183b25]">{item.priority}</span>
            </div>
            <h3 className="mt-4 text-xl font-black leading-tight text-[#183b25]">{item.name}</h3>
            <p className="mt-3 flex-1 leading-7 text-gray-700">{item.recommendation}</p>
            <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-gray-700">
              <span className="font-black text-[#183b25]">Field note:</span> {item.notes}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:bg-amber-100"
                >
                  #{tag}
                </button>
              ))}
            </div>
            <a href={item.affiliateUrl} target="_blank" rel="noreferrer" className="mt-5 rounded-full bg-amber-300 px-5 py-3 text-center font-black text-[#183b25] hover:bg-amber-200">
              {item.linkLabel}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
