"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SubscribePopup from "@/components/SubscribePopup";

const links = [
  { href: "/local-food-lexington-ky", label: "Local food" },
  { href: "/products", label: "Shop the storefront", primary: true },
  { href: "/chick-start", label: "Start chicks" },
  { href: "/homestead-setup-call", label: "Setup call" },
  { href: "/stuff-we-use", label: "Stuff we use" },
  { href: "/blog", label: "Blog" },
];

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-2 font-black text-[#183b25]" onClick={() => setOpen(false)}>
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 via-lime-200 to-[#2f7d4b] text-lg shadow-lg shadow-green-900/10 ring-2 ring-white" aria-hidden="true">
            🐓<span className="absolute -right-1 -top-1 text-xs">🌿</span>
          </span>
          <span className="truncate text-xl leading-none tracking-tight">Stiffler Homestead</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-green-900/15 bg-white px-4 py-2 text-sm font-black text-[#183b25] shadow-sm"
          aria-expanded={open}
          aria-controls="mobile-site-menu"
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>{open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div id="mobile-site-menu" className="border-t border-green-900/10 bg-[#fffaf0] px-4 pb-4 shadow-lg">
          <div className="grid gap-2 pt-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`min-h-12 rounded-2xl px-4 py-3 text-base font-black ${link.primary ? "bg-[#2f7d4b] text-white" : "bg-white text-[#183b25]"}`}
              >
                {link.label}
              </Link>
            ))}
            <SubscribePopup label="Get farm updates" className="min-h-12 rounded-2xl bg-red-600 px-4 py-3 text-left text-base font-black text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
