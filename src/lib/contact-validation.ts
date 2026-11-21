import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indique o seu nome.").max(120),
  email: z.string().trim().email("Indique um endereço de email válido.").max(254),
  subject: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().min(10, "A mensagem deve ter pelo menos 10 caracteres.").max(5000),
  website: z.string().max(200).optional().default(""),
  formStartedAt: z.number().int().positive(),
});

export type ContactInput = z.infer<typeof contactSchema>;
