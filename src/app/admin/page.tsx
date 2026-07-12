import ProductAdmin from "@/components/ProductAdmin";

export const metadata = {
  title: "Homestead Product Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <div className="mb-8 rounded-3xl bg-[#183b25] p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Storefront backend</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Edit products, images, prices, quantities, and payment links</h1>
        <p className="mt-4 max-w-3xl leading-8 text-white/80">
          This admin connects to Supabase when the live environment variables are set. Stripe checkout uses the product price and automatically reduces inventory after a paid webhook event.
        </p>
      </div>
      <ProductAdmin />
      <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="font-black">Setup required before live payments</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
          <li>Create the Supabase tables using <code className="rounded bg-white px-2 py-1">supabase/schema.sql</code>.</li>
          <li>Add Vercel env vars: Supabase URL, anon key, service role key, admin password, Stripe secret key, and Stripe webhook secret.</li>
          <li>Set the Stripe webhook endpoint to <code className="rounded bg-white px-2 py-1">/api/stripe/webhook</code>.</li>
          <li>PayPal and Venmo links can be attached per product, but they do not automatically reduce inventory unless reconciled manually.</li>
        </ul>
      </div>
    </div>
  );
}
