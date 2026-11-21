import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const messages = await prisma.contactMessage.findMany({
    orderBy: { receivedAt: "desc" },
    take: 100,
    select: { id: true, name: true, email: true, subject: true, message: true, status: true, receivedAt: true },
  });
  return NextResponse.json({ messages });
}
