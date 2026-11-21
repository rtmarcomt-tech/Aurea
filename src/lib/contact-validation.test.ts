import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact-validation";

describe("contactSchema", () => {
  it("accepts a valid contact message", () => {
    const result = contactSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      subject: "Novo projeto",
      message: "Gostaria de conversar sobre um website.",
      website: "",
      formStartedAt: Date.now() - 5000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects malformed email and short message", () => {
    const result = contactSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "Olá",
      formStartedAt: Date.now() - 5000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects oversized input", () => {
    const result = contactSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      message: "x".repeat(5001),
      formStartedAt: Date.now() - 5000,
    });
    expect(result.success).toBe(false);
  });
});
