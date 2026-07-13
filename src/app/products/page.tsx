import ProductOrderCard from "@/components/ProductOrderCard";
import EmailSignup from "@/components/EmailSignup";
import { getAllProducts } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Stiffler Homestead Storefront | Local Pickup Near Lexington KY",
  description: "Order local Stiffler Homestead food for scheduled pickup near Lexington, Kentucky. Choose a product, select quantity, purchase, or subscribe for new availability.",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Stiffler Homestead local food availability",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_CONFIG.siteUrl}/products#${product.slug}`,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description,
        category: product.category,
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: product.availableQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${SITE_CONFIG.siteUrl}/products#${product.slug}`,
        },
      },
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="rounded-[2rem] bg-[#183b25] p-5 text-white shadow-xl shadow-green-900/10 sm:p-8 md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Local pickup only near Lexington, KY</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
          Stiffler Homestead Storefront
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          Simple local ordering: choose an item, select the quantity, purchase or request pickup, and we will coordinate the pickup time with you.
        </p>
      </section>

      <section className="mt-8 grid gap-4 rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 md:grid-cols-3 md:p-6">
        {[
          ["1", "Choose your product"],
          ["2", "Select the quantity"],
          ["3", "Purchase and schedule pickup"],
        ].map(([step, title]) => (
          <div key={step} className="flex items-center gap-3 rounded-2xl bg-[#f7f3ea] p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-300 font-black text-[#183b25]">{step}</div>
            <h2 className="font-black text-[#183b25]">{title}</h2>
          </div>
        ))}
      </section>

      <section id="availability" className="mt-10">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Current items</p>
          <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Available products</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductOrderCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <EmailSignup
          heading="Want to know when new food is available?"
          subtext="Subscribe for farm product availability, local pickup openings, videos, and Stiffler Homestead updates."
        />
      </section>
    </div>
  );
}
