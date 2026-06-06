import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .trim(),
  email: z.string().email("Email inválido").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[a-zA-Z]/, "Debe contener al menos una letra")
    .regex(/[0-9]/, "Debe contener al menos un número"),
  phone: z.string().optional(),
  dni: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Email inválido").trim().toLowerCase(),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export type FormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
      success?: boolean;
    }
  | undefined;
