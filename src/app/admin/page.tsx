import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  Package, ShoppingBag, TrendingUp, AlertTriangle,
  ArrowRight, Star, Layers, Users
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente pago",
  PAID: "Pagado",
  COLLECTED: "Retirado",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  PENDING_PAYMENT: { bg: "#fff7ed", text: "#c2410c" },
  PAID: { bg: "#f0fdf4", text: "#15803d" },
  COLLECTED: { bg: "#eff6ff", text: "#1d4ed8" },
  CANCELLED: { bg: "#fef2f2", text: "#dc2626" },
};

const RARITY_COLORS: Record<string, string> = {
  COMUN: "#94a3b8",
  POCO_COMUN: "#34d399",
  RARA: "#60a5fa",
  EPICA: "#a78bfa",
  LEGENDARIA: "#60a5fa",
};

const RARITY_LABEL: Record<string, string> = {
  COMUN: "Común",
  POCO_COMUN: "Poco común",
  RARA: "Rara",
  EPICA: "Épica",
  LEGENDARIA: "Legendaria",
};

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const radius = 58;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const slice = { ...d, pct, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f3f4f6" strokeWidth="18" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="18"
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circumference * 0.25}
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" className="text-2xl font-black" style={{ fontSize: 22, fontWeight: 900, fill: "#111827" }}>{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 9, fill: "#9ca3af", fontWeight: 600, letterSpacing: 1 }}>FIGUS</text>
      </svg>
      <div className="space-y-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-gray-500">{s.label}</span>
            <span className="text-xs font-bold text-gray-800 ml-auto pl-3">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StockBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 truncate flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ background: "#f3f4f6" }}>
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-6 text-right">{value}</span>
    </div>
  );
}

