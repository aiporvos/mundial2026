import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft, Sparkles, Coins } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen flex" style={{ background: "#eef4ff" }}>
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 flex flex-col"
        style={{ background: "#050d2e", boxShadow: "4px 0 24px rgba(0,0,0,0.15)" }}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-5">
          <Link href="/" className="block">
            <span
              className="text-4xl font-black tracking-tighter leading-none"
              style={{
                background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: '"Georgia", "Times New Roman", serif',
              }}
            >
              FIGUS
            </span>
            <p className="text-[10px] uppercase tracking-[0.25em] mt-0.5 font-medium" style={{ color: "rgba(59,130,246,0.6)" }}>
              Admin
            </p>
          </Link>
        </div>

        <div className="mx-6 h-px" style={{ background: "rgba(37,99,235,0.12)" }} />

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/admin/figuritas", icon: Package, label: "Figuritas" },
            { href: "/admin/pedidos", icon: ShoppingBag, label: "Pedidos" },
            { href: "/admin/creditos", icon: Coins, label: "Créditos" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <div className="mx-3 h-px mb-4" style={{ background: "rgba(255,255,255,0.06)" }} />
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            <ArrowLeft size={13} />
            Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 h-14 flex items-center justify-between px-8"
          style={{
            background: "rgba(240,242,245,0.95)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Sparkles size={14} style={{ color: "#2563eb" }} />
            <span className="font-semibold" style={{ color: "#111827" }}>Figus Admin</span>
            <span style={{ color: "#d1d5db" }}>/</span>
            <span style={{ color: "#9ca3af" }}>Mayorga 1590, San Rafael, Mendoza</span>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full font-bold tracking-wider"
            style={{ background: "#dbeafe", color: "#1d4ed8" }}
          >
            ADMIN
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
