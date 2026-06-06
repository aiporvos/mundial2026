"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { FormState } from "@/lib/definitions";

const FiguritaSchema = z.object({
  number: z.coerce.number().int().min(1),
  name: z.string().min(1).trim(),
  team: z.string().min(1).trim(),
  rarity: z.enum(["COMUN", "POCO_COMUN", "RARA", "EPICA", "LEGENDARIA"]),
  price: z.coerce.number().int().min(0),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");
}

export async function createFigurita(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  // Handle file upload if present
  let uploadedImageUrl: string | null = null;
  const files = formData.getAll("image") as File[];
  const file = files.find((f) => f && f.size > 100) ?? null;
  if (file) {
    const ext = file.type.includes("webp") ? "webp" : file.type.includes("png") ? "png" : "jpg";
    const filename = `new_${Date.now()}.${ext}`;
    const { writeFile } = await import("fs/promises");
    const { join } = await import("path");
    const dest = join(process.cwd(), "public", "figuritas", filename);
    await writeFile(dest, Buffer.from(await file.arrayBuffer()));
    uploadedImageUrl = `/figuritas/${filename}`;
  }

  const raw = Object.fromEntries(formData);
  const validated = FiguritaSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { imageUrl, ...data } = validated.data;
  await prisma.figurita.create({
    data: { ...data, imageUrl: uploadedImageUrl ?? (imageUrl || null) },
  });

  revalidatePath("/");
  revalidatePath("/admin/figuritas");
  redirect("/admin/figuritas");
}

export async function updateFigurita(
  id: string,
  state: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  // Handle file upload if present (two inputs share name="image": camera + file picker)
  let uploadedImageUrl: string | null = null;
  const files = formData.getAll("image") as File[];
  const file = files.find((f) => f && f.size > 100) ?? null;
  if (file) {
    const ext = file.type.includes("webp")
      ? "webp"
      : file.type.includes("png")
        ? "png"
        : "jpg";
    const filename = `upload_${id}.${ext}`;
    const { writeFile } = await import("fs/promises");
    const { join } = await import("path");
    const dest = join(process.cwd(), "public", "figuritas", filename);
    await writeFile(dest, Buffer.from(await file.arrayBuffer()));
    uploadedImageUrl = `/figuritas/${filename}`;
  }

  const raw = Object.fromEntries(formData);
  const validated = FiguritaSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { imageUrl, ...data } = validated.data;
  const finalImageUrl = uploadedImageUrl ?? (imageUrl || null);

  await prisma.figurita.update({
    where: { id },
    data: { ...data, imageUrl: finalImageUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin/figuritas");
  redirect("/admin/figuritas");
}

export async function deleteFigurita(id: string) {
  await requireAdmin();
  await prisma.figurita.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/figuritas");
}
