"use client";

import { useMemo, useState } from "react";

type Subscriber = {
  email: string;
  interests: string[];
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

function downloadCsv(subscribers: Subscriber[]) {
  const header = ["email", "interests", "status", "source", "createdAt", "updatedAt"];
  const rows = subscribers.map((subscriber) => [
    subscriber.email,
    subscriber.interests.join(";"),
    subscriber.status,
    subscriber.source,
    subscriber.createdAt,
    subscriber.updatedAt,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `stiffler-homestead-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [audience, setAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const audienceCount = useMemo(() => {
    return subscribers.filter((subscriber) => {
      if (subscriber.status !== "subscribed") return false;
      if (audience === "all") return true;
      return subscriber.interests.includes(audience);
    }).length;
  }, [subscribers, audience]);

  async function loadSubscribers() {
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/newsletter/subscribers", {});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load subscribers.");
      setSubscribers(data.subscribers || []);
      setNotice(`Loaded ${data.subscribers?.length || 0} subscribers.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to load subscribers.");
    } finally {
      setLoading(false);
    }
  }

  async function sendNewsletter() {
    if (!window.confirm(`Send this email to ${audienceCount} subscriber(s)?`)) return;
    setLoading(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, audience }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send newsletter.");
      setNotice(`Newsletter sent to ${data.campaign.sentCount} subscriber(s). Failed: ${data.campaign.failedCount}.`);
      setSubject("");
      setMessage("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to send newsletter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Newsletter admin</p>
          <h2 className="mt-2 text-3xl font-black text-[#183b25]">Capture and send emails from the site</h2>
          <p className="mt-2 max-w-3xl leading-7 text-gray-700">
            Subscribers are saved in your private Supabase storage. Export the list any time, or send a broadcast when a Resend API key is configured.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[18rem_1fr]">
        <aside className="rounded-2xl bg-[#f7f3ea] p-4">
          <button type="button" onClick={loadSubscribers} disabled={loading} className="w-full rounded-full bg-[#2f7d4b] px-4 py-3 font-black text-white disabled:opacity-60">
            Load subscribers
          </button>
          <button type="button" onClick={() => downloadCsv(subscribers)} disabled={!subscribers.length} className="mt-2 w-full rounded-full bg-amber-300 px-4 py-3 font-black text-[#183b25] disabled:opacity-60">
            Export CSV
          </button>
          <p className="mt-4 text-sm font-semibold text-gray-700">{subscribers.length} total subscriber(s)</p>
        </aside>

        <div className="grid gap-5">
          {notice && <p className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-950">{notice}</p>}

          <div className="rounded-2xl border border-green-900/10 p-4">
            <h3 className="text-xl font-black text-[#183b25]">Send broadcast</h3>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Audience
                <select value={audience} onChange={(event) => setAudience(event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3">
                  <option value="all">All subscribers</option>
                  <option value="food">Farm products only</option>
                  <option value="videos">Videos and homestead updates only</option>
                </select>
              </label>
              <p className="text-sm font-semibold text-gray-600">Current audience: {audienceCount} subscriber(s)</p>
              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Subject
                <input value={subject} onChange={(event) => setSubject(event.target.value)} className="rounded-xl border border-green-900/20 px-4 py-3" placeholder="Fresh chicken pickup openings this week" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-gray-700">
                Message
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={8} className="rounded-xl border border-green-900/20 px-4 py-3" placeholder="Write the email exactly how you want it sent." />
              </label>
              <button type="button" onClick={sendNewsletter} disabled={loading || !subject || !message || audienceCount === 0} className="rounded-full bg-[#183b25] px-5 py-3 font-black text-white disabled:opacity-60">
                Send newsletter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-green-900/10">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-[#183b25] text-white">
                <tr>
                  <th className="p-3">Email</th>
                  <th className="p-3">Interests</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.email} className="border-t border-green-900/10">
                    <td className="p-3 font-bold text-[#183b25]">{subscriber.email}</td>
                    <td className="p-3">{subscriber.interests.join(", ")}</td>
                    <td className="p-3">{subscriber.source}</td>
                    <td className="p-3">{new Date(subscriber.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
