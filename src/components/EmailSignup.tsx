"use client";

import { FormEvent, useState } from "react";
import { SITE_CONFIG } from "@/lib/config";

interface EmailSignupProps {
  heading?: string;
  subtext?: string;
  className?: string;
}

export default function EmailSignup({
  heading = "Follow the homestead journey",
  subtext = "Get new videos, practical projects, and family homestead notes in your inbox.",
  className = "",
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    if (!SITE_CONFIG.mailchimpActionUrl) {
      window.location.href = `mailto:jeremystiffler@gmail.com?subject=Add me to Stiffler Homestead&body=Please add this email to the Stiffler Homestead list: ${encodeURIComponent(email)}`;
      return;
    }

    const iframeName = `mailchimp-iframe-${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.action = SITE_CONFIG.mailchimpActionUrl;
    form.method = "POST";
    form.target = iframeName;
    form.style.display = "none";

    const emailInput = document.createElement("input");
    emailInput.name = "EMAIL";
    emailInput.value = email;
    form.appendChild(emailInput);

    if (SITE_CONFIG.mailchimpBotTrapName) {
      const trap = document.createElement("input");
      trap.name = SITE_CONFIG.mailchimpBotTrapName;
      trap.tabIndex = -1;
      trap.value = "";
      form.appendChild(trap);
    }

    document.body.appendChild(form);
    form.submit();
    setStatus("success");
    setEmail("");
    window.setTimeout(() => {
      form.remove();
      iframe.remove();
    }, 1500);
  }

  return (
    <section className={`rounded-3xl bg-[#183b25] p-6 text-white shadow-xl md:p-8 ${className}`}>
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">Newsletter</p>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">{heading}</h2>
          <p className="mt-2 max-w-2xl text-white/80">{subtext}</p>
        </div>
        <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-white px-5 py-3 text-gray-900 outline-none ring-amber-300 placeholder:text-gray-400 focus:ring-4"
          />
          <button className="rounded-full bg-amber-300 px-6 py-3 font-black text-[#183b25] transition hover:bg-amber-200">
            Subscribe
          </button>
        </form>
      </div>
      {status === "success" && <p className="mt-4 text-sm text-amber-100">Thanks — check your inbox soon.</p>}
      {!SITE_CONFIG.mailchimpActionUrl && (
        <p className="mt-4 text-xs text-white/60">Mailchimp form URL is not configured yet, so this currently opens a prefilled email fallback.</p>
      )}
    </section>
  );
}
