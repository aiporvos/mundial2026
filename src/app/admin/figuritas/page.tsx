import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { deleteFigurita } from "@/app/actions/figuritas";
import Link from "next/link";
import { Plus, Pencil, Trash2, ImageOff, Search } from "lucide-react";

export const dynamic = "force-dynamic";

const RARITY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  COMUN:       { bg: "#f3f4f6", text: "#6b7280",  label: "Común" },
  POCO_COMUN:  { bg: "#d1fae5", text: "#065f46",  label: "Poco común" },
  RARA:        { bg: "#dbeafe", text: "#1e40af",  label: "Rara" },
  EPICA:       { bg: "#ede9fe", text: "#5b21b6",  label: "Épica" },
  LEGENDARIA:  { bg: "#dbeafe", text: "#92400e",  label: "Legendaria" },
};

export default async function AdminFiguritasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rarity?: string }>;
}) {
  const { q, rarity } = await searchParams;

  const figuritas = await prisma.figurita.findMany({
    where: {
      AND: [
        q ? { OR: [{ name: { contains: q } }, { team: { contains: q } }] } : {},
        rarity ? { rarity } : {},
      ],
    },
    orderBy: { number: "asc" },
  });

  const totalByRarity = await prisma.figurita.groupBy({
    by: ["rarity"],
    _count: { _all: true },
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: "#111827" }}>Figuritas</h1>
          <p className="text-sm text-gray-400 mt-0.5">{figuritas.length} en catálogo</p>
        </div>
        <Link
          href="/admin/figuritas/nueva"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-md"
          style={{ background: "linear-gradient(135deg, #60a5fa, #1d4ed8)", color: "#050d2e" }}
        >
          <Plus size={15} />
          Nueva figurita
        </Link>
      </div>

      {/* Rarity filter pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/figuritas"
          className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: !rarity ? "#111827" : "#f3f4f6",
            color: !rarity ? "#fff" : "#6b7280",
          }}
        >
          Todas ({figuritas.length + (rarity ? 0 : 0)})
        </Link>
        {totalByRarity.map((r) => {
          const s = RARITY_STYLE[r.rarity] ?? RARITY_STYLE.COMUN;
          return (
            <Link
              key={r.rarity}
              href={`/admin/figuritas?rarity=${r.rarity}${q ? `&q=${q}` : ""}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: rarity === r.rarity ? "#111827" : s.bg,
                color: rarity === r.rarity ? "#fff" : s.text,
              }}
            >
              {s.label} ({r._count._all})
            </Link>
          );
        })}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {figuritas.map((f) => {
          const rs = RARITY_STYLE[f.rarity] ?? RARITY_STYLE.COMUN;
          return (
            <div
              key={f.id}
              className="rounded-2xl overflow-hidden flex flex-col group transition-all hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {/* Image */}
              <div
                className="aspect-[3/4] relative overflow-hidden flex items-center justify-center"
                style={{ background: "#f8f9fa" }}
              >
                {f.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.imageUrl}
                    alt={f.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ImageOff size={28} />
                    <span className="text-lg font-black" style={{ color: "#e5e7eb" }}>#{f.number}</span>
                  </div>
                )}

                {/* Rarity badge */}
                <span
                  className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                  style={{ background: rs.bg, color: rs.text }}
                >
                  {rs.label}
                </span>

                {/* Out of stock overlay */}
                {f.stock === 0 && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                  >
                    <span className="text-[10px] font-black text-white uppercase tracking-wider bg-red-500 px-2 py-1 rounded">
                      Agotado
                    </span>
                  </div>
                )}

                {/* Actions overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <Link
                    href={`/admin/figuritas/${f.id}/editar`}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-gray-800 hover:bg-amber-400 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={13} />
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteFigurita(f.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[10px] text-gray-400 mb-0.5">#{f.number} · {f.team}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight line-clamp-2 mb-2">{f.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black" style={{ color: "#1d4ed8" }}>
                    {formatPrice(f.price)}
                  </span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: f.stock === 0 ? "#dc2626" : f.stock <= 3 ? "#1d4ed8" : "#16a34a" }}
                  >
                    {f.stock} uds
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {figuritas.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 text-sm mb-3">Sin figuritas</p>
            <Link
              href="/admin/figuritas/nueva"
              className="text-xs font-semibold px-4 py-2 rounded-xl"
              style={{ background: "#dbeafe", color: "#1d4ed8" }}
            >
              Crear la primera
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
