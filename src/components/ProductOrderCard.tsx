"use client";

import { useMemo, useState } from "react";
import type { HomesteadProduct } from "@/content/products";
import { SITE_CONFIG } from "@/lib/config";
import { isProductOrderable } from "@/lib/products";

function statusLabel(product: HomesteadProduct) {
  if (isProductOrderable(product)) return product.status === "preorder" ? "Taking reservations" : "Available now";
  if (product.status === "coming_soon") return "Coming soon";
  return "Sold out";
}

function statusClasses(product: HomesteadProduct) {
  if (isProductOrderable(product)) return "bg-green-100 text-green-900";
  if (product.status === "coming_soon") return "bg-amber-100 text-amber-950";
  return "bg-gray-200 text-gray-700";
}

export default function ProductOrderCard({ product }: { product: HomesteadProduct }) {
  const orderable = isProductOrderable(product);
  const paidCheckoutReady = orderable && product.priceCents > 0;
  const [quantity, setQuantity] = useState(orderable ? 1 : 0);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const max = Math.max(product.availableQuantity, 0);

  const mailtoHref = useMemo(() => {
    const subject = `Stiffler Homestead order request: ${product.name}`;
    const body = [
      `Hi Stiffler Homestead,`,
      ``,
      `I would like to request/reserve ${quantity} ${product.unitLabel} of ${product.name}.`,
      ``,
      `Product: ${product.name}`,
      `Price listed: ${product.priceLabel}`,
      `Availability: ${product.availabilityWindow}`,
      ``,
      `My name:`,
      `My phone:`,
      `Best pickup timing:`,
      `Questions/notes:`,
    ].join("\n");

    return `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [product, quantity]);

  async function startCheckout() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          slug: product.slug,
          quantity,
          customerEmail,
          customerName,
          customerPhone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout could not be started.");
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
      setLoading(false);
    }
  }

  return (
    <article id={product.slug} className="flex h-full flex-col overflow-hidden rounded-3xl border border-green-900/10 bg-white shadow-lg shadow-green-900/5">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.imageAlt || product.name} className="h-48 w-full object-cover" />
      ) : (
        <div className="grid h-36 place-items-center bg-[#ddf8e8] text-6xl" aria-hidden>{product.imageEmoji}</div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2f7d4b]">{product.category}</p>
          <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${statusClasses(product)}`}>
            {statusLabel(product)}
          </span>
        </div>
        <h3 className="mt-2 text-2xl font-black text-[#183b25]">{product.name}</h3>
        <p className="mt-3 flex-1 leading-7 text-gray-700">{product.description}</p>

        <div className="mt-5 rounded-2xl bg-[#f7f3ea] p-4">
          <p className="text-2xl font-black text-[#183b25]">{product.priceLabel}</p>
          {product.priceNote && <p className="mt-1 text-sm font-semibold text-amber-800">{product.priceNote}</p>}
          <p className="mt-3 text-sm font-semibold text-gray-700">{product.availabilityWindow}</p>
          <p className="mt-1 text-sm text-gray-600">{product.pickupNote}</p>
        </div>

        <div className="mt-5 rounded-2xl border border-green-900/10 p-4">
          {orderable ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor={`quantity-${product.slug}`} className="text-sm font-black text-[#183b25]">
                  Quantity
                </label>
                <span className="text-sm font-semibold text-gray-600">
                  {max} {product.unitLabel} available
                </span>
              </div>
              <input
                id={`quantity-${product.slug}`}
                type="number"
                min={1}
                max={max}
                value={quantity}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setQuantity(Number.isNaN(next) ? 1 : Math.min(Math.max(next, 1), max));
                }}
                className="mt-3 w-full rounded-xl border border-green-900/20 px-4 py-3 text-lg font-bold outline-none focus:border-[#2f7d4b]"
              />

              {paidCheckoutReady ? (
                <div className="mt-4 grid gap-3">
                  <input className="rounded-xl border border-green-900/20 px-4 py-3 outline-none focus:border-[#2f7d4b]" placeholder="Name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
                  <input className="rounded-xl border border-green-900/20 px-4 py-3 outline-none focus:border-[#2f7d4b]" placeholder="Email for receipt" type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} />
                  <input className="rounded-xl border border-green-900/20 px-4 py-3 outline-none focus:border-[#2f7d4b]" placeholder="Phone for pickup coordination" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} />
                  <button type="button" onClick={startCheckout} disabled={loading} className="rounded-full bg-[#2f7d4b] px-5 py-3 text-center font-black text-white hover:bg-[#27683f] disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Opening checkout..." : "Pay with card / Stripe"}
                  </button>
                </div>
              ) : (
                <a href={mailtoHref} className="mt-4 block rounded-full bg-[#2f7d4b] px-5 py-3 text-center font-black text-white hover:bg-[#27683f]">
                  Request / reserve this order
                </a>
              )}

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.paypalUrl && <a href={product.paypalUrl} target="_blank" rel="noreferrer" className="rounded-full border-2 border-[#2f7d4b] px-4 py-2 text-center text-sm font-black text-[#2f7d4b]">PayPal</a>}
                {product.venmoUrl && <a href={product.venmoUrl} target="_blank" rel="noreferrer" className="rounded-full border-2 border-[#2f7d4b] px-4 py-2 text-center text-sm font-black text-[#2f7d4b]">Venmo</a>}
              </div>
              {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
              <p className="mt-3 text-xs leading-5 text-gray-500">
                Stripe checkout automatically updates inventory after payment. PayPal/Venmo links are manual backup options and should be reconciled by hand.
              </p>
            </>
          ) : (
            <>
              <p className="font-bold text-gray-700">{product.soldOutMessage}</p>
              <a href={`mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(`Next availability: ${product.name}`)}`} className="mt-4 block rounded-full border-2 border-[#2f7d4b] px-5 py-3 text-center font-black text-[#2f7d4b] hover:bg-green-50">
                Contact for next availability
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
