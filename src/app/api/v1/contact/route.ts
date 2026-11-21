import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/contact-validation";
import { consumeRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_000;
export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Pedido demasiado grande." }, { status: 413 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({
      error: "Verifique os campos assinalados.",
      fields: parsed.error.flatten().fieldErrors,
    }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot: answer normally without storing automated submissions.
  if (data.website) return NextResponse.json({ success: true });

  if (Date.now() - data.formStartedAt < 2500) {
    return NextResponse.json({ error: "Não foi possível validar o pedido. Tente novamente." }, { status: 400 });
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateKey = createHash("sha256").update(forwarded).digest("hex");

  try {
    const attempts = await consumeRateLimit(rateKey, 60 * 60 * 1000);
    if (attempts > MAX_PER_HOUR) {
      return NextResponse.json({ error: "Foram recebidos demasiados pedidos. Tente novamente mais tarde." }, {
        status: 429,
        headers: { "Retry-After": String(WINDOW_MS / 1000) },
      });
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        subject: data.subject || null,
        message: data.message,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível enviar a mensagem neste momento." }, { status: 503 });
  }
}
