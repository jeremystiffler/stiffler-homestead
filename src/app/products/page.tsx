import ProductOrderCard from "@/components/ProductOrderCard";
import { getAllProducts } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Local Homestead Meat, Eggs & Availability Near Lexington KY",
  description: "Reserve local Stiffler Homestead meat chickens, pork, lamb, eggs, and future honey availability for pickup near Lexington, Kentucky.",
  alternates: { canonical: "/products" },
};

const productFaqs = [
  ["Is this for local pickup?", "Yes. Stiffler Homestead food listings are intended for local pickup near Lexington, Kentucky unless a product says otherwise."],
  ["Can I reserve meat chickens before processing day?", "Yes. Available or preorder meat chicken listings can be requested or paid through checkout once pricing and Stripe are enabled."],
  ["What happens when online checkout is connected?", "Stripe checkout will collect payment, then the webhook will reduce inventory automatically in the product database."],
];

export default async function ProductsPage() {
  const products = await getAllProducts();
  const jsonLd = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: productFaqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="rounded-[2rem] bg-[#183b25] p-5 text-white shadow-xl shadow-green-900/10 sm:p-8 md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Local food from the homestead</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
          Meat chickens, pork, lamb, eggs — and eventually maybe honey.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          This is the public availability board for local pickup or paid checkout. Choose what is open, pick a quantity, and pay online when checkout is enabled.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="rounded-full bg-amber-300 px-5 py-3 text-center font-black text-[#183b25]">
            Ask a question
          </a>
          <a href="#availability" className="rounded-full border border-white/30 px-5 py-3 text-center font-black text-white hover:bg-white/10">
            See availability
          </a>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ["1", "Choose what is available", "Each card shows the current quantity, price, image, and pickup expectations."],
          ["2", "Checkout or request", "Stripe checkout can collect payment online; PayPal, Venmo, or email requests can be shown too."],
          ["3", "Inventory updates", "Paid Stripe orders reduce the product quantity automatically when the webhook is connected."],
        ].map(([step, title, copy]) => (
          <div key={step} className="rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-300 font-black text-[#183b25]">{step}</div>
            <h2 className="mt-4 text-xl font-black text-[#183b25]">{title}</h2>
            <p className="mt-2 leading-7 text-gray-700">{copy}</p>
          </div>
        ))}
      </section>

      <section id="availability" className="mt-12">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Availability board</p>
            <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Current homestead products</h2>
          </div>
          <a href="/blog" className="w-full rounded-full bg-white px-5 py-3 text-center font-black text-[#2f7d4b] shadow-sm sm:w-auto">
            Read the homestead blog
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductOrderCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Buying local food FAQ</p>
        <h2 className="mt-2 text-3xl font-black text-[#183b25]">What to know before reserving</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {productFaqs.map(([question, answer]) => (
            <div key={question} className="rounded-2xl bg-[#f7f3ea] p-5">
              <h3 className="font-black text-[#183b25]">{question}</h3>
              <p className="mt-2 leading-7 text-gray-700">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
