export type ProductStatus = "available" | "preorder" | "sold_out" | "coming_soon";

export interface HomesteadProduct {
  slug: string;
  name: string;
  category: "Meat chickens" | "Pork" | "Lamb" | "Eggs" | "Honey";
  description: string;
  priceLabel: string;
  priceNote?: string;
  unitLabel: string;
  availableQuantity: number;
  status: ProductStatus;
  availabilityWindow: string;
  pickupNote: string;
  imageEmoji: string;
  soldOutMessage: string;
  featured?: boolean;
}

// Simple CMS: edit this file to update prices, quantities, wording, and availability.
// When availableQuantity reaches 0, the site shows Sold Out / contact for next availability.
export const PRODUCTS: HomesteadProduct[] = [
  {
    slug: "pasture-raised-meat-chickens",
    name: "Pasture-Raised Meat Chickens",
    category: "Meat chickens",
    description: "Whole processed chickens raised on our family homestead. Reserve your birds ahead of processing day.",
    priceLabel: "Contact for launch pricing",
    priceNote: "Price will be confirmed before pickup.",
    unitLabel: "whole chickens",
    availableQuantity: 30,
    status: "preorder",
    availabilityWindow: "Next batch: update with processing month",
    pickupNote: "Local pickup near Lexington, KY. We will confirm date, time, and final total before pickup.",
    imageEmoji: "🐓",
    soldOutMessage: "This chicken batch is sold out. Contact us to get on the next availability list.",
    featured: true,
  },
  {
    slug: "pasture-raised-pork",
    name: "Pasture-Raised Pork",
    category: "Pork",
    description: "Homestead-raised pork availability, deposits, shares, and cuts can be listed here as each season is ready.",
    priceLabel: "Contact for current pricing",
    unitLabel: "shares or cuts",
    availableQuantity: 0,
    status: "coming_soon",
    availabilityWindow: "Future availability",
    pickupNote: "Join the interest list and we will contact you when pork is available.",
    imageEmoji: "🐖",
    soldOutMessage: "Pork is not currently available. Contact us for the next season.",
    featured: true,
  },
  {
    slug: "pasture-raised-lamb",
    name: "Pasture-Raised Lamb",
    category: "Lamb",
    description: "Whole/half lamb or cut availability can be edited here when lamb is ready for reservation.",
    priceLabel: "Contact for current pricing",
    unitLabel: "shares or cuts",
    availableQuantity: 0,
    status: "coming_soon",
    availabilityWindow: "Future availability",
    pickupNote: "Join the lamb interest list and we will reach out when availability opens.",
    imageEmoji: "🐑",
    soldOutMessage: "Lamb is not currently available. Contact us for next availability.",
    featured: true,
  },
  {
    slug: "farm-fresh-eggs",
    name: "Farm-Fresh Eggs",
    category: "Eggs",
    description: "Egg availability from our laying hens. Update quantity and price as weekly inventory changes.",
    priceLabel: "Contact for current dozen price",
    priceNote: "Egg price will be confirmed before pickup.",
    unitLabel: "dozens",
    availableQuantity: 0,
    status: "sold_out",
    availabilityWindow: "Weekly availability varies",
    pickupNote: "Local pickup only. We will confirm current inventory before pickup.",
    imageEmoji: "🥚",
    soldOutMessage: "Eggs are currently sold out. Contact us for the next available dozens.",
    featured: true,
  },
  {
    slug: "homestead-honey",
    name: "Homestead Honey",
    category: "Honey",
    description: "A future spot for honey if/when it becomes available from the homestead.",
    priceLabel: "Coming later",
    unitLabel: "jars",
    availableQuantity: 0,
    status: "coming_soon",
    availabilityWindow: "Possible future product",
    pickupNote: "Join the interest list and we will let you know if honey becomes available.",
    imageEmoji: "🍯",
    soldOutMessage: "Honey is not available yet. Contact us to hear about future batches.",
  },
];
