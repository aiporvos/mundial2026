import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/navbar";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { MessageCircle, Tag, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MercadoPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; team?: string }>;
}) {
  const { q, team } = await searchParams;
  const [session, listings, teams] = await Promise.all([
    getSession(),
    prisma.userListing.findMany({
      where: {
        active: true,
        ...(q ? {
          OR: [
            { name: { contains: q } },
            { team: { contains: q } },
          ],
        } : {}),
        ...(team && team !== "ALL" ? { team } : {}),
      },
      include: { user: { select: { name: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userListing.findMany({
      where: { active: true },
      select: { team: true },
      distinct: ["team"],
      orderBy: { team: "asc" },
    }),
  ]);

  const teamList = teams.map((t) => t.team);

  return (
    <div style={{ background: "#f0f5ff", minHeight: "100vh" }}>
      <Navbar role={session?.role} />

      {/* Header */}
      <section
        style={{
          background: "radial-gradient(ellipse at 70% 35%, rgba(37,99,235,0.35) 0%, transparent 55%), linear-gradient(135deg, #050d2e 0%, #0a1848 100%)",
          padding: "4rem 2rem 3rem",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#93c5fd", fontFamily: "var(--font-body), sans-serif", fontWeight: 600, margin: "0 0 1rem" }}>
            Entre coleccionistas
          </p>
          <h1 style={{ fontFamily: "var(--font-display), 'Arial Black', sans-serif", fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 0.88, color: "#fff", margin: "0 0 1.5rem", letterSpacing: "-0.01em" }}>
            MERCADO
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body), sans-serif", fontSize: "0.9rem", margin: "0 0 2rem" }}>
            Figuritas publicadas por otros coleccionistas. Contactalos directo por WhatsApp.
          </p>

          {/* Search form */}
          <form method="GET" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={14} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input
                name="q"
                defaultValue={q}
                placeholder="Buscar jugador o selección…"
                style={{
                  width: "100%", padding: "0.7rem 1rem 0.7rem 2.4rem", borderRadius: 10,
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#fff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
                  fontFamily: "var(--font-body), sans-serif",
                }}
              />
            </div>
            <select
              name="team"
              defaultValue={team ?? "ALL"}
              style={{
                padding: "0.7rem 1rem", borderRadius: 10, background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "0.875rem",
                outline: "none", fontFamily: "var(--font-body), sans-serif",
              }}
            >
              <option value="ALL">Todas las selecciones</option>
              {teamList.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
              type="submit"
              style={{
                padding: "0.7rem 1.5rem", borderRadius: 10, background: "#2563eb",
                color: "#fff", fontSize: "0.875rem", fontWeight: 700, border: "none", cursor: "pointer",
                fontFamily: "var(--font-body), sans-serif",
              }}
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* Listings */}
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem 6rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-body), sans-serif", color: "#64748b", fontSize: "0.85rem" }}>
            {listings.length} {listings.length === 1 ? "publicación" : "publicaciones"}
          </p>
          <Link
            href="/vender"
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem",
              borderRadius: 8, background: "#2563eb", color: "#fff", textDecoration: "none",
              fontSize: "0.8rem", fontWeight: 700, fontFamily: "var(--font-body), sans-serif",
            }}
          >
            <Tag size={14} />
            Publicar mi figurita
          </Link>
        </div>

        {listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "2.5rem", color: "#cbd5e1", letterSpacing: "0.05em" }}>
              SIN PUBLICACIONES
            </p>
            <p style={{ color: "#94a3b8", fontFamily: "var(--font-body), sans-serif", marginTop: "0.5rem" }}>
              {q || team ? "Probá con otro filtro." : "Sé el primero en publicar una figurita."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1.25rem" }}>
            {listings.map((l) => (
              <div
                key={l.id}
                style={{
                  borderRadius: 14, overflow: "hidden", background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderTop: "3px solid #2563eb",
                  display: "flex", flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                }}
              >
                {/* Image */}
                <div style={{ aspectRatio: "3/4", background: "#eef3fc", position: "relative", overflow: "hidden" }}>
                  {l.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.imageUrl} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "var(--font-display), sans-serif", fontSize: "2.5rem", color: "#cbd5e1" }}>
                      #{l.number}
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(5,13,46,0.7)", backdropFilter: "blur(3px)", borderRadius: 5, padding: "2px 7px", fontFamily: "var(--font-display), sans-serif", fontSize: "0.82rem", color: "#fff" }}>
                    #{l.number}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "0.65rem 0.75rem 0.75rem", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ fontSize: "0.58rem", color: "#94a3b8", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-body), sans-serif" }}>
                    {l.team}
                  </p>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0a1230", margin: 0, lineHeight: 1.2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {l.name}
                  </p>
                  {l.description && (
                    <p style={{ fontSize: "0.7rem", color: "#64748b", margin: 0, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {l.description}
                    </p>
                  )}
                  <div style={{ marginTop: "auto", paddingTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.15rem", color: "#1d4ed8", lineHeight: 1 }}>
                      {formatPrice(l.askingPrice)}
                    </span>
                    <a
                      href={`https://wa.me/549${l.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola! Vi tu figurita #${l.number} ${l.name} en Figus`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: "0.3rem",
                        padding: "0.3rem 0.6rem", borderRadius: 7, background: "#22c55e",
                        color: "#fff", textDecoration: "none", fontSize: "0.7rem", fontWeight: 700,
                        fontFamily: "var(--font-body), sans-serif",
                      }}
                    >
                      <MessageCircle size={12} />
                      WA
                    </a>
                  </div>
                  <p style={{ fontSize: "0.6rem", color: "#cbd5e1", margin: 0, fontFamily: "var(--font-body), sans-serif" }}>
                    {l.user.name} {l.user.lastName[0]}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
