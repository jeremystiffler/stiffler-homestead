"use client";

import { FormEvent, useState } from "react";
import { SITE_CONFIG } from "@/lib/config";

interface EmailSignupProps {
  heading?: string;
  subtext?: string;
  className?: string;
}

type InterestKey = "food" | "videos";

const INTEREST_OPTIONS: Array<{
  key: InterestKey;
  label: string;
  description: string;
}> = [
  {
    key: "food",
    label: "Food sales & availability",
    description: "Meat chickens, eggs, pork, lamb, honey, and pickup windows.",
  },
  {
    key: "videos",
    label: "Latest videos & homestead updates",
    description: "New YouTube videos, project notes, and practical guides.",
  },
];

const MAILCHIMP_INTEREST_FIELDS: Record<InterestKey, { inputName: string; value: string }> = {
  food: {
    inputName: SITE_CONFIG.mailchimpFoodInterestInputName,
    value: SITE_CONFIG.mailchimpFoodInterestValue,
  },
  videos: {
    inputName: SITE_CONFIG.mailchimpVideosInterestInputName,
    value: SITE_CONFIG.mailchimpVideosInterestValue,
  },
};

export default function EmailSignup({
  heading = "Follow the homestead journey",
  subtext = "Choose food sale notices, new video updates, or both — and subscribe to the YouTube channel while you’re here.",
  className = "",
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Record<InterestKey, boolean>>({ food: true, videos: true });
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function toggleInterest(key: InterestKey) {
    setSelectedInterests((current) => ({ ...current, [key]: !current[key] }));
  }

  function selectedInterestLabels() {
    return INTEREST_OPTIONS.filter((option) => selectedInterests[option.key]).map((option) => option.label);
  }

  function appendInput(form: HTMLFormElement, name: string, value: string) {
    const input = document.createElement("input");
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    const interests = selectedInterestLabels();
    const interestText = interests.length > 0 ? interests.join(", ") : "No preference selected";

    if (!SITE_CONFIG.mailchimpActionUrl) {
      window.location.href = `mailto:${SITE_CONFIG.contactEmail}?subject=Add me to Stiffler Homestead&body=${encodeURIComponent(
        `Please add this email to the Stiffler Homestead list: ${email}\n\nPreferences: ${interestText}\n\nYouTube channel: ${SITE_CONFIG.youtubeSubscribeUrl}`,
      )}`;
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

    appendInput(form, "EMAIL", email);

    INTEREST_OPTIONS.forEach((option) => {
      const field = MAILCHIMP_INTEREST_FIELDS[option.key];
      if (selectedInterests[option.key] && field.inputName) {
        appendInput(form, field.inputName, field.value);
      }
    });

    if (SITE_CONFIG.mailchimpInterestsMergeField) {
      appendInput(form, SITE_CONFIG.mailchimpInterestsMergeField, interestText);
    }

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
    <section className={`overflow-hidden rounded-3xl bg-[#183b25] text-white shadow-xl ${className}`}>
      <div className="grid gap-0 lg:grid-cols-[1.15fr_.85fr]">
        <div className="p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-200">Newsletter</p>
          <h2 className="mt-2 text-2xl font-black md:text-3xl">{heading}</h2>
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

            <fieldset className="grid gap-3 md:grid-cols-2">
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

          {status === "success" && (
            <p className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-amber-100">
              Thanks — check your inbox soon. Want the videos too? Hit the YouTube subscribe button before you wander off like a free-range rooster.
            </p>
          )}
          {!SITE_CONFIG.mailchimpActionUrl && (
            <p className="mt-4 text-xs text-white/60">Mailchimp form URL is not configured yet, so this currently opens a prefilled email fallback.</p>
          )}
        </div>

        <div className="bg-[#ddf8e8] p-6 text-[#183b25] md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Choose your updates</p>
          <h3 className="mt-2 text-3xl font-black leading-tight">Food sales, fresh videos, or the whole farm bundle.</h3>
          <ul className="mt-5 space-y-3 text-sm font-semibold text-gray-700">
            <li className="rounded-2xl bg-white p-4 shadow-sm">🍗 Food notices stay focused on sale dates, batch availability, and pickup details.</li>
            <li className="rounded-2xl bg-white p-4 shadow-sm">🎥 Video updates send the latest Stiffler Homestead guides and YouTube field notes.</li>
            <li className="rounded-2xl bg-white p-4 shadow-sm">✅ Pick both if you want the full dirt-under-the-fingernails experience.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