export default async function AdminDashboard() {
  const [
    totalFiguritas,
    totalOrders,
    pendingOrders,
    paidRevenue,
    rarityStats,
    lowStockFiguritas,
    topTeams,
    recentOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.figurita.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { total: true } }).then(r => r._sum.total ?? 0),
    prisma.figurita.groupBy({ by: ["rarity"], _count: { _all: true }, orderBy: { rarity: "asc" } }),
    prisma.figurita.findMany({ where: { stock: { lte: 3 } }, orderBy: { stock: "asc" }, take: 6 }),
    prisma.figurita.groupBy({ by: ["team"], _count: { _all: true }, orderBy: { _count: { team: "desc" } }, take: 8 }),
    prisma.order.findMany({ take: 7, orderBy: { createdAt: "desc" }, include: { items: true } }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const rarityData = rarityStats.map(r => ({
    label: RARITY_LABEL[r.rarity] ?? r.rarity,
    value: r._count._all,
    color: RARITY_COLORS[r.rarity] ?? "#94a3b8",
  }));

  const maxTeamCount = topTeams[0]?._count?._all ?? 1;

  const teamColors = ["#2563eb", "#f97316", "#ef4444", "#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#06b6d4"];

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: "#111827" }}>Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Resumen general de la tienda</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Figuritas",
            value: totalFiguritas,
            icon: Package,
            color: "#2563eb",
            bg: "#fffbeb",
            href: "/admin/figuritas",
          },
          {
            label: "Pedidos totales",
            value: totalOrders,
            icon: ShoppingBag,
            color: "#3b82f6",
            bg: "#eff6ff",
            href: "/admin/pedidos",
          },
          {
            label: "Pend. de pago",
            value: pendingOrders,
            icon: AlertTriangle,
            color: "#f97316",
            bg: "#fff7ed",
            href: "/admin/pedidos?status=PENDING_PAYMENT",
          },
          {
            label: "Recaudado",
            value: formatPrice(paidRevenue),
            icon: TrendingUp,
            color: "#10b981",
            bg: "#f0fdf4",
            href: "/admin/pedidos",
          },
        ].map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl p-5 flex items-start justify-between transition-transform hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{label}</p>
              <p className="text-2xl font-black tracking-tight" style={{ color: "#111827" }}>{value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rarity donut */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Distribución por rareza</h2>
              <p className="text-xs text-gray-400 mt-0.5">Total de figuritas en catálogo</p>
            </div>
            <Star size={16} style={{ color: "#2563eb" }} />
          </div>
          <DonutChart data={rarityData} />
        </div>

        {/* Team bar chart */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Top equipos</h2>
              <p className="text-xs text-gray-400 mt-0.5">Por cantidad de figuritas</p>
            </div>
            <Layers size={16} style={{ color: "#3b82f6" }} />
          </div>
          <div className="space-y-2.5">
            {topTeams.map((t, i) => (
              <StockBar
                key={t.team}
                label={t.team}
                value={t._count._all}
                max={maxTeamCount}
                color={teamColors[i % teamColors.length]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low stock alert */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Stock crítico</h2>
              <p className="text-xs text-gray-400 mt-0.5">3 unidades o menos</p>
            </div>
            <AlertTriangle size={16} style={{ color: "#ef4444" }} />
          </div>
          <div className="space-y-2">
            {lowStockFiguritas.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">✓ Todo el stock OK</p>
            )}
            {lowStockFiguritas.map((f) => (
              <Link
                key={f.id}
                href={`/admin/figuritas/${f.id}/editar`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{f.name}</p>
                  <p className="text-[10px] text-gray-400">{f.team}</p>
                </div>
                <span
                  className="text-xs font-black ml-2 px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: f.stock === 0 ? "#fee2e2" : "#fff7ed",
                    color: f.stock === 0 ? "#dc2626" : "#c2410c",
                  }}
                >
                  {f.stock === 0 ? "AGOTADO" : `${f.stock} uds`}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div
          className="rounded-2xl p-6 lg:col-span-2"
          style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-800">Pedidos recientes</h2>
              <p className="text-xs text-gray-400 mt-0.5">Últimos {recentOrders.length} pedidos</p>
            </div>
            <Link
              href="/admin/pedidos"
              className="flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: "#2563eb" }}
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">Sin pedidos aún</p>
            )}
            {recentOrders.map((order) => {
              const sc = STATUS_COLOR[order.status] ?? { bg: "#f9fafb", text: "#374151" };
              return (
                <div
                  key={order.id}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl"
                  style={{ background: "#f9fafb" }}
                >
                  <span
                    className="font-mono font-black text-sm w-16 flex-shrink-0"
                    style={{ color: "#2563eb" }}
                  >
                    {order.pickupCode}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {order.guestName
                        ? `${order.guestName} ${order.guestLastName ?? ""}`
                        : "Usuario registrado"}
                    </p>
                    <p className="text-[10px] text-gray-400">{order.items.length} item(s)</p>
                  </div>
                  <span className="text-xs font-black text-gray-800 flex-shrink-0">{formatPrice(order.total)}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: sc.bg, color: sc.text }}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders by status pills */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Users size={15} style={{ color: "#6b7280" }} />
          <h2 className="text-sm font-bold text-gray-800">Estado de pedidos</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {ordersByStatus.map((s) => {
            const sc = STATUS_COLOR[s.status] ?? { bg: "#f9fafb", text: "#374151" };
            return (
              <Link
                key={s.status}
                href={`/admin/pedidos?status=${s.status}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-transform hover:-translate-y-0.5"
                style={{ background: sc.bg, border: `1px solid ${sc.text}20` }}
              >
                <span className="text-xs font-semibold" style={{ color: sc.text }}>
                  {STATUS_LABEL[s.status] ?? s.status}
                </span>
                <span
                  className="text-sm font-black"
                  style={{ color: sc.text }}
                >
                  {s._count._all}
                </span>
              </Link>
            );
          })}
          {ordersByStatus.length === 0 && (
            <p className="text-xs text-gray-400">Sin pedidos aún</p>
          )}
        </div>
      </div>
    </div>
  );
}
