import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { approveCreditPurchase } from "@/app/actions/credits";
import { Check, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const PACK_LABEL: Record<string, string> = {
  STARTER: "Starter · 10 figus",
  BASIC: "Basic · 20 figus",
  STANDARD: "Standard · 30 figus",
  PRO: "Pro · 50 figus",
  MAX: "Max · 100 figus",
  UNLIMITED: "Ilimitado / mes",
};

export default async function AdminCreditosPage() {
  const purchases = await prisma.creditPurchase.findMany({
    include: { user: { select: { name: true, lastName: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const pending = purchases.filter((p) => p.status === "PENDING");
  const paid    = purchases.filter((p) => p.status === "PAID");

  return (
    <div>
      <h1
        style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "2.5rem", color: "#0a1230", margin: "0 0 2rem", letterSpacing: "-0.01em" }}
      >
        CRÉDITOS
      </h1>

      {pending.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#64748b", margin: "0 0 1rem", fontFamily: "var(--font-body), sans-serif" }}>
            Pendientes de aprobación ({pending.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {pending.map((p) => (
              <div key={p.id} style={{ borderRadius: 12, padding: "1rem 1.25rem", background: "#fff", border: "1.5px solid #fbbf24", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <Clock size={16} style={{ color: "#f59e0b", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ fontWeight: 700, color: "#0a1230", margin: 0, fontSize: "0.9rem" }}>{p.user.name} {p.user.lastName}</p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "2px 0 0" }}>{p.user.email}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.2rem", color: "#1d4ed8", margin: 0 }}>{formatPrice(p.amount)}</p>
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", margin: 0 }}>{PACK_LABEL[p.packKey] ?? p.packKey}</p>
                </div>
                <p style={{ fontSize: "0.65rem", color: "#94a3b8", margin: 0 }}>
                  {new Date(p.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
                <form action={async () => { "use server"; await approveCreditPurchase(p.id); }}>
                  <button
                    type="submit"
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: "0.8rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "var(--font-body), sans-serif" }}
                  >
                    <Check size={14} /> Aprobar
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {pending.length === 0 && (
        <div style={{ borderRadius: 12, padding: "2rem", background: "#fff", border: "1px solid #e2e8f0", textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ color: "#94a3b8", fontFamily: "var(--font-body), sans-serif" }}>No hay compras pendientes.</p>
        </div>
      )}

      {paid.length > 0 && (
        <section>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#64748b", margin: "0 0 1rem", fontFamily: "var(--font-body), sans-serif" }}>
            Historial aprobados ({paid.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {paid.map((p) => (
              <div key={p.id} style={{ borderRadius: 10, padding: "0.85rem 1.25rem", background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <Check size={14} style={{ color: "#22c55e", flexShrink: 0 }} />
                <p style={{ flex: 1, margin: 0, fontSize: "0.85rem", color: "#374151", fontWeight: 600 }}>{p.user.name} {p.user.lastName}</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>{PACK_LABEL[p.packKey] ?? p.packKey}</p>
                <p style={{ margin: 0, fontFamily: "var(--font-display), sans-serif", fontSize: "1rem", color: "#2563eb" }}>{formatPrice(p.amount)}</p>
                <p style={{ margin: 0, fontSize: "0.65rem", color: "#cbd5e1" }}>
                  {new Date(p.createdAt).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
