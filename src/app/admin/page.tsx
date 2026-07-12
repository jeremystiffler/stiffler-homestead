export const metadata = {
  title: "Homestead Admin Notes",
  robots: { index: false, follow: false },
};

export default function AdminNotesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-14">
      <div className="rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Editing guide</p>
        <h1 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">How to update products and availability</h1>
        <p className="mt-5 leading-8 text-gray-700">
          Product inventory is currently managed in a simple file-based CMS. It is safe, free, and easy to deploy — perfect until you are ready for paid checkout/database automation.
        </p>
        <ol className="mt-6 list-decimal space-y-4 pl-6 leading-7 text-gray-700">
          <li>Edit <code className="rounded bg-[#f7f3ea] px-2 py-1">src/content/products.ts</code>.</li>
          <li>Change <code className="rounded bg-[#f7f3ea] px-2 py-1">availableQuantity</code>, <code className="rounded bg-[#f7f3ea] px-2 py-1">priceLabel</code>, <code className="rounded bg-[#f7f3ea] px-2 py-1">status</code>, and availability notes.</li>
          <li>Use <code className="rounded bg-[#f7f3ea] px-2 py-1">status: "available"</code> or <code className="rounded bg-[#f7f3ea] px-2 py-1">"preorder"</code> with a quantity above zero to open requests.</li>
          <li>Use <code className="rounded bg-[#f7f3ea] px-2 py-1">availableQuantity: 0</code> to make the product read sold out / contact for next availability.</li>
          <li>Deploy the site after editing.</li>
        </ol>
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <h2 className="font-black">Important limitation</h2>
          <p className="mt-2 leading-7">
            This version does not auto-decrement inventory after each emailed request. A true “30 chickens sell down to 0 automatically” checkout needs a live database and payment/order backend such as Shopify, Square, Stripe + database, or Supabase. The site is structured so that can be added next without redesigning the public pages.
          </p>
        </div>
      </div>
    </div>
  );
}
