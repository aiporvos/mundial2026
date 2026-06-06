"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const CREDIT_PACKS = [
  { key: "STARTER",   label: "Starter",   credits: 10,  amount: 1000,  perUnit: 100, popular: false },
  { key: "BASIC",     label: "Basic",     credits: 20,  amount: 1500,  perUnit: 75,  popular: false },
  { key: "STANDARD",  label: "Standard",  credits: 30,  amount: 2500,  perUnit: 83,  popular: false },
  { key: "PRO",       label: "Pro",       credits: 50,  amount: 5500,  perUnit: 110, popular: true  },
  { key: "MAX",       label: "Max",       credits: 100, amount: 10000, perUnit: 100, popular: false },
  { key: "UNLIMITED", label: "Ilimitado", credits: -1,  amount: 18000, perUnit: 0,   popular: false },
] as const;

export type PackKey = typeof CREDIT_PACKS[number]["key"];

export async function requestCreditPurchase(packKey: PackKey) {
  const session = await getSession();
  if (!session) redirect("/login");

  const pack = CREDIT_PACKS.find((p) => p.key === packKey);
  if (!pack) return { error: "Plan inválido" };

  const purchase = await prisma.creditPurchase.create({
    data: {
      userId: session.userId,
      packKey,
      credits: pack.credits,
      amount: pack.amount,
      status: "PENDING",
    },
  });

  revalidatePath("/vender/creditos");
  return { success: true, purchaseId: purchase.id, amount: pack.amount };
}

export async function approveCreditPurchase(purchaseId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return;

  const purchase = await prisma.creditPurchase.findUnique({ where: { id: purchaseId } });
  if (!purchase || purchase.status !== "PENDING") return;

  await prisma.creditPurchase.update({ where: { id: purchaseId }, data: { status: "PAID" } });

  if (purchase.packKey === "UNLIMITED") {
    const unlimitedUntil = new Date();
    unlimitedUntil.setDate(unlimitedUntil.getDate() + 30);
    await prisma.creditBalance.upsert({
      where: { userId: purchase.userId },
      create: { userId: purchase.userId, credits: 5, isUnlimited: true, unlimitedUntil },
      update: { isUnlimited: true, unlimitedUntil },
    });
  } else {
    await prisma.creditBalance.upsert({
      where: { userId: purchase.userId },
      create: { userId: purchase.userId, credits: purchase.credits },
      update: { credits: { increment: purchase.credits } },
    });
  }

  revalidatePath("/admin/creditos");
  revalidatePath("/vender/creditos");
}
