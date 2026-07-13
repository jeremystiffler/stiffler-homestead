import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { deleteSubscriber, filterSubscribersByAudience, listSubscribers, updateSubscriberInterests, type NewsletterInterest } from "@/lib/newsletterStore";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};


export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    const { searchParams } = new URL(request.url);
    const audience = searchParams.get("audience") || "all";
    if (!["all", "food", "videos"].includes(audience)) {
      return NextResponse.json({ error: "Invalid audience." }, { status: 400, headers: NO_STORE_HEADERS });
    }

    const allSubscribers = await listSubscribers();
    const subscribers = filterSubscribersByAudience(allSubscribers, audience as "all" | NewsletterInterest);
    return NextResponse.json({ subscribers, totalCount: allSubscribers.length, loadedAt: new Date().toISOString() }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load newsletter subscribers." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const subscriber = await updateSubscriberInterests(body.email || "", body.interests);
    return NextResponse.json({ ok: true, subscriber }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update newsletter subscriber." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const result = await deleteSubscriber(body.email || "");
    return NextResponse.json({ ok: true, deleted: result }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete newsletter subscriber." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }
}
