import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { Navbar } from "@/components/navbar";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";
import { User, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado — listo para retirar",
  COLLECTED: "Retirado",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "#2563eb",
  PAID: "#4ade80",
  COLLECTED: "#60a5fa",
  CANCELLED: "#f87171",
};

export default async function PerfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { items: { include: { figurita: true } } },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen" style={{ background: "#050d2e" }}>
      <Navbar role={session.role} />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile card */}
        <div
          className="rounded-xl p-5 mb-6 flex items-center gap-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(37,99,235,0.12)" }}
          >
            <User size={22} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white">
              {user.name} {user.lastName}
            </p>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <LogOut size={12} />
              Salir
            </button>
          </form>
        </div>

        {/* Orders */}
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Mis pedidos
        </h2>

        {user.orders.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-zinc-600 text-sm">Sin pedidos todavía.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span
                      className="font-mono font-black text-xl"
                      style={{ color: "#2563eb" }}
                    >
                      {order.pickupCode}
                    </span>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: STATUS_COLOR[order.status] ?? "#a1a1aa" }}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-zinc-300">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {order.items
                    .map(
                      (i) =>
                        `#${i.figurita.number} ${i.figurita.name}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`
                    )
                    .join(", ")}
                </p>

                <p className="text-xs text-zinc-700 mt-1.5">
                  {new Date(order.createdAt).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
