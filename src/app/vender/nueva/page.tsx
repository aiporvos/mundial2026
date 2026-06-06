import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { NuevaListingForm } from "./form";

export const dynamic = "force-dynamic";

export default async function NuevaListingPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const balance = await prisma.creditBalance.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, credits: 5 },
    update: {},
  });

  const isUnlimited = balance.isUnlimited && (!balance.unlimitedUntil || balance.unlimitedUntil > new Date());
  if (!isUnlimited && balance.credits <= 0) redirect("/vender/creditos");

  const figuritas = await prisma.figurita.findMany({
    orderBy: { number: "asc" },
    select: { id: true, number: true, name: true, team: true, imageUrl: true },
  });

  return (
    <div style={{ background: "#050d2e", minHeight: "100vh" }}>
      <Navbar role={session.role} />
      <NuevaListingForm figuritas={figuritas} credits={isUnlimited ? -1 : balance.credits} />
    </div>
  );
}
