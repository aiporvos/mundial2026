"use client";

import { useActionState, useEffect } from "react";
import { useCart } from "@/context/cart";
import { createOrder } from "@/app/actions/orders";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import type { FormState } from "@/lib/definitions";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();

  const boundAction = createOrder.bind(null, items);
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    boundAction,
    undefined
  );

  // Clear cart after successful order (redirect happens server-side)
  useEffect(() => {
    if (state?.success) clear();
  }, [state, clear]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: "#050d2e" }}>
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="text-zinc-500 mb-6">
            No hay items en el carrito.
          </p>
          <Link href="/" className="text-blue-400 font-semibold">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#050d2e" }}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Confirmar pedido</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Completá tus datos y te generamos un código de retiro.
        </p>

        {state?.message && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-xl text-sm border"
            style={{
              color: "#f87171",
              background: "rgba(248,113,113,0.08)",
              borderColor: "rgba(248,113,113,0.2)",
            }}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Guest info */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Tus datos
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Field
                id="guestName"
                label="Nombre"
                placeholder="Juan"
                error={state?.errors?.guestName}
              />
              <Field
                id="guestLastName"
                label="Apellido"
                placeholder="Pérez"
                error={state?.errors?.guestLastName}
              />
            </div>

            <Field
              id="guestEmail"
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={state?.errors?.guestEmail}
            />

            <div className="grid grid-cols-2 gap-4">
              <Field
                id="guestPhone"
                label="Teléfono"
                placeholder="11 1234-5678"
                optional
              />
              <Field
                id="guestDni"
                label="DNI"
                placeholder="12.345.678"
                optional
              />
            </div>
          </div>

          {/* Order summary */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resumen
            </h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    #{item.number} {item.name}{" "}
                    {item.quantity > 1 && (
                      <span className="text-zinc-600">×{item.quantity}</span>
                    )}
                  </span>
                  <span className="text-zinc-300">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex justify-between pt-3 border-t"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
              <span className="text-sm text-zinc-400">Total</span>
              <span
                className="text-lg font-black"
                style={{ color: "#2563eb" }}
              >
                {formatPrice(total)}
              </span>
            </div>

            <p className="text-xs text-zinc-600 mt-3">
              El pago se realiza en el local. Tu pedido queda reservado 48 hs.
            </p>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
              color: "#050d2e",
            }}
          >
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              "Reservar pedido"
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  optional,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  error?: string[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {label}
        {optional && (
          <span
            className="text-[10px] normal-case tracking-normal px-1.5 py-0.5 rounded"
            style={{
              color: "rgba(59,130,246,0.5)",
              background: "rgba(37,99,235,0.12)",
            }}
          >
            opcional
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-white placeholder-zinc-700 text-sm outline-none"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.08)"}`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? "rgba(248,113,113,0.5)"
            : "rgba(255,255,255,0.08)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error[0]}</p>}
    </div>
  );
}
