import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditFiguritaForm from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarFiguritaPage({ params }: Props) {
  const { id } = await params;
  const figurita = await prisma.figurita.findUnique({ where: { id } });
  if (!figurita) notFound();
  return <EditFiguritaForm figurita={figurita} />;
}
