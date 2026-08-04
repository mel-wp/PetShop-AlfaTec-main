import { z } from "zod";

export const appointmentSchema = z
  .object({
    clienteId: z.string().uuid("Selecione um cliente"),
    animalId: z.string().uuid("Selecione um animal"),
    servicoId: z.string().uuid("Selecione um serviço"),

    data: z
      .string()
      .min(1, "Informe a data"),

    horarioInicio: z
      .string()
      .min(1, "Informe o horário inicial"),

    horarioFim: z
      .string()
      .min(1, "Informe o horário final"),

    observacoes: z
      .string()
      .trim()
      .max(500, "Use no máximo 500 caracteres")
      .optional(),
  })
  .refine(
    (data) => data.horarioFim > data.horarioInicio,
    {
      message: "O horário final deve ser posterior ao inicial",
      path: ["horarioFim"],
    },
  )
  .refine(
    (data) => {
      const appointmentDate = new Date(
        `${data.data}T${data.horarioInicio}`,
      );

      return appointmentDate.getTime() > Date.now();
    },
    {
      message: "Não é possível agendar uma data passada",
      path: ["data"],
    },
  );

export type AppointmentFormData = z.infer<
  typeof appointmentSchema
>;