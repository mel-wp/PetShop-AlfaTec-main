import { z } from "zod";

export const clientSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe pelo menos 3 caracteres")
    .max(100, "O nome pode ter no máximo 100 caracteres"),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido")
    .or(z.literal("")),

  telefone: z
    .string()
    .trim()
    .min(10, "Informe um telefone válido")
    .max(15, "Informe um telefone válido"),

  cpf: z
    .string()
    .trim()
    .min(11, "Informe um CPF válido")
    .max(14, "Informe um CPF válido"),
});

export type ClientFormData = z.infer<typeof clientSchema>;