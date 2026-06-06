import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/navbar";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";
import { deleteListing, toggleListing } from "@/app/actions/listings";
import Link from "next/link";
import { Plus, Zap, Coins, Eye, EyeOff, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VenderPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [balance, listings] = await Promise.all([
    prisma.creditBalance.upsert({
      where: { userId: session.userId },
      create: { userId: session.userId, credits: 5 },
      update: {},
    }),
    prisma.userListing.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isUnlimited = balance.isUnlimited && (!balance.unlimitedUntil || balance.unlimitedUntil > new Date());
  const hasCredits = isUnlimited || balance.credits > 0;

  return (
    <div style={{ background: "#050d2e", minHeight: "100vh" }}>
      <Navbar role={session.role} />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 6rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", color: "#fff", margin: 0, lineHeight: 0.9 }}>
              MIS FIGUS
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body), sans-serif", fontSize: "0.85rem", margin: "0.5rem 0 0" }}>
              Publicaciones en el mercado
            </p>
          </div>
          {hasCredits && (
            <Link
              href="/vender/nueva"
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.75rem 1.5rem", borderRadius: 10, background: "#2563eb",
                color: "#fff", textDecoration: "none", fontWeight: 700,
                fontSize: "0.875rem", fontFamily: "var(--font-body), sans-serif",
              }}
            >
              <Plus size={16} />
              Nueva publicación
            </Link>
          )}
        </div>

        {/* Credits card */}
        <div
          style={{
            borderRadius: 14, padding: "1.5rem", marginBottom: "2rem",
            background: isUnlimited
              ? "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(29,78,216,0.1))"
              : hasCredits
                ? "rgba(255,255,255,0.04)"
                : "rgba(239,68,68,0.08)",
            border: isUnlimited
              ? "1px solid rgba(59,130,246,0.4)"
              : hasCredits
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(239,68,68,0.3)",
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: isUnlimited ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isUnlimited ? <Zap size={20} style={{ color: "#60a5fa" }} /> : <Coins size={20} style={{ color: "#94a3b8" }} />}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.6rem", color: "#fff", margin: 0, lineHeight: 1 }}>
                {isUnlimited ? "∞" : balance.credits}
              </p>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: "var(--font-body), sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {isUnlimited
                  ? `Plan ilimitado · vence ${balance.unlimitedUntil?.toLocaleDateString("es-AR")}`
                  : balance.credits === 1 ? "crédito disponible" : "créditos disponibles"}
              </p>
            </div>
          </div>
          <Link
            href="/vender/creditos"
            style={{
              padding: "0.55rem 1.25rem", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700,
              textDecoration: "none", fontFamily: "var(--font-body), sans-serif",
              background: hasCredits ? "rgba(255,255,255,0.07)" : "#2563eb",
              color: hasCredits ? "rgba(255,255,255,0.6)" : "#fff",
              border: hasCredits ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}
          >
            {hasCredits ? "Comprar más" : "Comprar créditos"}
          </Link>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "2rem", color: "rgba(255,255,255,0.1)", letterSpacing: "0.05em" }}>
              SIN PUBLICACIONES
            </p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-body), sans-serif", marginTop: "0.5rem", fontSize: "0.875rem" }}>
              Tenés {isUnlimited ? "publicaciones ilimitadas" : `${balance.credits} crédito${balance.credits !== 1 ? "s" : ""}`} para usar.
            </p>
            {hasCredits && (
              <Link
                href="/vender/nueva"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                  marginTop: "1.5rem", padding: "0.7rem 1.5rem", borderRadius: 10, background: "#2563eb",
                  color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem",
                  fontFamily: "var(--font-body), sans-serif",
                }}
              >
                <Plus size={15} /> Publicar mi primera figurita
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {listings.map((l) => (
              <div
                key={l.id}
                style={{
                  borderRadius: 12, padding: "1rem 1.25rem",
                  background: l.active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${l.active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
                  display: "flex", alignItems: "center", gap: "1rem",
                  opacity: l.active ? 1 : 0.55,
                }}
              >
                {/* Image */}
                <div style={{ width: 48, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#0a1848" }}>
                  {l.imageUrl
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={l.imageUrl} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "var(--font-display), sans-serif", fontSize: "0.8rem", color: "#475569" }}>#{l.number}</div>
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.6rem", color: "#475569", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l.team} · #{l.number}</p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f1f5f9", margin: "2px 0 0", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#2563eb", margin: "2px 0 0", fontFamily: "var(--font-display), sans-serif" }}>{formatPrice(l.askingPrice)}</p>
                </div>

                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                  <form action={async () => { "use server"; await toggleListing(l.id); }}>
                    <button type="submit" title={l.active ? "Pausar" : "Activar"} style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                      {l.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </form>
                  <form action={async () => { "use server"; await deleteListing(l.id); }}>
                    <button type="submit" title="Eliminar" style={{ width: 32, height: 32, borderRadius: 7, border: "1px solid rgba(239,68,68,0.15)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
