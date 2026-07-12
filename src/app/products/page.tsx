import ProductOrderCard from "@/components/ProductOrderCard";
import { getAllProducts } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Homestead Meat, Eggs & Availability",
  description: "Reserve local Stiffler Homestead meat chickens, pork, lamb, eggs, and future honey availability near Lexington, Kentucky.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <section className="rounded-[2rem] bg-[#183b25] p-8 text-white shadow-xl shadow-green-900/10 md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Local food from the homestead</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          Meat chickens, pork, lamb, eggs — and eventually maybe honey.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          This is the public availability board for local pickup requests. Choose what is open, request a quantity, and we will personally confirm pickup timing, payment, and final availability.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="rounded-full bg-amber-300 px-5 py-3 font-black text-[#183b25]">
            Ask a question
          </a>
          <a href="#availability" className="rounded-full border border-white/30 px-5 py-3 font-black text-white hover:bg-white/10">
            See availability
          </a>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["1", "Choose what is available", "Each card shows the current quantity, price note, and pickup expectations."],
          ["2", "Send an order request", "Customers pick a quantity and send a prefilled email request — no surprise checkout, no cold frozen chicken roulette."],
          ["3", "Confirm personally", "You confirm the order, pickup timing, payment method, and final details before anything is locked in."],
        ].map(([step, title, copy]) => (
          <div key={step} className="rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 font-black text-[#183b25]">{step}</div>
            <h2 className="mt-4 text-xl font-black text-[#183b25]">{title}</h2>
            <p className="mt-2 leading-7 text-gray-700">{copy}</p>
          </div>
        ))}
      </section>

      <section id="availability" className="mt-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Availability board</p>
            <h2 className="mt-2 text-4xl font-black text-[#183b25]">Current homestead products</h2>
          </div>
          <a href="/blog" className="rounded-full bg-white px-5 py-3 font-black text-[#2f7d4b] shadow-sm">
            Read the homestead blog
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductOrderCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
