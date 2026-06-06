"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { requestCreditPurchase } from "@/app/actions/credits";
import { CREDIT_PACKS } from "@/lib/credit-packs";
import type { PackKey } from "@/lib/credit-packs";
import { ArrowLeft, Check, Zap, Copy } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CreditosPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PackKey | null>(null);
  const [pending, setPending] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState<{ amount: number; purchaseId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleBuy(packKey: PackKey) {
    setPending(true);
    const result = await requestCreditPurchase(packKey);
    setPending(false);
    if (result?.success) {
      setPurchaseInfo({ amount: result.amount, purchaseId: result.purchaseId });
    }
  }

  function copyAlias() {
    navigator.clipboard.writeText("figus4198");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (purchaseInfo) {
    return (
      <div style={{ background: "#050d2e", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ maxWidth: 520, margin: "0 auto", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", borderRadius: 16, padding: "2.5rem 2rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <Zap size={24} style={{ color: "#60a5fa" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "2rem", color: "#fff", margin: "0 0 0.5rem" }}>¡CASI LISTO!</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body), sans-serif", fontSize: "0.875rem", margin: "0 0 2rem" }}>
              Transferí el monto al alias de MercadoPago y en menos de 24hs activamos tus créditos.
            </p>

            <div style={{ borderRadius: 12, padding: "1.5rem", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(59,130,246,0.2)", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", margin: "0 0 0.5rem", fontFamily: "var(--font-body), sans-serif" }}>Monto a transferir</p>
              <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "2.5rem", color: "#60a5fa", margin: "0 0 1.25rem" }}>{formatPrice(purchaseInfo.amount)}</p>

              <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", margin: "0 0 0.4rem", fontFamily: "var(--font-body), sans-serif" }}>Alias MercadoPago</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.75rem", color: "#fff", letterSpacing: "0.05em" }}>figus4198</span>
                <button
                  onClick={copyAlias}
                  style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.35rem 0.7rem", borderRadius: 7, background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: copied ? "#4ade80" : "#94a3b8", fontSize: "0.72rem", cursor: "pointer", fontFamily: "var(--font-body), sans-serif" }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>

            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-body), sans-serif", margin: "0 0 1.5rem" }}>
              ID de compra: {purchaseInfo.purchaseId.slice(-8).toUpperCase()}
            </p>

            <button
              onClick={() => router.push("/vender")}
              style={{ width: "100%", padding: "0.85rem", borderRadius: 10, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", fontFamily: "var(--font-body), sans-serif" }}
            >
              Volver a mis publicaciones
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: "#050d2e", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 2rem 6rem" }}>
        <Link href="/vender" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem", marginBottom: "2rem", fontFamily: "var(--font-body), sans-serif" }}>
          <ArrowLeft size={13} /> Mis publicaciones
        </Link>

        <h1 style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2.5rem, 8vw, 5rem)", color: "#fff", margin: "0 0 0.5rem", lineHeight: 0.9 }}>
          PLANES
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body), sans-serif", fontSize: "0.875rem", margin: "0 0 3rem" }}>
          Primeras 5 publicaciones gratis. Después elegí el plan que más te convenga.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {CREDIT_PACKS.map((pack) => {
            const isSelected = selected === pack.key;
            const isUnlimited = pack.key === "UNLIMITED";

            return (
              <div
                key={pack.key}
                onClick={() => setSelected(pack.key)}
                style={{
                  borderRadius: 14, padding: "1.75rem",
                  background: isSelected ? "rgba(37,99,235,0.15)" : pack.popular ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${isSelected ? "rgba(59,130,246,0.6)" : pack.popular ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.07)"}`,
                  cursor: "pointer", transition: "all 0.15s", position: "relative",
                }}
              >
                {pack.popular && (
                  <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", padding: "0.25rem 0.85rem", borderRadius: 20, background: "#2563eb", color: "#fff", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", fontFamily: "var(--font-body), sans-serif" }}>
                    Más popular
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.4rem", color: "#fff", margin: 0, lineHeight: 1 }}>{pack.label}</p>
                    <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "2.5rem", color: "#60a5fa", margin: "0.25rem 0 0", lineHeight: 1 }}>
                      {isUnlimited ? "∞" : pack.credits}
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-body), sans-serif" }}>
                      {isUnlimited ? "publicaciones / mes" : "figuritas"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.5rem", color: "#fff", margin: 0 }}>{formatPrice(pack.amount)}</p>
                    {!isUnlimited && (
                      <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", margin: 0, fontFamily: "var(--font-body), sans-serif" }}>
                        ${pack.perUnit}/u
                      </p>
                    )}
                    {isUnlimited && (
                      <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", margin: 0, fontFamily: "var(--font-body), sans-serif" }}>
                        por mes
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: 8, background: isSelected ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${isSelected ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${isSelected ? "#60a5fa" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#60a5fa" }} />}
                  </div>
                  <span style={{ fontSize: "0.72rem", color: isSelected ? "#93c5fd" : "rgba(255,255,255,0.3)", fontFamily: "var(--font-body), sans-serif" }}>
                    Seleccionar este plan
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selected && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button
              onClick={() => handleBuy(selected)}
              disabled={pending}
              style={{
                padding: "1rem 3rem", borderRadius: 12, background: "#2563eb",
                color: "#fff", fontSize: "1rem", fontWeight: 700, border: "none",
                cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.6 : 1,
                fontFamily: "var(--font-body), sans-serif", letterSpacing: "0.05em",
              }}
            >
              {pending ? "Procesando…" : `Comprar ${CREDIT_PACKS.find((p) => p.key === selected)?.label}`}
            </button>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", marginTop: "0.75rem", fontFamily: "var(--font-body), sans-serif" }}>
              Pagarás por MercadoPago · Activación en menos de 24hs
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
