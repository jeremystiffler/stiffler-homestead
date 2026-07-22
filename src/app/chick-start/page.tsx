import type { Metadata } from "next";
import Link from "next/link";
import { GEAR_ITEMS } from "@/content/gearItems";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Chick-Start Season Package | Start Chicks With a Plan",
  description: "Request a Stiffler Homestead Chick-Start Season Package for a practical, locally coordinated start with chicks, brooder planning, and the gear that matters.",
  alternates: { canonical: "/chick-start" },
};

const included = [
  "A simple chick-start conversation based on your flock size, space, and timing",
  "A practical brooder and first-week setup plan",
  "A matching gear checklist so the important pieces do not get missed",
  "Local pickup coordination when a package window is available",
];

export default function ChickStartPage() {
  const gear = GEAR_ITEMS.filter((item) => item.tags.includes("chicks") || item.tags.includes("brooder") || item.tags.includes("starter-gear"));
  const subject = "Chick-Start Season Package request";
  const body = [
    "Hi Stiffler Homestead,",
    "",
    "I would like to request a Chick-Start Season Package.",
    "",
    "My name:",
    "My phone:",
    "My city:",
    "How many chicks I am planning for:",
    "My target start date:",
    "What I already have:",
    "What I still need help with:",
  ].join("\n");
  const requestHref = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <section className="overflow-hidden rounded-[2rem] bg-[#ddf8e8] p-6 shadow-xl shadow-green-900/10 sm:p-10 md:grid md:grid-cols-[1fr_.72fr] md:items-center md:gap-8 md:p-14">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Seasonal local pickup offer</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-[#183b25] sm:text-5xl md:text-6xl">Start chicks with a plan, not a late-night shopping cart.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-700">
            The Chick-Start Season Package is for families who want a practical beginning: a clear brooder plan, a right-sized equipment list, and local coordination when package windows are open. We confirm exact contents, timing, and pricing with you before you commit.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={requestHref} className="rounded-full bg-[#2f7d4b] px-6 py-3 text-center font-black text-white shadow-lg shadow-green-900/10 hover:bg-[#27683f]">Request a chick-start package</a>
            <a href="#do-it-yourself" className="rounded-full border-2 border-[#2f7d4b] bg-white px-6 py-3 text-center font-black text-[#2f7d4b] hover:bg-green-50">See the exact gear list</a>
          </div>
        </div>
        <aside className="mt-8 rounded-[2rem] bg-[#183b25] p-6 text-white shadow-lg md:mt-0">
          <p className="text-5xl" aria-hidden>🐥</p>
          <h2 className="mt-4 text-2xl font-black">What the package helps solve</h2>
          <ul className="mt-4 grid gap-3 leading-7 text-white/85">
            {included.map((item) => <li key={item} className="flex gap-3"><span className="text-amber-300">✓</span><span>{item}</span></li>)}
          </ul>
        </aside>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ["1", "Tell us your flock plan", "Share chick count, start date, space, and what you already own."],
          ["2", "We confirm the right package", "We will confirm current local availability, package details, pickup timing, and price before you reserve."],
          ["3", "Bring them home prepared", "Use the plan and gear list to set up before chicks arrive—not while they are peeping in a cardboard box."],
        ].map(([step, title, copy]) => (
          <article key={step} className="rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 font-black text-[#183b25]">{step}</span>
            <h2 className="mt-5 text-2xl font-black text-[#183b25]">{title}</h2>
            <p className="mt-3 leading-7 text-gray-700">{copy}</p>
          </article>
        ))}
      </section>

      <section id="do-it-yourself" className="mt-12 rounded-[2rem] bg-[#fffaf0] p-6 ring-1 ring-green-900/10 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Prefer to build your own?</p>
          <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">The chick-start gear we would start with</h2>
          <p className="mt-4 leading-7 text-gray-700">Buy only what makes your first few weeks safer and simpler. These are direct product links; they support Stiffler Homestead through Amazon at no extra cost to you.</p>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {gear.map((item) => (
            <article key={item.slug} className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5">
              <span className="w-fit rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#183b25]">{item.priority}</span>
              <h3 className="mt-4 text-xl font-black leading-tight text-[#183b25]">{item.name}</h3>
              <p className="mt-3 flex-1 leading-7 text-gray-700">{item.recommendation}</p>
              <p className="mt-4 rounded-2xl bg-[#f7f3ea] p-3 text-sm font-semibold leading-6 text-gray-700">{item.notes}</p>
              <a href={item.affiliateUrl} target="_blank" rel="noreferrer" className="mt-5 rounded-full bg-amber-300 px-5 py-3 text-center font-black text-[#183b25] hover:bg-amber-200">{item.linkLabel}</a>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-gray-600"><strong>Affiliate disclosure:</strong> As an Amazon Associate, Stiffler Homestead earns from qualifying purchases. Gear links are here because they are useful; any commission is a small help to the homestead.</p>
        <Link href="/stuff-we-use" className="mt-6 inline-flex rounded-full border-2 border-[#2f7d4b] px-5 py-3 font-black text-[#2f7d4b] hover:bg-green-50">Browse all Stuff We Use</Link>
      </section>

      <section className="mt-12 rounded-[2rem] bg-[#183b25] p-6 text-white sm:p-8 md:flex md:items-center md:justify-between md:gap-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Need a little more help?</p>
          <h2 className="mt-2 text-3xl font-black">Start with a Homestead Setup Call.</h2>
          <p className="mt-3 max-w-3xl leading-7 text-white/80">If chicks are only one piece of a bigger homestead plan, request a practical setup conversation first.</p>
        </div>
        <Link href="/homestead-setup-call" className="mt-5 inline-flex shrink-0 rounded-full bg-amber-300 px-5 py-3 font-black text-[#183b25] hover:bg-amber-200 md:mt-0">Explore setup calls</Link>
      </section>
    </div>
  );
}
