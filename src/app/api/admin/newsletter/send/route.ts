import { NextResponse } from "next/server";
import {
  filterSubscribersByAudience,
  listSubscribers,
  NewsletterInterest,
  saveCampaign,
} from "@/lib/newsletterStore";
import { SITE_CONFIG } from "@/lib/config";

function isAuthorized(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return false;
  return request.headers.get("x-admin-password") === configuredPassword;
}

function plainTextToHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

async function sendWithResend(to: string[], subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured yet. Add a Resend API key in Vercel to send broadcasts.");
  }

  const from = process.env.NEWSLETTER_FROM_EMAIL || `Stiffler Homestead <newsletter@${new URL(SITE_CONFIG.siteUrl).hostname}>`;
  const replyTo = process.env.NEWSLETTER_REPLY_TO || SITE_CONFIG.contactEmail;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      reply_to: replyTo,
      text: body,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#183b25">${plainTextToHtml(body)}<hr /><p style="font-size:12px;color:#667">You are receiving this because you subscribed at Stiffler Homestead. Reply to this email if you need anything changed.</p></div>`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Resend could not send the email.");
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const audience = String(body.audience || "all") as "all" | NewsletterInterest;

    if (!subject) return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });
    if (!["all", "food", "videos"].includes(audience)) return NextResponse.json({ error: "Invalid audience." }, { status: 400 });

    const subscribers = filterSubscribersByAudience(await listSubscribers(), audience);
    if (!subscribers.length) return NextResponse.json({ error: "No subscribed emails match that audience yet." }, { status: 400 });

    let sentCount = 0;
    let failedCount = 0;
    let lastError = "";

    for (let index = 0; index < subscribers.length; index += 50) {
      const batch = subscribers.slice(index, index + 50).map((subscriber) => subscriber.email);
      try {
        await sendWithResend(batch, subject, message);
        sentCount += batch.length;
      } catch (error) {
        failedCount += batch.length;
        lastError = error instanceof Error ? error.message : "Unknown send error";
      }
    }

    const campaign = await saveCampaign({
      id: `${Date.now()}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40)}`,
      subject,
      body: message,
      audience,
      sentCount,
      failedCount,
      status: failedCount && !sentCount ? "failed" : "sent",
      createdAt: new Date().toISOString(),
      error: lastError || undefined,
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send newsletter." },
      { status: 500 },
    );
  }
}
