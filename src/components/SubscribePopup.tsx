"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EmailSignup from "@/components/EmailSignup";
import { SITE_CONFIG } from "@/lib/config";

type SubscribePopupProps = {
  className?: string;
  label?: string;
  floating?: boolean;
};

export default function SubscribePopup({ className = "", label = "Subscribe", floating = false }: SubscribePopupProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const modal = open ? (
    <div className="fixed inset-0 z-[9999] grid items-start justify-items-center overflow-y-auto bg-[#183b25]/75 p-4 pt-6 backdrop-blur-sm sm:pt-10" role="dialog" aria-modal="true" aria-label="Subscribe to Stiffler Homestead">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-[#f7f3ea] p-3 shadow-2xl sm:max-h-[calc(100vh-5rem)]">
        <div className="rounded-[1.5rem] bg-white p-4 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-red-600">Support the homestead</p>
              <h2 className="mt-1 text-2xl font-black text-[#183b25] sm:text-4xl">Subscribe, follow, and help us grow.</h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-700">
                YouTube subscriptions, likes, and comments tell YouTube that real people care about these videos. That helps more local families find the farm and helps the channel grow without us having to become dancing algorithm goblins.
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-[#f7f3ea] px-4 py-2 font-black text-[#183b25] hover:bg-amber-100" aria-label="Close subscribe popup">
              ✕
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-3xl bg-red-600 p-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-red-100">YouTube</p>
              <h3 className="mt-2 text-2xl font-black">Like & subscribe</h3>
              <p className="mt-3 text-sm leading-6 text-red-50">
                Subscribe to the channel, then like a video or leave a comment when something helps you. It is free, fast, and genuinely helps Stiffler Homestead reach more people.
              </p>
              <a href={SITE_CONFIG.youtubeSubscribeUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 font-black text-red-700 hover:bg-red-50">
                Subscribe on YouTube
              </a>
            </div>

            <EmailSignup
              compact
              heading="Get farm product updates"
              subtext="Join the email list for upcoming local farm products, pickup windows, new videos, and other homestead updates."
              className="shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          (floating
            ? "subscribe-floating-button fixed bottom-5 right-5 z-50 rounded-full bg-red-600 px-6 py-4 text-base font-black text-white shadow-2xl shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-red-700 sm:bottom-7 sm:right-7 sm:px-7 sm:py-4 sm:text-lg"
            : "rounded-full px-3 py-2 hover:bg-[#f7f3ea] hover:text-[#183b25]")
        }
        aria-expanded={open}
      >
        {label}
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
