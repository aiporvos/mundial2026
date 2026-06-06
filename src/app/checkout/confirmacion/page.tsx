import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (!code) notFound();

  const order = await prisma.order.findUnique({
    where: { pickupCode: code },
    include: { items: { include: { figurita: true } } },
  });

  if (!order) notFound();

  const name = order.guestName ?? "";
  const address = process.env.NEXT_PUBLIC_PICKUP_ADDRESS;
  const hours = process.env.NEXT_PUBLIC_PICKUP_HOURS;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#050d2e" }}
    >
      <div className="w-full max-w-lg">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            ¡Pedido reservado!
          </h1>
          {name && (
            <p className="text-zinc-400 text-sm">Gracias, {name}.</p>
          )}
        </div>

        {/* Pickup code */}
        <div
          className="rounded-2xl p-6 text-center mb-4"
          style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
            Código de retiro
          </p>
          <p
            className="text-5xl font-black tracking-widest mb-2"
            style={{
              color: "#2563eb",
              fontFamily: '"Georgia", serif',
            }}
          >
            {order.pickupCode}
          </p>
          <p className="text-xs text-zinc-600">
            Reservado hasta{" "}
            {new Date(order.reservedUntil).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Order detail */}
        <div
          className="rounded-xl p-5 mb-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Detalle del pedido
          </h2>
          <div className="space-y-2 mb-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-zinc-400">
                  #{item.figurita.number} {item.figurita.name}
                  {item.quantity > 1 && (
                    <span className="text-zinc-600"> ×{item.quantity}</span>
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
            <span className="text-sm text-zinc-400">Total a pagar</span>
            <span className="text-sm font-bold" style={{ color: "#2563eb" }}>
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Pickup info */}
        <div
          className="rounded-xl p-4 mb-6 space-y-2"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-start gap-2 text-sm text-zinc-400">
            <MapPin size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <span>{address}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-zinc-400">
            <Clock size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <span>{hours}</span>
          </div>
        </div>

        <Link
          href="/"
          className="block w-full py-3 rounded-xl text-center text-sm font-bold uppercase tracking-wider"
          style={{
            background: "linear-gradient(135deg, #60a5fa, #1d4ed8)",
            color: "#050d2e",
          }}
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
