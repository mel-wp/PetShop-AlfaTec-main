import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("A URL do Supabase não é válida"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "A chave pública do Supabase não foi informada"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL,

  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});