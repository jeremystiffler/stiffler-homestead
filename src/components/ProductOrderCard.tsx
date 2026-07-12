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
  const [quantity, setQuantity] = useState(orderable ? 1 : 0);
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

  return (
    <article id={product.slug} className="flex h-full flex-col rounded-3xl border border-green-900/10 bg-white p-6 shadow-lg shadow-green-900/5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-5xl" aria-hidden>{product.imageEmoji}</div>
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${statusClasses(product)}`}>
          {statusLabel(product)}
        </span>
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#2f7d4b]">{product.category}</p>
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
            <a href={mailtoHref} className="mt-4 block rounded-full bg-[#2f7d4b] px-5 py-3 text-center font-black text-white hover:bg-[#27683f]">
              Request / reserve this order
            </a>
            <p className="mt-3 text-xs leading-5 text-gray-500">
              This sends an order request by email. We confirm availability, pickup details, and payment before anything is final.
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
    </article>
  );
}
