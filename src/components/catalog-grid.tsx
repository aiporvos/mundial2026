"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/context/cart";
import { formatPrice, RARITY_LABEL } from "@/lib/utils";
import { ShoppingCart, Check, ImageOff, Search, X } from "lucide-react";
import type { Figurita } from "@prisma/client";

/* ── Rarity config ─────────────────────────────────────────────────── */
const RARITY_COLOR: Record<string, string> = {
  COMUN:      "#94a3b8",
  POCO_COMUN: "#22c55e",
  RARA:       "#3b82f6",
  EPICA:      "#a855f7",
  LEGENDARIA: "#f59e0b",
};

const RARITY_ORDER = ["COMUN", "POCO_COMUN", "RARA", "EPICA", "LEGENDARIA"];

const SORT_OPTIONS = [
  { value: "number",     label: "Número" },
  { value: "name",       label: "Nombre" },
  { value: "price_asc",  label: "Precio ↑" },
  { value: "price_desc", label: "Precio ↓" },
  { value: "rarity",     label: "Rareza" },
];

export function CatalogGrid({ figuritas }: { figuritas: Figurita[] }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  const [search, setSearch]           = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("ALL");
  const [teamFilter, setTeamFilter]   = useState<string>("ALL");
  const [sortBy, setSortBy]           = useState("number");

  const teams = useMemo(
    () => Array.from(new Set(figuritas.map((f) => f.team))).sort(),
    [figuritas],
  );

  const rarities = useMemo(
    () => RARITY_ORDER.filter((r) => figuritas.some((f) => f.rarity === r)),
    [figuritas],
  );

  const filtered = useMemo(() => {
    let result = figuritas;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.team.toLowerCase().includes(q) ||
          String(f.number).includes(q),
      );
    }
    if (rarityFilter !== "ALL") result = result.filter((f) => f.rarity === rarityFilter);
    if (teamFilter  !== "ALL") result = result.filter((f) => f.team  === teamFilter);
    return [...result].sort((a, b) => {
      if (sortBy === "name")       return a.name.localeCompare(b.name);
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rarity")     return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
      return a.number - b.number;
    });
  }, [figuritas, search, rarityFilter, teamFilter, sortBy]);

  const activeFilters =
    (rarityFilter !== "ALL" ? 1 : 0) +
    (teamFilter   !== "ALL" ? 1 : 0) +
    (search ? 1 : 0);

  function clearAll() {
    setSearch("");
    setRarityFilter("ALL");
    setTeamFilter("ALL");
  }

  function handleAdd(f: Figurita) {
    add({ id: f.id, number: f.number, name: f.name, team: f.team, rarity: f.rarity, price: f.price, imageUrl: f.imageUrl });
    setAdded(f.id);
    setTimeout(() => setAdded(null), 1200);
  }

  const inCart = (id: string) => items.some((i) => i.id === id);

  return (
    <div>
      {/* ── Section header ── */}
      <div
        style={{
          paddingTop: "3.5rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid #d8e4f8",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display), 'Arial Black', sans-serif",
            fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            color: "#0a1230",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            margin: 0,
          }}
        >
          CATÁLOGO
        </h2>
        <span
          style={{
            fontSize: "0.75rem",
            color: "#94a3b8",
            fontFamily: "var(--font-body), sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {filtered.length < figuritas.length
            ? `${filtered.length} / ${figuritas.length}`
            : `${figuritas.length} figuritas`}
        </span>
      </div>

      {/* ── Search bar ── */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Buscar jugador, selección o número…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem 1rem 0.8rem 2.5rem",
            borderRadius: 10,
            border: "1.5px solid #d8e4f8",
            background: "#fff",
            fontSize: "0.875rem",
            color: "#0a1230",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
            fontFamily: "var(--font-body), sans-serif",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "#d8e4f8")}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              position: "absolute",
              right: "0.9rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: 2,
              display: "flex",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Inline filters row ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        {/* Rarity pills */}
        <FilterPill
          label="Todas"
          active={rarityFilter === "ALL"}
          color="#0a1230"
          onClick={() => setRarityFilter("ALL")}
        />
        {rarities.map((r) => (
          <FilterPill
            key={r}
            label={RARITY_LABEL[r] ?? r}
            active={rarityFilter === r}
            color={RARITY_COLOR[r] ?? "#94a3b8"}
            onClick={() => setRarityFilter(rarityFilter === r ? "ALL" : r)}
          />
        ))}

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "#d8e4f8", margin: "0 0.25rem" }} />

        {/* Team select */}
        <select
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
          style={{
            padding: "0.4rem 0.85rem",
            borderRadius: 20,
            border: `1.5px solid ${teamFilter !== "ALL" ? "#0a1230" : "#d8e4f8"}`,
            background: teamFilter !== "ALL" ? "#0a1230" : "#fff",
            color: teamFilter !== "ALL" ? "#fff" : "#374151",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            outline: "none",
            fontFamily: "var(--font-body), sans-serif",
          }}
        >
          <option value="ALL">Todas las selecciones</option>
          {teams.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "0.4rem 0.85rem",
            borderRadius: 20,
            border: "1.5px solid #d8e4f8",
            background: "#fff",
            color: "#374151",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            outline: "none",
            fontFamily: "var(--font-body), sans-serif",
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear */}
        {activeFilters > 0 && (
          <button
            onClick={clearAll}
            style={{
              fontSize: "0.72rem",
              color: "#ef4444",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.4rem 0.5rem",
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <p
            style={{
              fontFamily: "var(--font-display), sans-serif",
              fontSize: "3rem",
              color: "#d8e4f8",
              letterSpacing: "0.05em",
              margin: "0 0 0.5rem",
            }}
          >
            SIN RESULTADOS
          </p>
          <p style={{ color: "#94a3b8", fontFamily: "var(--font-body), sans-serif" }}>
            Intentá con otro nombre, número o selección.
          </p>
          <button
            onClick={clearAll}
            style={{
              marginTop: "1rem",
              fontSize: "0.8rem",
              color: "#f59e0b",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
            gap: "1.1rem",
          }}
        >
          {filtered.map((f) => {
            const isAdded    = added === f.id;
            const inCartNow  = inCart(f.id);
            const outOfStock = f.stock === 0;
            const rarityColor = RARITY_COLOR[f.rarity] ?? "#94a3b8";

            return (
              <div
                key={f.id}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  borderTop: `3px solid ${rarityColor}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px) rotate(0.4deg)";
                  e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,0.13)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) rotate(0deg)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                }}
              >
                {/* Image */}
                <div
                  style={{
                    aspectRatio: "3/4",
                    background: "#eef3fc",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {f.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.imageUrl}
                      alt={f.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        gap: 6,
                        color: "#cbd5e1",
                      }}
                    >
                      <ImageOff size={22} />
                      <span
                        style={{
                          fontFamily: "var(--font-display), sans-serif",
                          fontSize: "1.4rem",
                          color: "#e2e8f0",
                          letterSpacing: "0.05em",
                        }}
                      >
                        #{f.number}
                      </span>
                    </div>
                  )}

                  {/* Number overlay */}
                  {f.imageUrl && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 6,
                        left: 6,
                        background: "rgba(8,8,16,0.6)",
                        backdropFilter: "blur(3px)",
                        borderRadius: 5,
                        padding: "2px 6px",
                        fontFamily: "var(--font-display), sans-serif",
                        fontSize: "0.82rem",
                        color: "#fff",
                        letterSpacing: "0.05em",
                        lineHeight: 1.2,
                      }}
                    >
                      #{f.number}
                    </div>
                  )}

                  {/* Out of stock */}
                  {outOfStock && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(8,8,16,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display), sans-serif",
                          fontSize: "1.1rem",
                          letterSpacing: "0.12em",
                          color: "#fff",
                        }}
                      >
                        AGOTADO
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div
                  style={{
                    padding: "0.55rem 0.7rem 0.65rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.58rem",
                      color: "#94a3b8",
                      margin: 0,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-body), sans-serif",
                    }}
                  >
                    {f.team}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#0a1230",
                      margin: 0,
                      lineHeight: 1.2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontFamily: "var(--font-body), sans-serif",
                    }}
                  >
                    {f.name}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      paddingTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display), 'Arial Black', sans-serif",
                        fontSize: "1.1rem",
                        color: "#d97706",
                        letterSpacing: "0.02em",
                        lineHeight: 1,
                      }}
                    >
                      {formatPrice(f.price)}
                    </span>

                    <button
                      onClick={() => handleAdd(f)}
                      disabled={outOfStock}
                      title={outOfStock ? "Sin stock" : "Agregar al carrito"}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: outOfStock ? "not-allowed" : "pointer",
                        opacity: outOfStock ? 0.3 : 1,
                        background: isAdded
                          ? "#dcfce7"
                          : inCartNow
                            ? "rgba(245,158,11,0.15)"
                            : "rgba(0,0,0,0.05)",
                        color: isAdded ? "#16a34a" : "#d97706",
                        transition: "all 0.15s",
                        flexShrink: 0,
                      }}
                    >
                      {isAdded ? <Check size={13} /> : <ShoppingCart size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label, active, color, onClick,
}: {
  label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.38rem 0.9rem",
        borderRadius: 20,
        fontSize: "0.73rem",
        fontWeight: 700,
        letterSpacing: "0.01em",
        border: `1.5px solid ${active ? color : "#d8e4f8"}`,
        background: active ? color : "#fff",
        color: active ? (color === "#0a1230" ? "#fff" : color === "#f59e0b" ? "#080810" : "#fff") : "#6b7280",
        cursor: "pointer",
        transition: "all 0.13s",
        outline: "none",
        fontFamily: "var(--font-body), sans-serif",
      }}
    >
      {label}
    </button>
  );
}
