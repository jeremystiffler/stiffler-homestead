import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { listSubscribers } from "@/lib/newsletterStore";


export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const subscribers = await listSubscribers();
    return NextResponse.json({ subscribers });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load newsletter subscribers." },
      { status: 500 },
    );
  }
}
