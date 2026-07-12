export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Stiffler Homestead",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Family, faith, and practical homesteading lessons from Lexington, Kentucky.",
  color: process.env.NEXT_PUBLIC_SITE_COLOR || "#2f7d4b",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://stiffler-homestead.vercel.app",
  amazonTag: "stifflerhom01-20",
  youtubeUrl: "https://www.youtube.com/@stifflerhomestead",
  supplyGuideUrl: "https://homestead-supply-guide.vercel.app",
  mailchimpActionUrl: process.env.NEXT_PUBLIC_MAILCHIMP_ACTION_URL || "",
  mailchimpBotTrapName: process.env.NEXT_PUBLIC_MAILCHIMP_BOT_TRAP || "",
};
