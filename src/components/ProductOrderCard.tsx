"use client";

import { useMemo, useState } from "react";
import type { HomesteadProduct } from "@/content/products";
import { SITE_CONFIG } from "@/lib/config";
import { isProductOrderable } from "@/lib/products";
import SubscribePopup from "@/components/SubscribePopup";

function briefDescription(description: string) {
  const cleaned = description.trim();
  if (!cleaned) return "Local homestead food available for scheduled pickup near Lexington, KY.";
  const firstSentence = cleaned.match(/^.*?[.!?](\s|$)/)?.[0]?.trim();
  const brief = firstSentence || cleaned;
  return brief.length > 150 ? `${brief.slice(0, 147).trim()}...` : brief;
}

export default function ProductOrderCard({ product }: { product: HomesteadProduct }) {
  const orderable = isProductOrderable(product);
  const paidCheckoutReady = orderable && product.priceCents > 0;
  const [quantity, setQuantity] = useState(orderable ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const max = Math.max(product.availableQuantity, 0);

  const mailtoHref = useMemo(() => {
    const subject = `Stiffler Homestead order request: ${product.name}`;
    const body = [
      `Hi Stiffler Homestead,`,
      ``,
      `I would like to purchase/reserve ${quantity} ${product.unitLabel} of ${product.name} for local pickup near Lexington, KY.`,
      ``,
      `Product: ${product.name}`,
      `Quantity: ${quantity} ${product.unitLabel}`,
      ``,
      `My name:`,
      `My phone:`,
      `Best local pickup timing:`,
    ].join("\n");

    return `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [product.name, product.unitLabel, quantity]);

  async function purchase() {
    if (!paidCheckoutReady) {
      window.location.href = mailtoHref;
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, slug: product.slug, quantity }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout could not be started.");
      window.location.href = data.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article id={product.slug} className="flex h-full flex-col overflow-hidden rounded-3xl border border-green-900/10 bg-white shadow-lg shadow-green-900/5">
      {product.imageUrl && (
        <div className="h-44 overflow-hidden bg-[#ddf8e8]">
          <img src={product.imageUrl} alt={product.imageAlt || product.name} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          {!product.imageUrl && (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#ddf8e8] text-2xl" aria-hidden>
              {product.imageEmoji || "🌱"}
            </div>
          )}
          <div>
            <h3 className="text-2xl font-black leading-tight text-[#183b25]">{product.name}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-700">{briefDescription(product.description)}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#f7f3ea] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2f7d4b]">Quantity</p>
              <p className="mt-1 font-bold text-[#183b25]">
                {orderable ? `${max} ${product.unitLabel} available` : "Subscribe for new availability"}
              </p>
            </div>
            {orderable && (
              <input
                id={`quantity-${product.slug}`}
                aria-label={`Quantity for ${product.name}`}
                type="number"
                min={1}
                max={max}
                value={quantity}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setQuantity(Number.isNaN(next) ? 1 : Math.min(Math.max(next, 1), max));
                }}
                className="w-24 rounded-xl border border-green-900/20 bg-white px-3 py-2 text-center text-lg font-black text-[#183b25] outline-none focus:border-[#2f7d4b]"
              />
            )}
          </div>
        </div>

        <div className="mt-5">
          {orderable ? (
            <button type="button" onClick={purchase} disabled={loading} className="w-full rounded-full bg-[#2f7d4b] px-5 py-3 text-center font-black text-white hover:bg-[#27683f] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Opening checkout..." : paidCheckoutReady ? "Purchase" : "Request purchase"}
            </button>
          ) : (
            <SubscribePopup
              label="Subscribe for availability"
              className="w-full rounded-full border-2 border-[#2f7d4b] px-5 py-3 text-center font-black text-[#2f7d4b] hover:bg-green-50"
            />
          )}
          {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
        </div>
      </div>
    </article>
  );
}
