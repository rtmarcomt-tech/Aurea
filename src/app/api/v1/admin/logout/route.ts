import { NextResponse } from "next/server";
import { revokeAdminSession } from "@/lib/admin-auth";

export async function POST() {
  try {
    await revokeAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível terminar a sessão." }, { status: 503 });
  }
}
