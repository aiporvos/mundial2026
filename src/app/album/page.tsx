import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/navbar";
import { RARITY_LABEL, RARITY_COLOR, RARITY_TEXT } from "@/lib/utils";
import { redirect } from "next/navigation";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AlbumPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [albumItems, allFiguritas] = await Promise.all([
    prisma.albumItem.findMany({
      where: { userId: session.userId },
      include: { figurita: true },
    }),
    prisma.figurita.findMany({ orderBy: { number: "asc" } }),
  ]);

  const owned = new Map(albumItems.map((a) => [a.figuritaId, a]));
  const ownedCount = albumItems.length;
  const pct = allFiguritas.length > 0
    ? Math.round((ownedCount / allFiguritas.length) * 100)
    : 0;

  return (
    <div className="min-h-screen" style={{ background: "#050d2e" }}>
      <Navbar role={session.role} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <BookOpen size={20} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Mi álbum</h1>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-zinc-500">
              {ownedCount} de {allFiguritas.length} figuritas
            </span>
            <span className="font-bold" style={{ color: "#2563eb" }}>
              {pct}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #2563eb, #60a5fa)",
              }}
            />
          </div>
        </div>

        {allFiguritas.length === 0 ? (
          <p className="text-zinc-600 text-center py-16">Sin figuritas en el catálogo aún.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2">
            {allFiguritas.map((f) => {
              const item = owned.get(f.id);
              const hasIt = !!item;

              return (
                <div
                  key={f.id}
                  title={`#${f.number} ${f.name} — ${f.team}`}
                  className="aspect-[2/3] rounded-lg flex flex-col items-center justify-center p-1 relative transition-transform hover:scale-105"
                  style={{
                    background: hasIt
                      ? RARITY_COLOR[f.rarity] ?? "rgba(37,99,235,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${hasIt ? (RARITY_TEXT[f.rarity] ?? "#2563eb") + "33" : "rgba(255,255,255,0.06)"}`,
                    opacity: hasIt ? 1 : 0.4,
                    filter: hasIt ? "none" : "grayscale(1)",
                  }}
                >
                  <span
                    className="text-lg font-black leading-none"
                    style={{ color: hasIt ? (RARITY_TEXT[f.rarity] ?? "#2563eb") : "#52525b" }}
                  >
                    {f.number}
                  </span>
                  <span className="text-[9px] text-center leading-tight mt-1 line-clamp-2 text-zinc-500 px-0.5">
                    {f.name}
                  </span>
                  {item && item.quantity > 1 && (
                    <span
                      className="absolute top-0.5 right-0.5 text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ background: "#2563eb", color: "#050d2e" }}
                    >
                      {item.quantity}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {ownedCount === 0 && allFiguritas.length > 0 && (
          <p className="text-center text-zinc-600 text-sm mt-6">
            Todavía no tenés figuritas. ¡<a href="/" className="text-blue-400 hover:text-blue-400">Comprá las primeras</a>!
          </p>
        )}
      </main>
    </div>
  );
}
