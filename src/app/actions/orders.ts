"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { FormState } from "@/lib/definitions";
import { randomBytes } from "crypto";

const GuestSchema = z.object({
  guestName: z.string().min(2, "Nombre requerido").trim(),
  guestLastName: z.string().min(2, "Apellido requerido").trim(),
  guestEmail: z.string().email("Email inválido").toLowerCase(),
  guestDni: z.string().optional(),
  guestPhone: z.string().optional(),
});

type CartItemInput = {
  id: string;
  quantity: number;
  price: number;
};

function generatePickupCode() {
  return randomBytes(3).toString("hex").toUpperCase();
}

export async function createOrder(
  cartItems: CartItemInput[],
  state: FormState,
  formData: FormData
): Promise<FormState> {
  if (cartItems.length === 0) {
    return { message: "El carrito está vacío" };
  }

  const session = await getSession();

  // Verify stock and get current prices
  const figuritaIds = cartItems.map((i) => i.id);
  const figuritas = await prisma.figurita.findMany({
    where: { id: { in: figuritaIds } },
  });

  for (const item of cartItems) {
    const fig = figuritas.find((f) => f.id === item.id);
    if (!fig) return { message: `Figurita no encontrada` };
    if (fig.stock < item.quantity) {
      return { message: `Stock insuficiente para la figurita #${fig.number} — ${fig.name}` };
    }
  }

  const total = cartItems.reduce((sum, item) => {
    const fig = figuritas.find((f) => f.id === item.id)!;
    return sum + fig.price * item.quantity;
  }, 0);

  // Guest data (required if not logged in)
  let guestData: z.infer<typeof GuestSchema> | null = null;
  if (!session) {
    const raw = Object.fromEntries(formData);
    const validated = GuestSchema.safeParse(raw);
    if (!validated.success) {
      return { errors: validated.error.flatten().fieldErrors };
    }
    guestData = validated.data;
  }

  const pickupCode = generatePickupCode();
  const reservedUntil = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session?.userId ?? null,
        ...(guestData ?? {}),
        total,
        pickupCode,
        reservedUntil,
        items: {
          create: cartItems.map((item) => {
            const fig = figuritas.find((f) => f.id === item.id)!;
            return {
              figuritaId: item.id,
              quantity: item.quantity,
              price: fig.price,
            };
          }),
        },
      },
    });

    // Decrement stock
    for (const item of cartItems) {
      await tx.figurita.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  revalidatePath("/");
  redirect(`/checkout/confirmacion?code=${order.pickupCode}`);
}

export async function updateOrderStatus(id: string, status: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  const data: Record<string, unknown> = { status };
  if (status === "PAID") data.paidAt = new Date();
  if (status === "COLLECTED") data.collectedAt = new Date();

  await prisma.order.update({ where: { id }, data });
  revalidatePath("/admin/pedidos");
}
