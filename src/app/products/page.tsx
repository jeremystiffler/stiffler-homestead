import ProductOrderCard from "@/components/ProductOrderCard";
import { getAllProducts } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = {
  title: "Farm Fresh Eggs & Pasture-Raised Chicken Near Lexington KY",
  description: "Order local farm food from Stiffler Homestead for scheduled pickup near Lexington, Kentucky: farm-fresh eggs, pasture-raised meat chickens, seasonal lamb, and homestead food.",
  alternates: { canonical: "/products" },
};

export const dynamic = "force-dynamic";

const productFaqs = [
  ["Is this local pickup only?", "Yes. Stiffler Homestead storefront orders are for local customers near Lexington, Kentucky. We do not offer delivery or shipping through this storefront."],
  ["How do I buy?", "Choose a product, select the quantity, enter your contact info, and pay with the available checkout option. We will coordinate a pickup time after your order is confirmed."],
  ["Where do I pick up?", "Pickup is scheduled locally near Lexington, KY. Exact timing and pickup details are confirmed after purchase or reservation."],
  ["Can I get notified when eggs, chicken, or lamb are available?", "Yes. Subscribe for farm product and pickup-opening updates so you hear when limited local food batches are listed."],
];

const testimonials = [
  {
    quote: "Know where your food comes from, raised by a family homestead right here near Lexington.",
    name: "Local pickup promise",
    detail: "Traceable family food",
  },
  {
    quote: "Order what is actually available, then coordinate pickup details with a real person — not a mystery warehouse.",
    name: "Simple coordination",
    detail: "Easy local pickup",
  },
  {
    quote: "Support seasonal food that is honest about the work, the timing, and the real limits of a small homestead.",
    name: "Seasonal and honest",
    detail: "Real availability",
  },
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
            price: product.priceCents > 0 ? (product.priceCents / 100).toFixed(2) : undefined,
            priceCurrency: "USD",
            availability: product.infiniteQuantity || product.availableQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_CONFIG.siteUrl}/products#${product.slug}`,
          },
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_CONFIG.siteUrl}/#localbusiness`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.siteUrl,
      email: SITE_CONFIG.contactEmail,
      priceRange: "$$",
      description: "Local farm food pickup near Lexington, KY, including farm-fresh eggs, pasture-raised meat chickens, seasonal lamb, and homestead food when available.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lexington",
        addressRegion: "KY",
        addressCountry: "US",
      },
      areaServed: SITE_CONFIG.areaServed.map((name) => ({ "@type": "Place", name })),
      sameAs: [SITE_CONFIG.youtubeUrl],
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
          Local food from our homestead, available for scheduled pickup near Lexington, KY.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
          We raise and offer seasonal homestead food for Lexington-area families, including farm-fresh eggs, pasture-raised meat chickens, seasonal lamb, and limited local food batches. Browse what is currently listed, choose your quantity, pay or reserve, and we will schedule a local pickup time with you.
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
          ["1", "Choose your product", "Browse the storefront and pick the homestead food item you want to reserve or purchase."],
          ["2", "Select the quantity", "Enter how many you want, then add your name, email, and phone so we can coordinate pickup."],
          ["3", "Pay and schedule pickup", "Pay with the available option, and we will confirm a local pickup time near Lexington, KY."],
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
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">Storefront</p>
            <h2 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">Current local pickup items</h2>
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

      <section className="mt-12 overflow-hidden rounded-[2rem] bg-[#fffaf0] p-6 shadow-xl shadow-green-900/5 ring-1 ring-green-900/10 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 rounded-[1.5rem] bg-[#183b25] p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">Local families</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Why local families choose the storefront</h2>
            <p className="mt-4 max-w-3xl leading-8 text-white/80">
              We keep the storefront intentionally simple: seasonal food, honest availability, and pickup coordination with a real family on the other side.
            </p>
          </div>
          <a href={`mailto:${SITE_CONFIG.contactEmail}?subject=Stiffler%20Homestead%20testimonial`} className="inline-flex shrink-0 rounded-full bg-amber-300 px-5 py-3 font-black text-[#183b25] hover:bg-amber-200">
            Share your experience
          </a>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 ring-1 ring-green-900/10">
              <div className="flex gap-1 text-amber-400" aria-label="Five star note">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>★</span>
                ))}
              </div>
              <p className="mt-4 flex-1 text-lg font-bold leading-8 text-[#183b25]">{testimonial.quote}</p>
              <div className="mt-6 border-t border-green-900/10 pt-4">
                <p className="font-black text-[#183b25]">{testimonial.name}</p>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-[#2f7d4b]">{testimonial.detail}</p>
              </div>
            </article>
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
