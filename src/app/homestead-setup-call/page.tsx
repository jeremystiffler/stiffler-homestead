import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Homestead Setup Call | Practical Help for First Steps",
  description: "Request a practical Stiffler Homestead setup call for help planning chickens, brooders, basic garden systems, and the first purchases that matter.",
  alternates: { canonical: "/homestead-setup-call" },
};

const callTopics = [
  ["Start with the real problem", "Talk through your space, timeline, family rhythm, and the one project that keeps circling the kitchen table."],
  ["Leave with a sane first list", "Get a practical order of operations so you do not buy six shiny things and still lack the one part that keeps chicks alive or water flowing."],
  ["Make the next move", "We will point you toward a first weekend project, a gear decision, or the right reason to wait. Honest beats impressive."],
];

export default function HomesteadSetupCallPage() {
  const subject = "Homestead Setup Call request";
  const body = [
    "Hi Stiffler Homestead,",
    "",
    "I would like to request a Homestead Setup Call.",
    "",
    "My name:",
    "My phone:",
    "Best way to reach me:",
    "What I am trying to start or solve:",
    "Where I am located:",
    "A few times that could work for a call:",
  ].join("\n");
  const requestHref = `mailto:${SITE_CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <section className="overflow-hidden rounded-[2rem] bg-[#183b25] p-6 text-white shadow-xl shadow-green-900/10 sm:p-10 md:p-14">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Practical one-on-one help</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">Start your homestead without buying the wrong first thing.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          A Homestead Setup Call is a straightforward conversation for families starting chickens, sorting out a brooder, planning a small garden, or figuring out the next sensible step. This is practical peer help from the muddy middle—not veterinary, construction, legal, or professional agricultural advice.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={requestHref} className="rounded-full bg-amber-300 px-6 py-3 text-center font-black text-[#183b25] hover:bg-amber-200">Request a setup call</a>
          <Link href="/chick-start" className="rounded-full border border-white/30 px-6 py-3 text-center font-black text-white hover:bg-white/10">Starting with chicks?</Link>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {callTopics.map(([title, copy], index) => (
          <article key={title} className="rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 font-black text-[#183b25]">{index + 1}</span>
            <h2 className="mt-5 text-2xl font-black text-[#183b25]">{title}</h2>
            <p className="mt-3 leading-7 text-gray-700">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-8 rounded-[2rem] bg-[#f7f3ea] p-6 sm:p-8 md:grid-cols-[1fr_.8fr] md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">How it works</p>
          <h2 className="mt-3 text-3xl font-black text-[#183b25]">A request first. Then a real conversation.</h2>
          <ol className="mt-5 grid gap-3 leading-7 text-gray-700">
            <li><strong className="text-[#183b25]">1. Send a request.</strong> Tell us what you are starting, where you are stuck, and a few times that work.</li>
            <li><strong className="text-[#183b25]">2. We confirm fit, timing, and price.</strong> Call length and current availability are confirmed before anything is booked.</li>
            <li><strong className="text-[#183b25]">3. Show up with your questions.</strong> Bring photos, measurements, links, or the part that is making you say “surely this cannot be this complicated.”</li>
          </ol>
        </div>
        <aside className="rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5">
          <h2 className="text-2xl font-black text-[#183b25]">Good fit for</h2>
          <ul className="mt-4 grid gap-3 leading-7 text-gray-700">
            <li>First backyard chickens</li>
            <li>Brooder and chick-start planning</li>
            <li>Simple family garden systems</li>
            <li>Basic gear decisions before you spend</li>
          </ul>
          <a href={requestHref} className="mt-6 block rounded-full bg-[#2f7d4b] px-5 py-3 text-center font-black text-white hover:bg-[#27683f]">Request a setup call</a>
        </aside>
      </section>
    </div>
  );
}
