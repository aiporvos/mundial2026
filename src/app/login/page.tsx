'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'
import type { FormState } from '@/lib/definitions'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(login, undefined)

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050d2e 0%, #0a1848 55%, #071230 100%)' }}
    >
      {/* Diagonal sticker grid pattern */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(37,99,235,0.06) 0px, rgba(37,99,235,0.06) 1px, transparent 1px, transparent 40px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Radial glow top */}
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-2xl">⬡</span>
            <h1
              className="text-6xl font-black tracking-tighter"
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
            <span className="text-blue-400 text-2xl">⬡</span>
          </div>
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: 'rgba(59,130,246,0.6)' }}
          >
            Colección oficial
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(59,130,246,0.2)',
            boxShadow: '0 0 60px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Accent stripe */}
          <div
            className="w-10 h-1 rounded-full mb-6"
            style={{ background: 'linear-gradient(90deg, #2563eb, #1d4ed8)' }}
          />

          <h2 className="text-2xl font-bold text-white mb-1">Bienvenido de vuelta</h2>
          <p className="text-sm text-zinc-500 mb-7">Ingresá para ver tu álbum y pedidos</p>

          {/* Global error */}
          {state?.message && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl text-sm border"
              style={{
                color: '#f87171',
                background: 'rgba(248,113,113,0.08)',
                borderColor: 'rgba(248,113,113,0.2)',
              }}
            >
              {state.message}
            </div>
          )}

          <form action={formAction} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-zinc-700 text-sm outline-none transition-all focus:ring-1"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${state?.errors?.email ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = state?.errors?.email
                    ? 'rgba(248,113,113,0.5)'
                    : 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {state?.errors?.email && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Contraseña
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-zinc-700 text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${state?.errors?.password ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = state?.errors?.password
                    ? 'rgba(248,113,113,0.5)'
                    : 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {state?.errors?.password && (
                <p className="mt-1.5 text-xs text-red-400">{state.errors.password[0]}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{
                background: pending
                  ? 'rgba(59,130,246,0.6)'
                  : 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)',
                color: '#050d2e',
              }}
              onMouseEnter={(e) => {
                if (!pending)
                  e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
                  />
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-7">
            ¿No tenés cuenta?{' '}
            <Link
              href="/registro"
              className="font-semibold transition-colors"
              style={{ color: '#2563eb' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
            >
              Registrate gratis
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6">
          Mayorga 1590, San Rafael, Mendoza · 9 a 21 hs
        </p>

        {/* Dev shortcuts */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-4 p-3 rounded-xl" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p className="text-[10px] text-zinc-700 text-center uppercase tracking-widest mb-2">
              Accesos de prueba
            </p>
            <div className="flex gap-2">
              <QuickLogin email="juan@test.ar" password="user1234" label="Usuario" />
              <QuickLogin email="admin@figus.ar" password="admin1234" label="Admin" />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function QuickLogin({ email, password, label }: { email: string; password: string; label: string }) {
  function fill() {
    const emailEl = document.getElementById('email') as HTMLInputElement | null
    const passEl = document.getElementById('password') as HTMLInputElement | null
    if (emailEl) emailEl.value = email
    if (passEl) passEl.value = password
  }

  return (
    <button
      type="button"
      onClick={fill}
      className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-white/5"
      style={{ border: '1px solid rgba(255,255,255,0.07)', color: '#71717a' }}
    >
      {label}
      <span className="block text-[10px] text-zinc-700 font-normal">{email}</span>
    </button>
  )
}
