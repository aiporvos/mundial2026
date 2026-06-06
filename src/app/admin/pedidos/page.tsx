import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "@/app/actions/orders";
import Link from "next/link";
import { Clock, CheckCircle2, Package2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { value: "PENDING_PAYMENT", label: "Pendiente" },
  { value: "PAID", label: "Pagado" },
  { value: "COLLECTED", label: "Retirado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; icon: typeof Clock }> = {
  PENDING_PAYMENT: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", icon: Clock },
  PAID:            { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", icon: CheckCircle2 },
  COLLECTED:       { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", icon: Package2 },
  CANCELLED:       { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", icon: XCircle },
};

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const [orders, statusCounts] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { figurita: true } } },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countMap: Record<string, number> = {};
  statusCounts.forEach((s) => { countMap[s.status] = s._count._all; });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#111827" }}>Pedidos</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders.length} pedido(s) {status ? "con ese estado" : "en total"}</p>
      </div>

      {/* Status filter cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/admin/pedidos"
          className="p-4 rounded-2xl transition-all hover:-translate-y-0.5"
          style={{
            background: !status ? "#050d2e" : "#fff",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: !status ? "rgba(255,255,255,0.5)" : "#9ca3af" }}>Todos</p>
          <p className="text-2xl font-black" style={{ color: !status ? "#60a5fa" : "#111827" }}>
            {statusCounts.reduce((s, x) => s + x._count._all, 0)}
          </p>
        </Link>
        {STATUS_OPTIONS.map((opt) => {
          const s = STATUS_STYLE[opt.value];
          const Icon = s.icon;
          const active = status === opt.value;
          return (
            <Link
              key={opt.value}
              href={`/admin/pedidos?status=${opt.value}`}
              className="p-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: active ? "#050d2e" : "#fff",
                border: `1px solid ${active ? "#050d2e" : "#f3f4f6"}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold" style={{ color: active ? "rgba(255,255,255,0.5)" : "#9ca3af" }}>
                  {opt.label}
                </p>
                <Icon size={13} style={{ color: active ? s.bg : s.text }} />
              </div>
              <p className="text-2xl font-black" style={{ color: active ? "#60a5fa" : "#111827" }}>
                {countMap[opt.value] ?? 0}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {orders.map((order) => {
          const ss = STATUS_STYLE[order.status] ?? STATUS_STYLE.PENDING_PAYMENT;
          const StatusIcon = ss.icon;
          const otherStatuses = STATUS_OPTIONS.filter((s) => s.value !== order.status);

          return (
            <div
              key={order.id}
              className="rounded-2xl p-5"
              style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono font-black text-xl" style={{ color: "#2563eb" }}>
                      {order.pickupCode}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}
                    >
                      <StatusIcon size={11} />
                      {STATUS_OPTIONS.find((s) => s.value === order.status)?.label ?? order.status}
                    </span>
                    <span className="text-xs font-black text-gray-800 ml-auto">{formatPrice(order.total)}</span>
                  </div>

                  {/* Client info */}
                  <p className="text-sm font-semibold text-gray-800">
                    {order.guestName
                      ? `${order.guestName} ${order.guestLastName ?? ""}`
                      : "Usuario registrado"}
                    {order.guestEmail && (
                      <span className="text-gray-400 font-normal ml-2 text-xs">{order.guestEmail}</span>
                    )}
                  </p>

                  {/* Items list */}
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {order.items
                      .map((i) => `${i.figurita.name}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`)
                      .join(" · ")}
                  </p>

                  <p className="text-[10px] text-gray-300 mt-2">
                    {new Date(order.createdAt).toLocaleString("es-AR")}
                  </p>
                </div>
              </div>

              {/* Status change buttons */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="text-[10px] text-gray-400 self-center mr-1">Cambiar a:</span>
                {otherStatuses.map((opt) => {
                  const os = STATUS_STYLE[opt.value];
                  return (
                    <form
                      key={opt.value}
                      action={async () => {
                        "use server";
                        await updateOrderStatus(order.id, opt.value);
                      }}
                    >
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:-translate-y-0.5"
                        style={{ background: os.bg, color: os.text, border: `1px solid ${os.border}` }}
                      >
                        {opt.label}
                      </button>
                    </form>
                  );
                })}
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div
            className="rounded-2xl py-20 text-center"
            style={{ background: "#fff", border: "1px solid #f3f4f6" }}
          >
            <p className="text-gray-300 text-3xl mb-3">📦</p>
            <p className="text-gray-400 text-sm">Sin pedidos{status ? " con ese estado" : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}
