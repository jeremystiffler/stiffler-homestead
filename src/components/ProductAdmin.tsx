"use client";

import { useState } from "react";

type ProductRow = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price_cents: number;
  price_note?: string | null;
  unit_label: string;
  available_quantity: number;
  status: string;
  availability_window: string;
  pickup_note: string;
  image_url?: string | null;
  image_alt?: string | null;
  image_emoji?: string | null;
  sold_out_message: string;
  featured: boolean;
  paypal_url?: string | null;
  venmo_url?: string | null;
  sort_order?: number;
};

const blankProduct: ProductRow = {
  slug: "",
  name: "",
  category: "Meat chickens",
  description: "",
  price_cents: 0,
  price_note: "",
  unit_label: "items",
  available_quantity: 0,
  status: "coming_soon",
  availability_window: "Update availability",
  pickup_note: "Local pickup details will be confirmed after purchase.",
  image_url: "",
  image_alt: "",
  image_emoji: "🌱",
  sold_out_message: "Sold out. Contact us for next availability.",
  featured: true,
  paypal_url: "",
  venmo_url: "",
  sort_order: 100,
};

export default function ProductAdmin() {
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [selected, setSelected] = useState<ProductRow>(blankProduct);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/products", { headers: { "x-admin-password": password } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load products.");
      setProducts(data.products || []);
      setMessage("Products loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify(selected),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save product.");
      setSelected(data.product);
      setMessage("Saved. Public inventory updates immediately after deploy/server refresh.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof ProductRow>(key: K, value: ProductRow[K]) {
    setSelected((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <aside className="rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5">
        <label className="text-sm font-black text-[#183b25]">Admin password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-green-900/20 px-4 py-3" />
        <button type="button" onClick={loadProducts} disabled={loading || !password} className="mt-3 w-full rounded-full bg-[#2f7d4b] px-4 py-3 font-black text-white disabled:opacity-60">
          {loading ? "Working..." : "Load products"}
        </button>
        <button type="button" onClick={() => setSelected(blankProduct)} className="mt-3 w-full rounded-full border-2 border-[#2f7d4b] px-4 py-3 font-black text-[#2f7d4b]">
          New product
        </button>
        {message && <p className="mt-4 rounded-xl bg-[#f7f3ea] p-3 text-sm font-semibold text-gray-700">{message}</p>}
        <div className="mt-5 space-y-2">
          {products.map((product) => (
            <button key={product.id || product.slug} type="button" onClick={() => setSelected(product)} className="block w-full rounded-xl bg-[#f7f3ea] p-3 text-left text-sm font-bold text-[#183b25] hover:bg-amber-100">
              {product.name || "Untitled"}
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" value={selected.name} onChange={(value) => update("name", value)} />
          <Field label="Slug" value={selected.slug} onChange={(value) => update("slug", value)} />
          <label className="grid gap-2 text-sm font-black text-[#183b25]">Category
            <select value={selected.category} onChange={(event) => update("category", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium">
              {['Meat chickens','Pork','Lamb','Eggs','Honey'].map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-black text-[#183b25]">Status
            <select value={selected.status} onChange={(event) => update("status", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium">
              {['available','preorder','sold_out','coming_soon'].map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <Field label="Price in cents (2500 = $25.00)" type="number" value={String(selected.price_cents)} onChange={(value) => update("price_cents", Number(value))} />
          <Field label="Available quantity" type="number" value={String(selected.available_quantity)} onChange={(value) => update("available_quantity", Number(value))} />
          <Field label="Unit label" value={selected.unit_label} onChange={(value) => update("unit_label", value)} />
          <Field label="Sort order" type="number" value={String(selected.sort_order || 100)} onChange={(value) => update("sort_order", Number(value))} />
          <Field label="Image URL" value={selected.image_url || ""} onChange={(value) => update("image_url", value)} />
          <Field label="Image alt text" value={selected.image_alt || ""} onChange={(value) => update("image_alt", value)} />
          <Field label="Fallback emoji" value={selected.image_emoji || ""} onChange={(value) => update("image_emoji", value)} />
          <Field label="Price note" value={selected.price_note || ""} onChange={(value) => update("price_note", value)} />
          <Field label="PayPal URL" value={selected.paypal_url || ""} onChange={(value) => update("paypal_url", value)} />
          <Field label="Venmo URL" value={selected.venmo_url || ""} onChange={(value) => update("venmo_url", value)} />
        </div>

        <label className="mt-4 grid gap-2 text-sm font-black text-[#183b25]">Description
          <textarea value={selected.description} onChange={(event) => update("description", event.target.value)} className="min-h-28 rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-black text-[#183b25]">Availability window
          <textarea value={selected.availability_window} onChange={(event) => update("availability_window", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-black text-[#183b25]">Pickup note
          <textarea value={selected.pickup_note} onChange={(event) => update("pickup_note", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-black text-[#183b25]">Sold out message
          <textarea value={selected.sold_out_message} onChange={(event) => update("sold_out_message", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
        </label>
        <label className="mt-4 flex items-center gap-3 text-sm font-black text-[#183b25]">
          <input type="checkbox" checked={selected.featured} onChange={(event) => update("featured", event.target.checked)} />
          Feature on homepage
        </label>
        <button type="button" onClick={saveProduct} disabled={loading || !password} className="mt-6 rounded-full bg-[#2f7d4b] px-6 py-3 font-black text-white disabled:opacity-60">
          Save product
        </button>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#183b25]">{label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
    </label>
  );
}
