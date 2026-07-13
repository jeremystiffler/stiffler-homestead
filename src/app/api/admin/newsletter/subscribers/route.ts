import { NextResponse } from "next/server";
import { listSubscribers } from "@/lib/newsletterStore";

function isAuthorized(request: Request) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return false;
  return request.headers.get("x-admin-password") === configuredPassword;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
