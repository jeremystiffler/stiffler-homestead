import { getSupabaseServerClient } from "@/lib/supabase";

export type NewsletterInterest = "food" | "videos";

export type NewsletterSubscriber = {
  email: string;
  interests: NewsletterInterest[];
  status: "subscribed" | "unsubscribed";
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type NewsletterCampaign = {
  id: string;
  subject: string;
  body: string;
  audience: "all" | NewsletterInterest;
  sentCount: number;
  failedCount: number;
  status: "sent" | "draft" | "failed";
  createdAt: string;
  error?: string;
};

type SubscriberFile = {
  subscribers: NewsletterSubscriber[];
};

const BUCKET = "homestead-newsletter";
const SUBSCRIBERS_PATH = "subscribers.json";

function nowIso() {
  return new Date().toISOString();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isNewsletterInterest(value: string): value is NewsletterInterest {
  return value === "food" || value === "videos";
}

export function normalizeInterests(input: unknown): NewsletterInterest[] {
  const values = Array.isArray(input) ? input : [];
  const interests = values.map(String).filter(isNewsletterInterest);
  const fallback: NewsletterInterest[] = ["food", "videos"];
  return Array.from(new Set<NewsletterInterest>(interests.length ? interests : fallback));
}

async function ensureBucket() {
  const supabase = getSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured yet.");

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  if (!buckets?.some((bucket) => bucket.name === BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (createError) throw createError;
  }

  return supabase;
}

async function readSubscribersFile(): Promise<SubscriberFile> {
  const supabase = await ensureBucket();
  const { data, error } = await supabase.storage.from(BUCKET).download(SUBSCRIBERS_PATH);

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("not found") || message.includes("does not exist")) return { subscribers: [] };
    throw error;
  }

  const text = await data.text();
  if (!text.trim()) return { subscribers: [] };
  const parsed = JSON.parse(text) as SubscriberFile;
  return { subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [] };
}

async function writeSubscribersFile(file: SubscriberFile) {
  const supabase = await ensureBucket();
  const payload = JSON.stringify({ subscribers: file.subscribers }, null, 2);
  const { error } = await supabase.storage.from(BUCKET).upload(SUBSCRIBERS_PATH, payload, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw error;
}

export async function listSubscribers() {
  const file = await readSubscribersFile();
  return file.subscribers.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertSubscriber(emailInput: string, interestsInput: unknown, source = "website") {
  const email = normalizeEmail(emailInput);
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a valid email address.");

  const interests = normalizeInterests(interestsInput);
  const file = await readSubscribersFile();
  const existing = file.subscribers.find((subscriber) => subscriber.email === email);
  const timestamp = nowIso();

  if (existing) {
    existing.interests = interests;
    existing.status = "subscribed";
    existing.source = source;
    existing.updatedAt = timestamp;
  } else {
    file.subscribers.push({
      email,
      interests,
      status: "subscribed",
      source,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  await writeSubscribersFile(file);
  return file.subscribers.find((subscriber) => subscriber.email === email)!;
}

export async function deleteSubscriber(emailInput: string) {
  const email = normalizeEmail(emailInput);
  if (!email) throw new Error("Email is required.");

  const file = await readSubscribersFile();
  const before = file.subscribers.length;
  file.subscribers = file.subscribers.filter((subscriber) => subscriber.email !== email);

  if (file.subscribers.length === before) throw new Error("Subscriber was not found.");

  await writeSubscribersFile(file);
  return { email };
}

export async function saveCampaign(campaign: NewsletterCampaign) {
  const supabase = await ensureBucket();
  const payload = JSON.stringify(campaign, null, 2);
  const { error } = await supabase.storage.from(BUCKET).upload(`campaigns/${campaign.id}.json`, payload, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw error;
  return campaign;
}

export function filterSubscribersByAudience(subscribers: NewsletterSubscriber[], audience: "all" | NewsletterInterest) {
  return subscribers.filter((subscriber) => {
    if (subscriber.status !== "subscribed") return false;
    if (audience === "all") return true;
    return subscriber.interests.includes(audience);
  });
}
