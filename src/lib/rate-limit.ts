import { prisma } from "@/lib/prisma";

export async function consumeRateLimit(key: string, windowMs: number) {
  const now = new Date();
  const threshold = new Date(now.getTime() - windowMs);

  return prisma.$transaction(async (tx) => {
    await tx.rateLimitBucket.upsert({
      where: { key },
      create: { key, count: 0, windowStartedAt: now },
      update: {},
    });

    const current = await tx.rateLimitBucket.findUniqueOrThrow({ where: { key } });
    const updated = await tx.rateLimitBucket.update({
      where: { key },
      data: current.windowStartedAt <= threshold
        ? { count: 1, windowStartedAt: now }
        : { count: { increment: 1 } },
    });
    return updated.count;
  }, { isolationLevel: "Serializable" });
}
