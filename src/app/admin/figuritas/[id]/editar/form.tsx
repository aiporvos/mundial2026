"use client";

import { useActionState, useRef, useState } from "react";
import { updateFigurita } from "@/app/actions/figuritas";
import type { FormState } from "@/lib/definitions";
import type { Figurita } from "@prisma/client";
import Link from "next/link";
import { Camera, Upload, X, ImageOff, Check } from "lucide-react";

const RARITIES = [
  { value: "COMUN", label: "Común" },
  { value: "POCO_COMUN", label: "Poco común" },
  { value: "RARA", label: "Rara" },
  { value: "EPICA", label: "Épica" },
  { value: "LEGENDARIA", label: "Legendaria" },
];

export default function EditFiguritaForm({ figurita }: { figurita: Figurita }) {
  const updateWithId = updateFigurita.bind(null, figurita.id);
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateWithId, undefined);

  const [preview, setPreview] = useState<string | null>(figurita.imageUrl);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setHasNewImage(true);
    setFileName(file.name);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
    // clear the other input
    if (e.target === fileInputRef.current && cameraInputRef.current) cameraInputRef.current.value = "";
    if (e.target === cameraInputRef.current && fileInputRef.current) fileInputRef.current.value = "";
  }

  function clearNew() {
    setPreview(figurita.imageUrl);
    setHasNewImage(false);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/admin/figuritas" className="text-gray-400 hover:text-gray-600 transition-colors">
          Figuritas
        </Link>
        <span className="text-gray-300">/</span>
        <span className="font-semibold" style={{ color: "#111827" }}>
          Editar #{figurita.number} · {figurita.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left: image panel */}
        <div className="md:col-span-2">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {/* Preview */}
            <div className="aspect-[3/4] relative flex items-center justify-center" style={{ background: "#f8f9fa" }}>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt={figurita.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300">
                  <ImageOff size={40} />
                  <span className="text-sm text-gray-400">Sin imagen</span>
                </div>
              )}

              {hasNewImage && (
                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={clearNew}
                    className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Descartar nueva imagen"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {hasNewImage && (
                <div
                  className="absolute bottom-0 inset-x-0 px-3 py-2 flex items-center gap-1.5"
                  style={{ background: "rgba(16,185,129,0.9)" }}
                >
                  <Check size={11} className="text-white" />
                  <span className="text-[10px] text-white font-semibold truncate">{fileName}</span>
                </div>
              )}
            </div>

            {/* Upload actions */}
            <div className="p-4 space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Actualizar imagen
              </p>

              {/* Camera button — opens native camera on mobile */}
              <label
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl cursor-pointer transition-all hover:shadow-sm active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #dbeafe, #fde68a)",
                  border: "1px solid #fcd34d",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#2563eb" }}
                >
                  <Camera size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#92400e" }}>Sacar foto</p>
                  <p className="text-[10px]" style={{ color: "#b45309" }}>Abrí la cámara del celu</p>
                </div>
                <input
                  ref={cameraInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>

              {/* File picker */}
              <label
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl cursor-pointer transition-all hover:shadow-sm active:scale-95"
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#e5e7eb" }}
                >
                  <Upload size={15} style={{ color: "#6b7280" }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700">Subir archivo</p>
                  <p className="text-[10px] text-gray-400">JPG, PNG, WebP</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <form
          action={formAction}
          className="md:col-span-3 rounded-2xl p-6 space-y-4"
          style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Datos</p>

          <div className="grid grid-cols-2 gap-3">
            <Field id="number" label="Número" type="number" defaultValue={String(figurita.number)} error={state?.errors?.number} />
            <div>
              <label htmlFor="rarity" className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
                Rareza
              </label>
              <select
                id="rarity"
                name="rarity"
                defaultValue={figurita.rarity}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-colors"
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb", color: "#111827" }}
              >
                {RARITIES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Field id="name" label="Nombre del jugador" defaultValue={figurita.name} error={state?.errors?.name} />
          <Field id="team" label="Selección / Equipo" defaultValue={figurita.team} error={state?.errors?.team} />

          <div className="grid grid-cols-2 gap-3">
            <Field id="price" label="Precio (ARS)" type="number" defaultValue={String(figurita.price)} error={state?.errors?.price} />
            <Field id="stock" label="Stock" type="number" defaultValue={String(figurita.stock)} error={state?.errors?.stock} />
          </div>

          {!hasNewImage && (
            <input type="hidden" name="imageUrl" value={figurita.imageUrl ?? ""} />
          )}

          {state?.message && (
            <div className="p-3 rounded-xl text-xs text-red-600" style={{ background: "#fee2e2" }}>
              {state.message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #60a5fa, #1d4ed8)", color: "#050d2e" }}
            >
              {pending ? "Guardando..." : "Guardar cambios"}
            </button>
            <Link
              href="/admin/figuritas"
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: "#f3f4f6", color: "#374151" }}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  id, label, type = "text", defaultValue, error,
}: {
  id: string; label: string; type?: string; defaultValue?: string; error?: string[];
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-gray-400">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-colors"
        style={{
          background: "#f9fafb",
          border: `1px solid ${error ? "#fca5a5" : "#e5e7eb"}`,
          color: "#111827",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#fff"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "#fca5a5" : "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; }}
      />
      {error && <p className="mt-1 text-[10px] text-red-500">{error[0]}</p>}
    </div>
  );
}
