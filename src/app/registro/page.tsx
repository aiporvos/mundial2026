'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register } from '@/app/actions/auth'
import type { FormState } from '@/lib/definitions'

function Field({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  optional,
  error,
}: {
  id: string
  name: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  optional?: boolean
  error?: string[]
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'rgba(255,255,255,0.4)' }}
      >
        {label}
        {optional && (
          <span
            className="text-[10px] normal-case tracking-normal px-1.5 py-0.5 rounded font-normal"
            style={{ color: 'rgba(59,130,246,0.6)', background: 'rgba(37,99,235,0.12)' }}
          >
            opcional
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-white placeholder-zinc-700 text-sm outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.08)'}`,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? 'rgba(248,113,113,0.5)'
            : 'rgba(255,255,255,0.08)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error[0]}</p>}
    </div>
  )
}

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(register, undefined)

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 py-10 relative overflow-hidden"
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

      <div className="relative w-full max-w-lg z-10">
        {/* Brand */}
        <div className="text-center mb-8">
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
          <div
            className="w-10 h-1 rounded-full mb-6"
            style={{ background: 'linear-gradient(90deg, #2563eb, #1d4ed8)' }}
          />

          <h2 className="text-2xl font-bold text-white mb-1">Crear cuenta</h2>
          <p className="text-sm text-zinc-500 mb-7">
            Armá tu álbum digital y pedí tus figuritas
          </p>

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
            {/* Name + LastName */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                id="name"
                name="name"
                label="Nombre"
                autoComplete="given-name"
                placeholder="Juan"
                error={state?.errors?.name}
              />
              <Field
                id="lastName"
                name="lastName"
                label="Apellido"
                autoComplete="family-name"
                placeholder="Pérez"
                error={state?.errors?.lastName}
              />
            </div>

            <Field
              id="email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              error={state?.errors?.email}
            />

            <Field
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              error={state?.errors?.password}
            />

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-xs text-zinc-600 uppercase tracking-wider">Datos opcionales</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Phone + DNI */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                id="phone"
                name="phone"
                label="Teléfono"
                type="tel"
                autoComplete="tel"
                placeholder="11 1234-5678"
                optional
                error={state?.errors?.phone}
              />
              <Field
                id="dni"
                name="dni"
                label="DNI"
                autoComplete="off"
                placeholder="12.345.678"
                optional
                error={state?.errors?.dni}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{
                background: pending
                  ? 'rgba(59,130,246,0.6)'
                  : 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)',
                color: '#050d2e',
              }}
              onMouseEnter={(e) => {
                if (!pending) e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {pending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta gratis'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-7">
            ¿Ya tenés cuenta?{' '}
            <Link
              href="/login"
              className="font-semibold transition-colors"
              style={{ color: '#2563eb' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#60a5fa')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
            >
              Iniciá sesión
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-700 mt-6">
          Mayorga 1590, San Rafael, Mendoza · 9 a 21 hs
        </p>
      </div>
    </main>
  )
}
