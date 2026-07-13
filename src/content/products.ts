export type ProductStatus = "available" | "preorder" | "sold_out" | "coming_soon" | "hidden";
export type ProductCategory = "Meat chickens" | "Pork" | "Lamb" | "Eggs" | "Honey";

export interface HomesteadProduct {
  id?: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  priceCents: number;
  priceLabel: string;
  priceNote?: string;
  unitLabel: string;
  availableQuantity: number;
  status: ProductStatus;
  availabilityWindow: string;
  pickupNote: string;
  imageUrl?: string;
  imageAlt?: string;
  imageEmoji: string;
  soldOutMessage: string;
  featured?: boolean;
  paypalUrl?: string;
  venmoUrl?: string;
}

export const PRODUCTS: HomesteadProduct[] = [
  {
    slug: "pasture-raised-meat-chickens",
    name: "Pasture-Raised Meat Chickens",
    category: "Meat chickens",
    description: "Whole processed chickens raised on our family homestead. Reserve your birds ahead of processing day.",
    priceCents: 0,
    priceLabel: "Contact for launch pricing",
    priceNote: "Price will be confirmed before pickup.",
    unitLabel: "whole chickens",
    availableQuantity: 30,
    status: "preorder",
    availabilityWindow: "Next batch: update with processing month",
    pickupNote: "Local pickup near Lexington, KY. We will confirm date, time, and final total before pickup.",
    imageEmoji: "🐓",
    imageAlt: "Pasture-raised meat chickens from Stiffler Homestead",
    soldOutMessage: "This chicken batch is sold out. Contact us to get on the next availability list.",
    featured: true,
  },
  {
    slug: "pasture-raised-pork",
    name: "Pasture-Raised Pork",
    category: "Pork",
    description: "Homestead-raised pork availability, deposits, shares, and cuts can be listed here as each season is ready.",
    priceCents: 0,
    priceLabel: "Contact for current pricing",
    unitLabel: "shares or cuts",
    availableQuantity: 0,
    status: "coming_soon",
    availabilityWindow: "Future availability",
    pickupNote: "Join the interest list and we will contact you when pork is available.",
    imageEmoji: "🐖",
    imageAlt: "Pasture-raised pork from Stiffler Homestead",
    soldOutMessage: "Pork is not currently available. Contact us for the next season.",
    featured: true,
  },
  {
    slug: "pasture-raised-lamb",
    name: "Pasture-Raised Lamb",
    category: "Lamb",
    description: "Whole/half lamb or cut availability can be edited here when lamb is ready for reservation.",
    priceCents: 0,
    priceLabel: "Contact for current pricing",
    unitLabel: "shares or cuts",
    availableQuantity: 0,
    status: "coming_soon",
    availabilityWindow: "Future availability",
    pickupNote: "Join the lamb interest list and we will reach out when availability opens.",
    imageEmoji: "🐑",
    imageAlt: "Pasture-raised lamb from Stiffler Homestead",
    soldOutMessage: "Lamb is not currently available. Contact us for next availability.",
    featured: true,
  },
  {
    slug: "farm-fresh-eggs",
    name: "Farm-Fresh Eggs",
    category: "Eggs",
    description: "Egg availability from our laying hens. Update quantity and price as weekly inventory changes.",
    priceCents: 0,
    priceLabel: "Contact for current dozen price",
    priceNote: "Egg price will be confirmed before pickup.",
    unitLabel: "dozens",
    availableQuantity: 0,
    status: "sold_out",
    availabilityWindow: "Weekly availability varies",
    pickupNote: "Local pickup only. We will confirm current inventory before pickup.",
    imageEmoji: "🥚",
    imageAlt: "Farm-fresh eggs from Stiffler Homestead",
    soldOutMessage: "Eggs are currently sold out. Contact us for the next available dozens.",
    featured: true,
  },
  {
    slug: "homestead-honey",
    name: "Homestead Honey",
    category: "Honey",
    description: "A future spot for honey if/when it becomes available from the homestead.",
    priceCents: 0,
    priceLabel: "Coming later",
    unitLabel: "jars",
    availableQuantity: 0,
    status: "coming_soon",
    availabilityWindow: "Possible future product",
    pickupNote: "Join the interest list and we will let you know if honey becomes available.",
    imageEmoji: "🍯",
    imageAlt: "Future homestead honey from Stiffler Homestead",
    soldOutMessage: "Honey is not available yet. Contact us to hear about future batches.",
  },
];
