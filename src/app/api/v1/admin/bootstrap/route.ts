import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(14).max(128),
  bootstrapSecret: z.string().min(24).max(256),
});

function secretMatches(received: string, expected: string) {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.ADMIN_BOOTSTRAP_SECRET;
  if (!expected || expected.startsWith("replace-with-")) {
    return NextResponse.json({ error: "A configuração inicial não está disponível." }, { status: 503 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos. A palavra-passe deve ter pelo menos 14 caracteres." }, { status: 400 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateKey = createHash("sha256").update("admin-bootstrap:" + ip).digest("hex");
  const now = new Date();
  const threshold = new Date(now.getTime() - 15 * 60 * 1000);
  try {
    const attempts = await prisma.$transaction(async (tx) => {
      await tx.rateLimitBucket.upsert({ where: { key: rateKey }, create: { key: rateKey, count: 0, windowStartedAt: now }, update: {} });
      await tx.rateLimitBucket.updateMany({ where: { key: rateKey, windowStartedAt: { lte: threshold } }, data: { count: 1, windowStartedAt: now } });
      await tx.rateLimitBucket.updateMany({ where: { key: rateKey, windowStartedAt: { gt: threshold } }, data: { count: { increment: 1 } } });
      return (await tx.rateLimitBucket.findUniqueOrThrow({ where: { key: rateKey } })).count;
    }, { isolationLevel: "Serializable" });
    if (attempts > 4) return NextResponse.json({ error: "Demasiadas tentativas. Aguarde 15 minutos." }, { status: 429 });
  } catch {
    return NextResponse.json({ error: "Não foi possível validar a configuração inicial." }, { status: 503 });
  }

  if (!secretMatches(parsed.data.bootstrapSecret, expected)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const user = await prisma.$transaction(async (tx) => {
      const count = await tx.adminUser.count();
      if (count > 0) throw new Error("BOOTSTRAP_CLOSED");
      return tx.adminUser.create({
        data: {
          email: parsed.data.email.toLowerCase(),
          passwordHash: await argon2.hash(parsed.data.password, { type: argon2.argon2id }),
        },
      });
    });
    await createAdminSession(user.id);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "BOOTSTRAP_CLOSED") {
      return NextResponse.json({ error: "A configuração inicial já foi concluída." }, { status: 409 });
    }
    return NextResponse.json({ error: "Não foi possível criar o administrador." }, { status: 503 });
  }
}
