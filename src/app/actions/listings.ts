"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getOrCreateBalance(userId: string) {
  return prisma.creditBalance.upsert({
    where: { userId },
    create: { userId, credits: 5 },
    update: {},
  });
}

export async function createListing(_: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const balance = await getOrCreateBalance(session.userId);

  const isUnlimitedExpired =
    balance.isUnlimited && balance.unlimitedUntil && balance.unlimitedUntil < new Date();

  if (isUnlimitedExpired) {
    await prisma.creditBalance.update({
      where: { userId: session.userId },
      data: { isUnlimited: false, unlimitedUntil: null },
    });
  }

  const hasCredits =
    (balance.isUnlimited && !isUnlimitedExpired) || balance.credits > 0;

  if (!hasCredits) {
    return { error: "Sin créditos. Comprá un plan para seguir publicando." };
  }

  const number = parseInt(formData.get("number") as string);
  const name = (formData.get("name") as string).trim();
  const team = (formData.get("team") as string).trim();
  const askingPrice = parseInt(formData.get("askingPrice") as string);
  const whatsapp = (formData.get("whatsapp") as string).trim();
  const description = (formData.get("description") as string)?.trim() || null;
  let imageUrl = (formData.get("imageUrl") as string) || null;

  if (!name || !team || !whatsapp || isNaN(number) || isNaN(askingPrice)) {
    return { error: "Completá todos los campos obligatorios." };
  }

  const files = formData.getAll("image") as File[];
  const file = files.find((f) => f && f.size > 100) ?? null;
  if (file) {
    const ext = file.type.includes("webp") ? "webp" : file.type.includes("png") ? "png" : "jpg";
    const filename = `user_${session.userId}_${Date.now()}.${ext}`;
    const { writeFile } = await import("fs/promises");
    const { join } = await import("path");
    await writeFile(
      join(process.cwd(), "public", "figuritas", filename),
      Buffer.from(await file.arrayBuffer()),
    );
    imageUrl = `/figuritas/${filename}`;
  }

  await prisma.userListing.create({
    data: { userId: session.userId, number, name, team, imageUrl, askingPrice, whatsapp, description },
  });

  if (!balance.isUnlimited) {
    await prisma.creditBalance.update({
      where: { userId: session.userId },
      data: { credits: balance.credits - 1 },
    });
  }

  revalidatePath("/vender");
  revalidatePath("/mercado");
  redirect("/vender");
}

export async function deleteListing(id: string) {
  const session = await getSession();
  if (!session) return;
  await prisma.userListing.deleteMany({ where: { id, userId: session.userId } });
  revalidatePath("/vender");
  revalidatePath("/mercado");
}

export async function toggleListing(id: string) {
  const session = await getSession();
  if (!session) return;
  const listing = await prisma.userListing.findFirst({ where: { id, userId: session.userId } });
  if (!listing) return;
  await prisma.userListing.update({ where: { id }, data: { active: !listing.active } });
  revalidatePath("/vender");
  revalidatePath("/mercado");
}
