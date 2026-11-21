import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ status: z.enum(["NEW", "READ", "ARCHIVED"]) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await context.params;
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Estado inválido." }, { status: 400 });

  try {
    const message = await prisma.$transaction(async (tx) => {
      const updated = await tx.contactMessage.update({
        where: { id },
        data: { status: parsed.data.status },
        select: { id: true, status: true },
      });
      await tx.auditEvent.create({
        data: { actorId: session.user.id, action: "CONTACT_STATUS_UPDATED", entityType: "ContactMessage", entityId: id, metadata: { status: parsed.data.status } },
      });
      return updated;
    });
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "Mensagem não encontrada ou não atualizada." }, { status: 404 });
  }
}
