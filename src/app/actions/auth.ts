"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { sendVerificationEmail } from "@/lib/email";
import { RegisterSchema, LoginSchema, type FormState } from "@/lib/definitions";
import { randomBytes } from "crypto";

function generateToken() {
  return randomBytes(32).toString("hex");
}

export async function register(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get("name") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: (formData.get("phone") as string) || undefined,
    dni: (formData.get("dni") as string) || undefined,
  };

  const validated = RegisterSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, lastName, email, password, phone, dni } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: ["Ya existe una cuenta con ese email"] } };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, lastName, email, password: hashedPassword, phone, dni, emailVerified: true },
  });

  await prisma.creditBalance.create({ data: { userId: user.id, credits: 5 } });

  await createSession(user.id, user.role);
  redirect("/");
}

export async function login(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = LoginSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { errors: { email: ["Email o contraseña incorrectos"] } };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return { errors: { email: ["Email o contraseña incorrectos"] } };
  }

  if (!user.emailVerified) {
    return {
      errors: {
        email: [
          "Verificá tu email antes de iniciar sesión. Revisá tu bandeja de entrada.",
        ],
      },
    };
  }

  await createSession(user.id, user.role);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function verifyEmail(token: string): Promise<FormState> {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.type !== "EMAIL_VERIFICATION") {
    return { message: "Token inválido" };
  }

  if (record.expiresAt < new Date()) {
    return { message: "El enlace expiró. Pedí uno nuevo." };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: true },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  await createSession(record.user.id, record.user.role);
  redirect("/");
}
