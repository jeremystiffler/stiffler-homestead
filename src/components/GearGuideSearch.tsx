"use client";

import { useMemo, useState } from "react";
import type { GearItem } from "@/content/gearItems";

export default function GearGuideSearch({ items }: { items: GearItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [priority, setPriority] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.category))).sort()], [items]);
  const priorities = ["All", "Buy first", "Worth it", "Nice to have"];
  const filteredItems = items.filter((item) => {
    const text = [item.name, item.category, item.priority, item.recommendation, item.notes, item.tags.join(" ")].join(" ").toLowerCase();
    return (category === "All" || item.category === category) && (priority === "All" || item.priority === priority) && (!query.trim() || text.includes(query.toLowerCase().trim()));
  });

  return (
    <section className="mt-12 rounded-[2rem] bg-white p-5 shadow-lg shadow-green-900/5 sm:p-8" id="recommended-gear">
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Searchable recommended item list</p>
          <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Every item we recommend buying</h2>
          <p className="mt-3 max-w-3xl leading-7 text-gray-700">These are specific item links, not vague shopping rabbit holes. Amazon recommendations use the Stiffler Homestead affiliate tag, and partner tools use our direct partner links.</p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-950">Need to add or adjust one? Edit <code className="rounded bg-white px-2 py-1">src/content/gearItems.ts</code> and deploy.</div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_180px]">
        <label><span className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Search gear</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: chickens, canning, family tech..." className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#fffaf0] px-4 py-3 font-semibold text-[#183b25] outline-none ring-[#2f7d4b]/20 focus:ring-4" /></label>
        <label><span className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Category</span><select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#fffaf0] px-4 py-3 font-semibold text-[#183b25] outline-none ring-[#2f7d4b]/20 focus:ring-4">{categories.map((option) => <option key={option}>{option}</option>)}</select></label>
        <label><span className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value)} className="mt-2 w-full rounded-2xl border border-gray-200 bg-[#fffaf0] px-4 py-3 font-semibold text-[#183b25] outline-none ring-[#2f7d4b]/20 focus:ring-4">{priorities.map((option) => <option key={option}>{option}</option>)}</select></label>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-bold text-gray-600"><span>{filteredItems.length} of {items.length} items showing</span><button type="button" onClick={() => { setQuery(""); setCategory("All"); setPriority("All"); }} className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">Clear filters</button></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <article key={item.slug} className="flex h-full flex-col rounded-3xl border border-green-900/10 bg-[#fffaf0] p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#2f7d4b] px-3 py-1 text-xs font-black uppercase tracking-wide text-white">{item.category}</span><span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#183b25]">{item.priority}</span></div>
            <h3 className="mt-4 text-2xl font-black leading-tight text-[#183b25]">{item.name}</h3>
            <p className="mt-3 flex-1 leading-7 text-gray-700">{item.recommendation}</p>
            <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-gray-700"><span className="font-black text-[#183b25]">Field note:</span> {item.notes}</p>
            <div className="mt-4 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-600">#{tag}</span>)}</div>
            <a href={item.affiliateUrl} target="_blank" rel="noreferrer" className="mt-5 rounded-full bg-amber-300 px-5 py-3 text-center font-black text-[#183b25] hover:bg-amber-200">{item.linkLabel}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
