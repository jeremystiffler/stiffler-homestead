import { NextResponse } from "next/server";
import { upsertSubscriber } from "@/lib/newsletterStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subscriber = await upsertSubscriber(body.email || "", body.interests, body.source || "website");
    return NextResponse.json({ ok: true, subscriber: { email: subscriber.email, interests: subscriber.interests } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to subscribe right now." },
      { status: 400 },
    );
  }
}
