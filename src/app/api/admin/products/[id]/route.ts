import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import { getSupabaseServerClient } from "@/lib/supabase";


export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthorized(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 503 });

  const { id } = await context.params;
  const { error } = await supabase.from("homestead_products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
