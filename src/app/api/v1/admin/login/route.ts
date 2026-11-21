import { NextResponse } from "next/server";
import argon2 from "argon2";
import { createHash } from "node:crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Credenciais inválidas." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = createHash("sha256").update("admin-login:" + ip).digest("hex");
  const now = new Date();
  const threshold = new Date(now.getTime() - 15 * 60 * 1000);

  try {
    const attempts = await prisma.$transaction(async (tx) => {
      await tx.rateLimitBucket.upsert({ where: { key }, create: { key, count: 0, windowStartedAt: now }, update: {} });
      await tx.rateLimitBucket.updateMany({ where: { key, windowStartedAt: { lte: threshold } }, data: { count: 1, windowStartedAt: now } });
      await tx.rateLimitBucket.updateMany({ where: { key, windowStartedAt: { gt: threshold } }, data: { count: { increment: 1 } } });
      return (await tx.rateLimitBucket.findUniqueOrThrow({ where: { key } })).count;
    }, { isolationLevel: "Serializable" });

    if (attempts > 8) return NextResponse.json({ error: "Demasiadas tentativas. Aguarde 15 minutos." }, { status: 429 });

    const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    const valid = user?.isActive && await argon2.verify(user.passwordHash, parsed.data.password);
    if (!user || !valid) return NextResponse.json({ error: "Email ou palavra-passe incorretos." }, { status: 401 });

    await createAdminSession(user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Não foi possível iniciar sessão." }, { status: 503 });
  }
}
