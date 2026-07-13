function envValue(value: string | undefined, fallback = "") {
  const cleaned = value?.trim();
  if (!cleaned || cleaned === "\"\"" || cleaned === "''") return fallback;
  return cleaned;
}

export const SITE_CONFIG = {
  name: envValue(process.env.NEXT_PUBLIC_SITE_NAME, "Stiffler Homestead"),
  tagline: envValue(process.env.NEXT_PUBLIC_SITE_TAGLINE, "Family, faith, and practical homesteading lessons from Lexington, Kentucky."),
  color: envValue(process.env.NEXT_PUBLIC_SITE_COLOR, "#2f7d4b"),
  siteUrl: envValue(process.env.NEXT_PUBLIC_SITE_URL, "https://stiffler-homestead.vercel.app"),
  amazonTag: "stifflerhom01-20",
  contactEmail: envValue(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "Jeremystiffler@gmail.com"),
  youtubeUrl: "https://www.youtube.com/@stifflerhomestead",
  youtubeSubscribeUrl: "https://www.youtube.com/@stifflerhomestead?sub_confirmation=1",
  supplyGuideUrl: "https://homestead-supply-guide.vercel.app",
  wisephoneUrl: "https://wisephone.com?aff=215",
  wisephoneDiscountUrl: "https://wisephone.com/discount/StifflerHomestead",
  covenantEyesUrl: "https://covenanteyes.sjv.io/BnDKYx",
  mailchimpActionUrl: process.env.NEXT_PUBLIC_MAILCHIMP_ACTION_URL || "",
  mailchimpBotTrapName: process.env.NEXT_PUBLIC_MAILCHIMP_BOT_TRAP || "",
  mailchimpFoodInterestInputName: process.env.NEXT_PUBLIC_MAILCHIMP_FOOD_INTEREST_INPUT || "",
  mailchimpFoodInterestValue: process.env.NEXT_PUBLIC_MAILCHIMP_FOOD_INTEREST_VALUE || "1",
  mailchimpVideosInterestInputName: process.env.NEXT_PUBLIC_MAILCHIMP_VIDEOS_INTEREST_INPUT || "",
  mailchimpVideosInterestValue: process.env.NEXT_PUBLIC_MAILCHIMP_VIDEOS_INTEREST_VALUE || "1",
  mailchimpInterestsMergeField: process.env.NEXT_PUBLIC_MAILCHIMP_INTERESTS_MERGE_FIELD || "",
};
