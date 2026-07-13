"use client";

import { useEffect, useState } from "react";
import { isInfiniteQuantityProduct } from "@/lib/inventory";

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
  infinite_quantity?: boolean;
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

type OrderRow = {
  id: string;
  quantity: number;
  unit_price_cents: number;
  total_cents: number;
  status: string;
  customer_email?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  payment_provider: string;
  paid_at?: string | null;
  created_at: string;
  notes?: string | null;
  product?: { name?: string; slug?: string } | null;
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
  infinite_quantity: false,
  status: "coming_soon",
  availability_window: "Update availability",
  pickup_note: "Local pickup near Lexington, KY. Pickup details will be confirmed after purchase.",
  image_url: "",
  image_alt: "",
  image_emoji: "🌱",
  sold_out_message: "Sold out. Contact us for next availability.",
  featured: true,
  paypal_url: "",
  venmo_url: "",
  sort_order: 100,
};

function normalizeProduct(product: ProductRow): ProductRow {
  return {
    ...product,
    infinite_quantity: Boolean(product.infinite_quantity),
  };
}

function productVisibility(product: ProductRow) {
  if (product.status === "hidden") {
    return {
      label: "Hidden",
      icon: "🙈",
      title: "Hidden from public view",
      className: "bg-gray-200 text-gray-700 ring-gray-300",
    };
  }
  if (product.status === "coming_soon") {
    return {
      label: "Draft",
      icon: "🟡",
      title: "Saved in admin, not shown publicly yet",
      className: "bg-amber-100 text-amber-900 ring-amber-200",
    };
  }
  return {
    label: "Live",
    icon: "🟢",
    title: `Publicly visible: ${product.status.replace(/_/g, " ")}`,
    className: "bg-green-100 text-green-800 ring-green-200",
  };
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function suggestedDescription(product: ProductRow) {
  const name = product.name || "This product";
  const lower = `${product.category} ${name}`.toLowerCase();
  if (lower.includes("chicken")) return `${name} raised on the Stiffler family homestead for local pickup near Lexington, KY. Reserve ahead of processing day and we will confirm pickup details.`;
  if (lower.includes("egg")) return `${name} from the Stiffler Homestead laying flock. Weekly availability changes, so quantity and pickup details are confirmed before pickup.`;
  if (lower.includes("pork")) return `${name} from the Stiffler family homestead. Availability, cuts, deposits, and pickup timing can be updated as each season opens.`;
  if (lower.includes("lamb") || lower.includes("sheep")) return `${name} from the Stiffler family homestead. Use this listing for whole, half, or cut availability when the next lamb season opens.`;
  if (lower.includes("honey")) return `${name} from Stiffler Homestead when seasonal batches are available. Join the interest list for future jar availability.`;
  return `${name} from Stiffler Homestead for local pickup near Lexington, KY. Availability, pricing, and pickup details can be updated here.`;
}

function centsToDollars(cents: number) {
  if (!cents) return "";
  return (cents / 100).toFixed(2);
}

function dollarsToCents(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  return Math.round(Number(cleaned) * 100);
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

async function resizeImage(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

  const targetWidth = 1200;
  const targetHeight = 800;
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;

  const sourceRatio = image.width / image.height;
  const targetRatio = targetWidth / targetHeight;
  let sx = 0;
  let sy = 0;
  let sw = image.width;
  let sh = image.height;

  if (sourceRatio > targetRatio) {
    sw = image.height * targetRatio;
    sx = (image.width - sw) / 2;
  } else {
    sh = image.width / targetRatio;
    sy = (image.height - sh) / 2;
  }

  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function ProductAdmin() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selected, setSelected] = useState<ProductRow>(blankProduct);
  const [priceInput, setPriceInput] = useState("");
  const [message, setMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragSlug, setDragSlug] = useState("");

  async function loadProducts(showMessage = true) {
    setLoading(true);
    if (showMessage) setMessage("");
    try {
      const response = await fetch(`/api/admin/products?t=${Date.now()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load products.");
      const normalizedProducts = (data.products || []).map((product: ProductRow) => normalizeProduct(product));
      setProducts(normalizedProducts);
      setSelected((current) => {
        const matchingProduct = normalizedProducts.find((product: ProductRow) => product.id ? product.id === current.id : product.slug === current.slug);
        if (matchingProduct) return normalizeProduct(matchingProduct);
        if (!current.id && !current.slug && !current.name && normalizedProducts[0]) return normalizeProduct(normalizedProducts[0]);
        return current;
      });
      if (showMessage) setMessage("Products loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function loadOrders() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/orders", {});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load orders.");
      setOrders(data.orders || []);
      setMessage("Orders loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct(productToSave = selected, quiet = false) {
    setLoading(true);
    if (!quiet) {
      setSaveStatus("saving");
      setLastSavedAt("");
      setMessage("Saving product…");
    }
    try {
      if (!productToSave.name?.trim()) {
        throw new Error("Choose a product from the dropdown/sidebar before saving, or enter a new product name.");
      }
      const normalized = {
        ...productToSave,
        price_cents: productToSave === selected ? dollarsToCents(priceInput) : productToSave.price_cents,
        slug: productToSave.slug || slugify(productToSave.name),
        description: productToSave.description || suggestedDescription(productToSave),
        image_alt: productToSave.image_alt || productToSave.name,
        unit_label: productToSave.unit_label?.trim() || "items",
      };
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(normalized),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save product.");
      const savedProduct = normalizeProduct({ ...normalized, ...(data.product || {}), infinite_quantity: data.product?.infinite_quantity ?? normalized.infinite_quantity });
      setSelected(savedProduct);
      setProducts((currentProducts) => {
        const existingIndex = currentProducts.findIndex((product) => product.id ? product.id === savedProduct.id : product.slug === savedProduct.slug);
        if (existingIndex < 0) return [...currentProducts, savedProduct];
        const nextProducts = [...currentProducts];
        nextProducts[existingIndex] = savedProduct;
        return nextProducts;
      });
      if (!quiet) {
        const savedAt = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
        setSaveStatus("saved");
        setLastSavedAt(savedAt);
        setMessage(`✅ Saved correctly at ${savedAt}. Database confirmed infinite quantity is ${savedProduct.infinite_quantity ? "ON" : "OFF"}.`);
      }
      await loadProducts(false);
    } catch (error) {
      if (!quiet) setSaveStatus("error");
      setMessage(error instanceof Error ? `❌ Save failed: ${error.message}` : "❌ Save failed: Unable to save product.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(product: ProductRow) {
    const productId = product.id;
    if (!productId) {
      setSelected(blankProduct);
      setMessage("Unsaved product cleared.");
      return;
    }
    const ok = window.confirm(`Permanently delete ${product.name || "this product"}? Use Hide instead if you may sell it again later.`);
    if (!ok) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete product.");
      setSelected(blankProduct);
      setMessage("Product permanently deleted.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete product.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleHidden(product: ProductRow) {
    const hiding = product.status !== "hidden";
    await saveProduct({
      ...product,
      status: hiding ? "hidden" : "coming_soon",
      featured: hiding ? false : product.featured,
    }, true);
    setMessage(hiding ? "Product hidden from public pages. It stays saved in admin for later." : "Product restored as coming soon. Update status when ready to sell.");
  }

  async function updateOrder(orderId: string, action: string) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update order.");
      setMessage(action === "mark_paid" ? "Order marked paid and inventory reduced." : "Order updated.");
      await Promise.all([loadOrders(), loadProducts()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update order.");
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof ProductRow>(key: K, value: ProductRow[K]) {
    setSaveStatus("idle");
    setLastSavedAt("");
    setSelected((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !current.slug) next.slug = slugify(String(value));
      if ((key === "name" || key === "category") && !current.description) next.description = suggestedDescription(next);
      if (key === "name" && !current.image_alt) next.image_alt = String(value);
      return next;
    });
  }

  async function handleImage(file?: File) {
    if (!file) return;
    setLoading(true);
    try {
      const resized = await resizeImage(file);
      setSelected((current) => ({ ...current, image_url: resized, image_alt: current.image_alt || current.name }));
      setMessage("Image uploaded and cropped to a consistent 3:2 product block. Click Save product to publish it.");
    } catch {
      setMessage("Image could not be processed.");
    } finally {
      setLoading(false);
    }
  }

  async function reorder(dropSlug: string) {
    if (!dragSlug || dragSlug === dropSlug) return;
    const from = products.findIndex((p) => p.slug === dragSlug);
    const to = products.findIndex((p) => p.slug === dropSlug);
    if (from < 0 || to < 0) return;
    const next = [...products];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const withOrder = next.map((product, index) => ({ ...product, sort_order: (index + 1) * 10 }));
    setProducts(withOrder);
    setDragSlug("");
    for (const product of withOrder) {
      await saveProduct(product, true);
    }
    setMessage("Product order saved.");
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  useEffect(() => {
    setPriceInput(centsToDollars(selected.price_cents));
  }, [selected.id, selected.slug]);

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
      <aside className="rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5">
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => loadProducts()} disabled={loading} className="rounded-full bg-[#2f7d4b] px-4 py-3 font-black text-white disabled:opacity-60">
            Products
          </button>
          <button type="button" onClick={loadOrders} disabled={loading} className="rounded-full bg-[#183b25] px-4 py-3 font-black text-white disabled:opacity-60">
            Orders
          </button>
        </div>
        <button type="button" onClick={() => { setSelected(blankProduct); setSaveStatus("idle"); setLastSavedAt(""); }} className="mt-3 w-full rounded-full border-2 border-[#2f7d4b] px-4 py-3 font-black text-[#2f7d4b]">
          New product
        </button>
        {products.length > 0 && (
          <label className="mt-4 grid gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
            Choose product to edit
            <select
              value={selected.id || selected.slug || ""}
              onChange={(event) => {
                const product = products.find((item) => (item.id || item.slug) === event.target.value);
                if (product) { setSelected(product); setSaveStatus("idle"); setLastSavedAt(""); }
              }}
              className="rounded-xl border border-green-900/20 px-3 py-3 text-sm font-bold normal-case tracking-normal text-[#183b25]"
            >
              <option value="">Select a product...</option>
              {products.map((product) => <option key={product.id || product.slug} value={product.id || product.slug}>{product.name}</option>)}
            </select>
          </label>
        )}
        {message && (
          <p className={`mt-4 rounded-xl p-3 text-sm font-black ${saveStatus === "saved" ? "bg-green-100 text-green-900 ring-2 ring-green-300" : saveStatus === "error" ? "bg-red-100 text-red-800 ring-2 ring-red-300" : "bg-[#f7f3ea] text-gray-700"}`}>
            {message}
          </p>
        )}

        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Drag to sort</p>
            <div className="flex flex-wrap justify-end gap-1 text-[10px] font-black uppercase tracking-wide">
              <span className="rounded-full bg-green-100 px-2 py-1 text-green-800 ring-1 ring-green-200">🟢 Live</span>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-900 ring-1 ring-amber-200">🟡 Draft</span>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-gray-700 ring-1 ring-gray-300">🙈 Hidden</span>
            </div>
          </div>
          {products.map((product) => {
            const visibility = productVisibility(product);
            return (
              <div
                key={product.id || product.slug}
                draggable
                onDragStart={() => setDragSlug(product.slug)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => reorder(product.slug)}
                className="flex cursor-grab items-center gap-2 rounded-xl bg-[#f7f3ea] p-2 text-sm font-bold text-[#183b25] hover:bg-amber-100 active:cursor-grabbing"
              >
                <span className="shrink-0 text-gray-400" aria-hidden>☰</span>
                <button type="button" onClick={() => { setSelected(product); setSaveStatus("idle"); setLastSavedAt(""); }} className="min-w-0 flex-1 truncate rounded-lg px-2 py-1 text-left hover:bg-white/70">
                  {product.name || "Untitled"}
                </button>
                <span title={visibility.title} className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wide ring-1 ${visibility.className}`}>
                  <span aria-hidden>{visibility.icon}</span> {visibility.label}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="grid gap-8">
        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:p-8">
          <div className="mb-5 rounded-2xl bg-green-50 p-4 text-sm font-black text-green-900 ring-2 ring-green-100">
            Editing: {selected.name ? selected.name : "No product selected — choose one from the dropdown or click New product and enter a name."}
          </div>
          <div className="grid gap-5">
            <div>
              <div className="overflow-hidden rounded-2xl bg-[#ddf8e8] sm:h-72">
                {selected.image_url ? <img src={selected.image_url} alt={selected.image_alt || selected.name} className="h-full min-h-56 w-full object-cover" /> : <div className="grid h-56 place-items-center text-5xl sm:h-72">{selected.image_emoji || "🌱"}</div>}
              </div>
              <label className="mt-3 block cursor-pointer rounded-full bg-amber-300 px-4 py-3 text-center text-sm font-black text-[#183b25]">
                Upload product image
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImage(event.target.files?.[0])} />
              </label>
              <p className="mt-2 text-xs leading-5 text-gray-500">Images are center-cropped to a consistent 3:2 block for every product card.</p>
            </div>

            <Field label="Name" value={selected.name} onChange={(value) => update("name", value)} />

            <label className="grid gap-2 text-sm font-black text-[#183b25]">Price
              <input
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={priceInput}
                onChange={(event) => setPriceInput(event.target.value)}
                className="rounded-xl border border-green-900/20 px-4 py-3 font-medium"
              />
            </label>

            <div className="grid gap-3 rounded-2xl bg-[#f7f3ea] p-4 md:grid-cols-[1fr_auto] md:items-start">
              <label className="grid gap-2 text-sm font-black text-[#183b25]">Available quantity number
                <input
                  type="number"
                  min="0"
                  value={String(selected.available_quantity)}
                  disabled={isInfiniteQuantityProduct(selected)}
                  onChange={(event) => update("available_quantity", Number(event.target.value))}
                  className="rounded-xl border border-green-900/20 bg-white px-4 py-3 font-medium disabled:bg-gray-100 disabled:text-gray-400"
                />
                <span className="text-xs font-semibold leading-5 text-gray-500">Use this as the count, then describe what one count means in the Quantity label field.</span>
              </label>
              <label className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm font-black text-[#183b25] md:min-w-64">
                <input type="checkbox" checked={Boolean(selected.infinite_quantity)} onChange={(event) => update("infinite_quantity", event.target.checked)} className="mt-1" />
                <span>
                  Infinite quantity
                  <span className="mt-1 block text-xs font-semibold leading-5 text-gray-600">Turn this on when inventory should not count down after orders.</span>
                </span>
              </label>
            </div>

            <Field
              label="Quantity label"
              value={selected.unit_label}
              onChange={(value) => update("unit_label", value)}
              placeholder="dozen, half lamb, whole chicken, jar"
              helper="Shown beside the number on the storefront, like “1 dozen available” or “1 half lamb available”."
            />

            <label className="grid gap-2 text-sm font-black text-[#183b25]">Description (auto-suggested, editable)
              <textarea value={selected.description} onChange={(event) => update("description", event.target.value)} className="min-h-28 rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => update("description", suggestedDescription(selected))} className="rounded-full border border-green-900/20 px-3 py-2 text-xs font-black text-[#2f7d4b]">Regenerate description</button>
              <button type="button" onClick={() => update("slug", slugify(selected.name))} className="rounded-full border border-green-900/20 px-3 py-2 text-xs font-black text-[#2f7d4b]">Regenerate slug</button>
            </div>

            <label className="grid gap-2 text-sm font-black text-[#183b25]">Status
              <select value={selected.status} onChange={(event) => update("status", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium">
                {['available','preorder','sold_out','coming_soon','hidden'].map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-black text-[#183b25]">Pickup note
              <textarea value={selected.pickup_note} onChange={(event) => update("pickup_note", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
            </label>

            <label className="grid gap-2 text-sm font-black text-[#183b25]">Sold out message
              <textarea value={selected.sold_out_message} onChange={(event) => update("sold_out_message", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
            </label>

            <div className="rounded-2xl border border-green-900/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">Additional product settings</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Slug (auto-filled)" value={selected.slug} onChange={(value) => update("slug", slugify(value))} />
                <label className="grid gap-2 text-sm font-black text-[#183b25]">Category
                  <select value={selected.category} onChange={(event) => update("category", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium">
                    {['Meat chickens','Pork','Lamb','Eggs','Honey'].map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <Field label="Price note" value={selected.price_note || ""} onChange={(value) => update("price_note", value)} />
                <label className="grid gap-2 text-sm font-black text-[#183b25]">Availability window
                  <textarea value={selected.availability_window} onChange={(event) => update("availability_window", event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
                </label>
                <Field label="Fallback emoji" value={selected.image_emoji || ""} onChange={(value) => update("image_emoji", value)} />
                <Field label="Image alt text" value={selected.image_alt || ""} onChange={(value) => update("image_alt", value)} />
                <Field label="PayPal URL" value={selected.paypal_url || ""} onChange={(value) => update("paypal_url", value)} />
                <Field label="Venmo URL" value={selected.venmo_url || ""} onChange={(value) => update("venmo_url", value)} />
              </div>
              <label className="mt-4 flex items-center gap-3 text-sm font-black text-[#183b25]">
                <input type="checkbox" checked={selected.featured} onChange={(event) => update("featured", event.target.checked)} />
                Feature on homepage
              </label>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => saveProduct()} disabled={loading} className={`rounded-full px-6 py-3 font-black text-white disabled:opacity-60 ${saveStatus === "saved" ? "bg-green-700 ring-4 ring-green-200" : saveStatus === "error" ? "bg-red-700 ring-4 ring-red-200" : "bg-[#2f7d4b]"}`}>
              {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "✓ Saved" : saveStatus === "error" ? "Save failed — try again" : "Save product"}
            </button>
            {lastSavedAt && saveStatus === "saved" && (
              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-900 ring-2 ring-green-300">
                DB confirmed at {lastSavedAt}
              </span>
            )}
            <button type="button" onClick={() => toggleHidden(selected)} disabled={loading || (!selected.id && !selected.name)} className="rounded-full border-2 border-amber-400 px-6 py-3 font-black text-amber-900 disabled:opacity-60">
              {selected.status === "hidden" ? "Unhide product" : "Hide from public view"}
            </button>
            <button type="button" onClick={() => deleteProduct(selected)} disabled={loading || (!selected.id && !selected.name)} className="rounded-full border-2 border-red-300 px-6 py-3 font-black text-red-700 disabled:opacity-60">
              Delete product
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-500">
            Hide keeps the product in admin for later seasons. Delete permanently removes it from the product database.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#2f7d4b]">Manual payment orders</p>
              <h2 className="text-2xl font-black text-[#183b25]">Mark PayPal/Venmo orders paid to reduce inventory</h2>
            </div>
            <button type="button" onClick={loadOrders} disabled={loading} className="rounded-full bg-amber-300 px-4 py-3 font-black text-[#183b25] disabled:opacity-60">Refresh orders</button>
          </div>
          <div className="mt-5 grid gap-3">
            {orders.length === 0 && <p className="rounded-2xl bg-[#f7f3ea] p-4 text-sm font-semibold text-gray-600">No orders loaded yet.</p>}
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-green-900/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-[#183b25]">{order.product?.name || "Product"} × {order.quantity}</p>
                    <p className="mt-1 text-sm text-gray-600">{order.payment_provider.toUpperCase()} • {formatMoney(order.total_cents)} • {order.status}</p>
                    <p className="mt-1 text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                    {(order.customer_name || order.customer_email || order.customer_phone) && <p className="mt-2 text-sm text-gray-700">{[order.customer_name, order.customer_email, order.customer_phone].filter(Boolean).join(" • ")}</p>}
                    {order.notes && <p className="mt-2 rounded-xl bg-[#f7f3ea] p-2 text-xs text-gray-600">{order.notes}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.status !== "paid" && <button type="button" onClick={() => updateOrder(order.id, "mark_paid")} disabled={loading} className="rounded-full bg-[#2f7d4b] px-4 py-2 text-sm font-black text-white disabled:opacity-60">Mark paid</button>}
                    {order.status === "pending" && <button type="button" onClick={() => updateOrder(order.id, "cancelled")} disabled={loading} className="rounded-full border border-red-300 px-4 py-2 text-sm font-black text-red-700 disabled:opacity-60">Cancel</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, helper }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; helper?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#183b25]">{label}
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3 font-medium" />
      {helper && <span className="text-xs font-semibold leading-5 text-gray-500">{helper}</span>}
    </label>
  );
}
