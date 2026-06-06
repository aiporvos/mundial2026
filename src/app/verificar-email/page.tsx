import { verifyEmail } from '@/app/actions/auth'
import Link from 'next/link'

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <ErrorState message="No se encontró el token de verificación." />
  }

  const result = await verifyEmail(token)

  if (result?.message) {
    return <ErrorState message={result.message} />
  }

  return null
}

function ErrorState({ message }: { message: string }) {
  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050d2e 0%, #0a1848 55%, #0f0f20 100%)' }}
    >
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(37,99,235,0.06) 0px, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 40px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative w-full max-w-md z-10 text-center">
        <div
          className="rounded-2xl p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(248,113,113,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">Error de verificación</h2>
          <p className="text-zinc-400 mb-8">{message}</p>

          <Link
            href="/registro"
            className="inline-block px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all"
            style={{ background: 'linear-gradient(135deg, #60a5fa, #1d4ed8)', color: '#050d2e' }}
          >
            Volver al registro
          </Link>
        </div>
      </div>
    </main>
  )
}
