import ProductAdmin from "@/components/ProductAdmin";
import NewsletterAdmin from "@/components/NewsletterAdmin";

export const metadata = {
  title: "Homestead Product Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <div className="mb-8 rounded-3xl bg-[#183b25] p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Storefront backend</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Edit products, upload images, reorder cards, and confirm manual payments</h1>
        <p className="mt-4 max-w-3xl leading-8 text-white/80">
          Upload product images, enter prices in dollars, drag products to sort them, and mark PayPal/Venmo orders paid so inventory safely reduces only after payment is confirmed.
        </p>
      </div>
      <ProductAdmin />
      <NewsletterAdmin />
      <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <h2 className="font-black">Setup required before live payments</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
          <li>Create the Supabase tables using <code className="rounded bg-white px-2 py-1">supabase/schema.sql</code>.</li>
          <li>Add Vercel env vars: Supabase URL, anon key, service role key, admin password, Stripe secret key, Stripe webhook secret, and <code className="rounded bg-white px-2 py-1">RESEND_API_KEY</code> for newsletter broadcasts.</li>
          <li>Stripe automatically reduces inventory after the paid webhook event.</li>
          <li>PayPal and Venmo orders are saved as pending orders; click <strong>Mark paid</strong> after confirming payment to reduce inventory safely.</li>
        </ul>
      </div>
    </div>
  );
}
