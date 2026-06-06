"use client";

import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CarritoPage() {
  const { items, total, remove, updateQty } = useCart();

  return (
    <div className="min-h-screen" style={{ background: "#050d2e" }}>
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={48} className="mx-auto mb-4 text-zinc-700" />
            <p className="text-zinc-500 mb-6">Tu carrito está vacío</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider"
              style={{
                background: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
                color: "#050d2e",
              }}
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {/* Number badge */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-black"
                    style={{
                      background: "rgba(37,99,235,0.12)",
                      color: "#2563eb",
                    }}
                  >
                    #{item.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500">{item.team}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-white/10"
                      style={{ color: "#a1a1aa" }}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-white/10"
                      style={{ color: "#a1a1aa" }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span
                    className="text-sm font-bold w-20 text-right"
                    style={{ color: "#2563eb" }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => remove(item.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 text-zinc-600 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-zinc-400">Total</span>
                <span
                  className="text-2xl font-black"
                  style={{ color: "#2563eb" }}
                >
                  {formatPrice(total)}
                </span>
              </div>

              <p className="text-xs text-zinc-600 mb-4">
                El pago se realiza en el local al momento del retiro.
              </p>

              <Link
                href="/checkout"
                className="block w-full py-3.5 rounded-xl text-center text-sm font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
                  color: "#050d2e",
                }}
              >
                Confirmar pedido
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
