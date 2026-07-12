export const metadata = { title: "Disclosure" };

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-green-900/5">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Disclosure</p>
        <h1 className="mt-2 text-4xl font-black text-[#183b25]">Affiliate disclosure</h1>
        <p className="mt-5 leading-8 text-gray-700">
          Stiffler Homestead participates in the Amazon Associates Program. As an Amazon Associate I earn from qualifying purchases. Some posts include affiliate links to Amazon or other partner resources. Those links may earn a commission at no extra cost to you.
        </p>
        <p className="mt-4 leading-8 text-gray-700">
          We only link tools, supplies, or ideas that fit the topic of the post. Always check current product details, reviews, safety requirements, and fit for your own property before buying.
        </p>
      </div>
    </div>
  );
}
