"use client";

import Link from "next/link";
import { useCart } from "@/context/cart";
import { ShoppingCart, LayoutDashboard, Tag } from "lucide-react";

export function Navbar({ role }: { role?: string }) {
  const { count } = useCart();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#050d2e",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 2rem",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <span
            style={{
              fontFamily: "var(--font-display), 'Arial Black', sans-serif",
              fontSize: "2rem",
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "0.1em",
            }}
          >
            FIGUS
          </span>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />
          <span
            style={{
              fontSize: "0.5rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#93c5fd",
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 600,
            }}
          >
            Mundial&nbsp;2026
          </span>
        </Link>

        {/* Center nav */}
        <nav
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
          }}
        >
          {[
            { href: "/", label: "Catálogo" },
            { href: "/mercado", label: "Mercado" },
            { href: "/album", label: "Mi álbum" },
            { href: "/perfil", label: "Mi perfil" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "0.45rem 1rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontFamily: "var(--font-body), sans-serif",
                transition: "color 0.18s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link
            href="/vender"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.28rem 0.65rem",
              borderRadius: 6,
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fff",
              background: "#2563eb",
              textDecoration: "none",
              fontFamily: "var(--font-body), sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1d4ed8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#2563eb"; }}
          >
            <Tag size={11} />
            Vender
          </Link>

          {role === "ADMIN" && (
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.28rem 0.65rem",
                borderRadius: 6,
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#93c5fd",
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.2)",
                textDecoration: "none",
                fontFamily: "var(--font-body), sans-serif",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(59,130,246,0.1)"; }}
            >
              <LayoutDashboard size={11} />
              Admin
            </Link>
          )}

          <Link
            href="/carrito"
            title="Carrito"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.38rem 0.75rem",
              borderRadius: 8,
              textDecoration: "none",
              background: count > 0 ? "#2563eb" : "rgba(255,255,255,0.06)",
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = count > 0 ? "#1d4ed8" : "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = count > 0 ? "#2563eb" : "rgba(255,255,255,0.06)";
            }}
          >
            <ShoppingCart size={16} style={{ color: count > 0 ? "#fff" : "rgba(255,255,255,0.45)" }} />
            {count > 0 && (
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "var(--font-body), sans-serif",
                  lineHeight: 1,
                }}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
