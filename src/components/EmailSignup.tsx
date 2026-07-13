"use client";

import { FormEvent, useState } from "react";
import { SITE_CONFIG } from "@/lib/config";

interface EmailSignupProps {
  heading?: string;
  subtext?: string;
  className?: string;
  compact?: boolean;
}

type InterestKey = "food" | "videos";

const INTEREST_OPTIONS: Array<{
  key: InterestKey;
  label: string;
  description: string;
}> = [
  {
    key: "food",
    label: "Farm products & pickup openings",
    description: "Local-only notices for meat, eggs, availability, and pickup windows.",
  },
  {
    key: "videos",
    label: "Videos & homestead updates",
    description: "New YouTube videos, project notes, blog posts, and family homestead updates.",
  },
];

export default function EmailSignup({
  heading = "Follow the homestead journey",
  subtext = "Subscribe for upcoming farm products, local pickup openings, videos, and other Stiffler Homestead updates.",
  className = "",
  compact = false,
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Record<InterestKey, boolean>>({ food: true, videos: true });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggleInterest(key: InterestKey) {
    setSelectedInterests((current) => ({ ...current, [key]: !current[key] }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const interests = INTEREST_OPTIONS.filter((option) => selectedInterests[option.key]).map((option) => option.key);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interests, source: compact ? "subscribe-popup" : "website-newsletter" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to subscribe right now.");
      setStatus("success");
      setMessage("You’re on the list. We’ll send farm product openings and homestead updates without turning your inbox into a chicken stampede.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    }
  }

  return (
    <section className={`overflow-hidden rounded-3xl bg-[#183b25] text-white shadow-xl ${className}`}>
      <div className={`grid gap-0 ${compact ? "" : "lg:grid-cols-[1.15fr_.85fr]"}`}>
        <div className={compact ? "p-5" : "p-6 md:p-8"}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">Newsletter</p>
          <h2 className={`${compact ? "text-2xl" : "text-2xl md:text-3xl"} mt-2 font-black`}>{heading}</h2>
          <p className="mt-2 max-w-2xl text-white/80">{subtext}</p>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/20 bg-white px-5 py-3 text-gray-900 outline-none ring-amber-300 placeholder:text-gray-400 focus:ring-4"
            />

            <fieldset className={`grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
              <legend className="sr-only">Choose what you want to hear about</legend>
              {INTEREST_OPTIONS.map((option) => (
                <label
                  key={option.key}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    selectedInterests[option.key]
                      ? "border-amber-300 bg-white text-[#183b25] shadow-lg shadow-black/10"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedInterests[option.key]}
                      onChange={() => toggleInterest(option.key)}
                      className="mt-1 h-5 w-5 accent-amber-300"
                    />
                    <span>
                      <span className="block font-black">{option.label}</span>
                      <span className={`mt-1 block text-sm ${selectedInterests[option.key] ? "text-gray-600" : "text-white/70"}`}>{option.description}</span>
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button className="rounded-full bg-amber-300 px-6 py-3 font-black text-[#183b25] transition hover:bg-amber-200">
                Subscribe by email
              </button>
              <a
                href={SITE_CONFIG.youtubeSubscribeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-white/40 px-6 py-3 text-center font-black text-white transition hover:border-white hover:bg-white/10"
              >
                Subscribe on YouTube
              </a>
            </div>
          </form>

          {message && (
            <p className={`mt-4 rounded-2xl p-4 text-sm ${status === "error" ? "bg-red-100 text-red-900" : "bg-white/10 text-amber-100"}`}>
              {message}
            </p>
          )}
        </div>

        {!compact && (
          <div className="bg-[#ddf8e8] p-6 text-[#183b25] md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Choose your updates</p>
            <h3 className="mt-2 text-3xl font-black leading-tight">Food sales, fresh videos, or the whole farm bundle.</h3>
            <ul className="mt-5 space-y-3 text-sm font-semibold text-gray-700">
              <li className="rounded-2xl bg-white p-4 shadow-sm">🍗 Food notices stay focused on sale dates, availability, and local pickup details.</li>
              <li className="rounded-2xl bg-white p-4 shadow-sm">🎥 Video updates help the channel grow and keep you connected to the projects behind the farm.</li>
              <li className="rounded-2xl bg-white p-4 shadow-sm">✅ Pick both if you want the full dirt-under-the-fingernails experience.</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
