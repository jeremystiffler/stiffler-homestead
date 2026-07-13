"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to sign in.");
      const nextPath = new URLSearchParams(window.location.search).get("next");
      window.location.href = nextPath?.startsWith("/admin") ? nextPath : "/admin";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 py-12">
      <form onSubmit={submit} className="w-full rounded-3xl bg-white p-6 shadow-xl shadow-green-900/10 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Storefront admin</p>
        <h1 className="mt-2 text-3xl font-black text-[#183b25]">Admin login</h1>
        <p className="mt-3 leading-7 text-gray-700">Enter the admin password to edit products, view orders, and manage newsletter subscribers.</p>

        <label className="mt-6 grid gap-2 text-sm font-black text-[#183b25]">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
            className="rounded-xl border border-green-900/20 px-4 py-3 font-medium"
          />
        </label>

        {message && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-950">{message}</p>}

        <button type="submit" disabled={loading || !password} className="mt-5 w-full rounded-full bg-[#2f7d4b] px-5 py-3 font-black text-white disabled:opacity-60">
          {loading ? "Checking..." : "Log in"}
        </button>

        <Link href="/" className="mt-4 block text-center text-sm font-bold text-[#2f7d4b] hover:underline">
          Back to storefront
        </Link>
      </form>
    </div>
  );
}
