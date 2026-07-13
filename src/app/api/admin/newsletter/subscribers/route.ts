import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { listSubscribers } from "@/lib/newsletterStore";

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
    const subscribers = await listSubscribers();
    return NextResponse.json({ subscribers, loadedAt: new Date().toISOString() }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load newsletter subscribers." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
