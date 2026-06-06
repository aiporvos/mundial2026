import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Navbar } from "@/components/navbar";
import { CatalogGrid } from "@/components/catalog-grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [figuritas, session] = await Promise.all([
    prisma.figurita.findMany({ orderBy: { number: "asc" } }),
    getSession(),
  ]);

  const teams = Array.from(new Set(figuritas.map((f) => f.team))).sort();
  const available = figuritas.filter((f) => f.stock > 0).length;

  return (
    <div style={{ background: "#f0f5ff", minHeight: "100vh" }}>
      <Navbar role={session?.role} />

      {/* ─── HERO ─── */}
      <section
        style={{
          background:
            "radial-gradient(ellipse at 70% 35%, rgba(37,99,235,0.4) 0%, transparent 55%), linear-gradient(135deg, #050d2e 0%, #0a1848 60%, #0d2265 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle pitch-line pattern */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 80px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "5.5rem 2rem 4.5rem",
            position: "relative",
          }}
        >
          {/* Eyebrow */}
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#93c5fd",
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 600,
              margin: "0 0 1.75rem",
            }}
          >
            Panini · FIFA World Cup 2026
          </p>

          {/* Giant title */}
          <h1
            style={{
              fontFamily: "var(--font-display), 'Arial Black', sans-serif",
              fontSize: "clamp(5.5rem, 18vw, 15rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.01em",
              color: "#fff",
              margin: 0,
            }}
          >
            FIGUS
          </h1>

          {/* Outlined subtitle */}
          <h2
            style={{
              fontFamily: "var(--font-display), 'Arial Black', sans-serif",
              fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(147,197,253,0.5)",
              margin: "0.6rem 0 0",
            }}
          >
            COLECCIÓN OFICIAL
          </h2>

          {/* Stats + pickup */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              gap: "0.5rem 4rem",
              marginTop: "4rem",
            }}
          >
            <StatBlock value={figuritas.length} label="figuritas" />
            <StatBlock value={teams.length} label="selecciones" />
            <StatBlock value={available} label="disponibles" />

            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p
                style={{
                  fontSize: "0.58rem",
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  margin: 0,
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 600,
                }}
              >
                Retiro en local
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.7)",
                  margin: "0.25rem 0 0",
                  fontFamily: "var(--font-body), sans-serif",
                  fontWeight: 600,
                }}
              >
                {process.env.NEXT_PUBLIC_PICKUP_ADDRESS}
              </p>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "#93c5fd",
                  margin: "0.1rem 0 0",
                  fontFamily: "var(--font-body), sans-serif",
                }}
              >
                {process.env.NEXT_PUBLIC_PICKUP_HOURS}
              </p>
            </div>
          </div>
        </div>

        {/* FIFA-blue marquee band */}
        <div
          style={{
            background: "#1d4ed8",
            overflow: "hidden",
            marginTop: "3.5rem",
            padding: "0.55rem 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 45s linear infinite",
            }}
          >
            {[...teams, ...teams].map((team, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-display), 'Arial Black', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.12em",
                  color: "#fff",
                  padding: "0 2rem",
                  whiteSpace: "nowrap",
                }}
              >
                {team}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATALOG ─── */}
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 2rem 7rem",
        }}
      >
        <CatalogGrid figuritas={figuritas} />
      </main>
    </div>
  );
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-display), 'Arial Black', sans-serif",
          fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
          lineHeight: 1,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 600,
          marginTop: "0.2rem",
        }}
      >
        {label}
      </div>
    </div>
  );
}
