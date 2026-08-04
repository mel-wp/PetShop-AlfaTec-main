import { z } from "zod";

export const petSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe o nome do animal")
    .max(80, "O nome pode ter no máximo 80 caracteres"),

  especie: z
    .string()
    .trim()
    .min(1, "Selecione a espécie"),

  raca: z
    .string()
    .trim()
    .max(80, "A raça pode ter no máximo 80 caracteres")
    .optional(),

  sexo: z.enum(["Macho", "Fêmea"], {
    message: "Selecione o sexo",
  }),

  peso: z.coerce
    .number()
    .positive("O peso deve ser maior que zero")
    .max(300, "Verifique o peso informado"),

  tutorId: z
    .string()
    .uuid("Selecione um tutor válido"),
});

export type PetFormData = z.infer<typeof petSchema>;