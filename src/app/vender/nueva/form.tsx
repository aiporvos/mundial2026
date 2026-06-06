"use client";

import { useActionState, useRef, useState, useCallback } from "react";
import { createListing } from "@/app/actions/listings";
import Link from "next/link";
import { Camera, Upload, ImageIcon, X, Search, ArrowLeft, Coins } from "lucide-react";

type FiguitaOption = { id: string; number: number; name: string; team: string; imageUrl: string | null };

type Props = { figuritas: FiguitaOption[]; credits: number };

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: 10,
  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", fontSize: "0.875rem", outline: "none", boxSizing: "border-box",
  fontFamily: "var(--font-body), sans-serif", transition: "border-color 0.15s",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block", fontSize: "0.65rem", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.12em",
  color: "rgba(255,255,255,0.35)", marginBottom: "0.4rem",
  fontFamily: "var(--font-body), sans-serif",
};

export function NuevaListingForm({ figuritas, credits }: Props) {
  const [state, action, pending] = useActionState(createListing, undefined);

  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [showBank, setShowBank] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");

  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const figWithImages = figuritas.filter((f) => f.imageUrl);
  const bankFiltered = figWithImages.filter((f) => {
    const q = bankSearch.toLowerCase();
    return !q || f.name.toLowerCase().includes(q) || f.team.toLowerCase().includes(q) || String(f.number).includes(q);
  });

  const teams = Array.from(new Set(figuritas.map((f) => f.team))).sort();

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const num = parseInt(e.target.value);
    if (isNaN(num)) return;
    const match = figuritas.find((f) => f.number === num);
    if (match) {
      setName(match.name);
      setTeam(match.team);
      if (match.imageUrl && !preview) {
        setImageUrl(match.imageUrl);
        setPreview(match.imageUrl);
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, other: React.RefObject<HTMLInputElement | null>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (other.current) other.current.value = "";
    setImageUrl("");
    setPreview(URL.createObjectURL(file));
  }

  const selectFromBank = useCallback((fig: FiguitaOption) => {
    setImageUrl(fig.imageUrl ?? "");
    setPreview(fig.imageUrl ?? "");
    setName(fig.name);
    setTeam(fig.team);
    setShowBank(false);
  }, []);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem 6rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/vender" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.8rem", marginBottom: "1.25rem", fontFamily: "var(--font-body), sans-serif" }}>
          <ArrowLeft size={13} /> Mis publicaciones
        </Link>
        <h1 style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(2rem, 7vw, 3.5rem)", color: "#fff", margin: 0, lineHeight: 0.9 }}>
          PUBLICAR FIGURITA
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-body), sans-serif", fontSize: "0.8rem", margin: "0.5rem 0 0" }}>
          {credits === -1 ? "Plan ilimitado activo" : `${credits} crédito${credits !== 1 ? "s" : ""} disponible${credits !== 1 ? "s" : ""}`}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginLeft: "0.5rem" }}>
            <Coins size={11} />
          </span>
        </p>
      </div>

      {state?.error && (
        <div style={{ marginBottom: "1.5rem", padding: "0.9rem 1rem", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "0.875rem", fontFamily: "var(--font-body), sans-serif" }}>
          {state.error}
        </div>
      )}

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Image section */}
        <div>
          <p style={LABEL_STYLE}>Imagen de la figurita</p>
          <input type="hidden" name="imageUrl" value={imageUrl} />

          {preview && (
            <div style={{ position: "relative", width: 120, height: 160, borderRadius: 10, overflow: "hidden", marginBottom: "0.75rem", border: "2px solid rgba(59,130,246,0.3)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                type="button"
                onClick={() => { setPreview(""); setImageUrl(""); if (cameraRef.current) cameraRef.current.value = ""; if (fileRef.current) fileRef.current.value = ""; }}
                style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Bank */}
            <button
              type="button"
              onClick={() => setShowBank(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", borderRadius: 8, background: "rgba(37,99,235,0.15)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body), sans-serif" }}
            >
              <ImageIcon size={14} /> Banco ({figWithImages.length})
            </button>

            {/* Camera */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body), sans-serif" }}>
              <Camera size={14} /> Sacar foto
              <input ref={cameraRef} type="file" name="image" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, fileRef)} />
            </label>

            {/* Upload */}
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1rem", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body), sans-serif" }}>
              <Upload size={14} /> Subir archivo
              <input ref={fileRef} type="file" name="image" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, cameraRef)} />
            </label>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.75rem" }}>
          <div>
            <label htmlFor="number" style={LABEL_STYLE}>Número *</label>
            <input
              id="number" name="number" type="number" min={1} required
              placeholder="Ej: 17"
              onChange={handleNumberChange}
              style={INPUT_STYLE}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label htmlFor="team" style={LABEL_STYLE}>Selección *</label>
            <select
              id="team" name="team" required
              value={team} onChange={(e) => setTeam(e.target.value)}
              style={{ ...INPUT_STYLE, cursor: "pointer" }}
            >
              <option value="">Elegir…</option>
              {teams.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="name" style={LABEL_STYLE}>Nombre del jugador *</label>
          <input
            id="name" name="name" required placeholder="Ej: Lionel Messi"
            value={name} onChange={(e) => setName(e.target.value)}
            style={INPUT_STYLE}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label htmlFor="askingPrice" style={LABEL_STYLE}>Precio ($) *</label>
            <input
              id="askingPrice" name="askingPrice" type="number" min={1} required placeholder="Ej: 1500"
              style={INPUT_STYLE}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
          <div>
            <label htmlFor="whatsapp" style={LABEL_STYLE}>WhatsApp *</label>
            <input
              id="whatsapp" name="whatsapp" type="tel" required placeholder="2604123456"
              style={INPUT_STYLE}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" style={{ ...LABEL_STYLE }}>
            Descripción <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(opcional)</span>
          </label>
          <textarea
            id="description" name="description" rows={2} placeholder="Estado de la figurita, detalles, etc."
            style={{ ...INPUT_STYLE, resize: "vertical" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          style={{
            padding: "0.9rem", borderRadius: 10, background: "#2563eb",
            color: "#fff", fontSize: "0.9rem", fontWeight: 700, border: "none",
            cursor: pending ? "not-allowed" : "pointer", opacity: pending ? 0.6 : 1,
            fontFamily: "var(--font-body), sans-serif", letterSpacing: "0.05em",
            transition: "opacity 0.15s",
          }}
        >
          {pending ? "Publicando…" : "Publicar figurita"}
        </button>
      </form>

      {/* Image bank modal */}
      {showBank && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(5,13,46,0.95)", zIndex: 100, display: "flex", flexDirection: "column" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowBank(false); }}
        >
          <div style={{ maxWidth: 900, width: "100%", margin: "0 auto", padding: "2rem", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "2rem", color: "#fff", margin: 0 }}>
                BANCO DE IMÁGENES
              </h2>
              <button onClick={() => setShowBank(false)} style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <Search size={14} style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input
                autoFocus
                type="text"
                placeholder="Buscar por nombre, número o selección…"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                style={{ ...INPUT_STYLE, paddingLeft: "2.4rem" }}
              />
            </div>

            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", margin: "0 0 1rem", fontFamily: "var(--font-body), sans-serif" }}>
              {bankFiltered.length} figuritas con imagen · Hacé click para seleccionar
            </p>

            {/* Grid */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem" }}>
                {bankFiltered.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => selectFromBank(f)}
                    style={{ borderRadius: 10, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.07)", cursor: "pointer", padding: 0, textAlign: "left", transition: "border-color 0.15s, transform 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)"; e.currentTarget.style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <div style={{ aspectRatio: "3/4", overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.imageUrl!} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "0.3rem 0.4rem" }}>
                      <p style={{ fontSize: "0.55rem", color: "#475569", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>#{f.number}</p>
                      <p style={{ fontSize: "0.62rem", color: "#94a3b8", margin: 0, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
