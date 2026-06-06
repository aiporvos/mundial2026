import Link from 'next/link'

export default function VerificarPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050d2e 0%, #0a1848 55%, #071230 100%)' }}
    >
      {/* Grid pattern */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(37,99,235,0.06) 0px, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 40px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md z-10 text-center">
        {/* Brand */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-xl">⬡</span>
            <h1
              className="text-5xl font-black tracking-tighter"
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: '"Georgia", "Times New Roman", serif',
                letterSpacing: '-0.04em',
              }}
            >
              FIGUS
            </h1>
            <span className="text-blue-400 text-xl">⬡</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(59,130,246,0.2)',
            boxShadow: '0 0 60px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Envelope icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(37,99,235,0.08))',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
          >
            <svg
              className="w-10 h-10"
              style={{ color: '#2563eb' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">¡Ya casi estás!</h2>

          <p className="text-zinc-400 leading-relaxed mb-2">
            Te enviamos un email de verificación.
          </p>
          <p className="text-zinc-400 leading-relaxed mb-8">
            Revisá tu bandeja de entrada para activar tu cuenta y empezar a coleccionar.
          </p>

          {/* Steps */}
          <div
            className="rounded-xl p-4 mb-8 text-left space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              'Abrí el email de Figus',
              'Hacé clic en "Verificar cuenta"',
              '¡Listo! Ya podés comprar tus figus',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                  style={{ background: 'rgba(59,130,246,0.2)', color: '#2563eb' }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-zinc-400">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-zinc-600">
            ¿No llegó el email?{' '}
            <span className="text-zinc-500">Revisá la carpeta de spam.</span>
          </p>
        </div>

        <p className="mt-6 text-sm text-zinc-700">
          ¿Ya verificaste?{' '}
          <Link
            href="/login"
            className="font-semibold transition-colors"
            style={{ color: '#2563eb' }}
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  )
}
