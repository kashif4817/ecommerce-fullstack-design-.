'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const PIN_LENGTH = 4

export default function UnlockClient({ nextPath = '/admin' }) {
  const router = useRouter()
  const inputRef = useRef(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const activeIndex = isFocused && pin.length < PIN_LENGTH ? pin.length : -1

  const focusInput = () => inputRef.current?.focus()

  const handlePinChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH)
    setPin(nextValue)
    if (error) setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (pin.length !== PIN_LENGTH) {
      setError('Enter your 4-digit admin PIN.')
      focusInput()
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.error || 'Unable to verify PIN right now.')
        setPin('')
        focusInput()
        return
      }

      const safeNextPath = nextPath.startsWith('/admin') ? nextPath : '/admin'
      router.replace(safeNextPath)
      router.refresh()
    } catch {
      setError('Something went wrong while verifying the PIN.')
      setPin('')
      focusInput()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              <ShieldCheck size={14} />
              Protected Admin Access
            </div>

            <div className="mt-6 max-w-xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Secure your dashboard with a quick PIN check.
              </h1>
              <p className="text-base leading-7 text-slate-600 sm:text-lg">
                Enter the 4-digit admin PIN to continue into your control panel.
                This temporary lock is route-protected and will cover nested admin
                pages too.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <InfoCard
                icon={Lock}
                title="Route Guarded"
                value="All /admin paths"
                tone="indigo"
              />
              <InfoCard
                icon={KeyRound}
                title="PIN Length"
                value="4 digits"
                tone="cyan"
              />
              <InfoCard
                icon={Sparkles}
                title="Current Mode"
                value="Supabase verified"
                tone="amber"
              />
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Same visual language as your admin area
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    The unlock screen uses the same slate cards, compact admin
                    spacing, and accent colors as the dashboard so the experience
                    feels native to your panel.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-indigo-600">
                <KeyRound size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Unlock Admin
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                  Enter your PIN
                </h2>
              </div>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="admin-pin-input"
                  className="mb-3 block text-sm font-medium text-slate-700"
                >
                  4-digit access PIN
                </label>

                <input
                  id="admin-pin-input"
                  ref={inputRef}
                  autoFocus
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={PIN_LENGTH}
                  value={pin}
                  onChange={handlePinChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  aria-label="Admin PIN"
                  className="sr-only"
                />

                <button
                  type="button"
                  onClick={focusInput}
                  className={`block w-full rounded-3xl border bg-slate-50 p-4 text-left transition ${
                    isFocused
                      ? 'border-indigo-300 bg-white ring-4 ring-indigo-500/10'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: PIN_LENGTH }).map((_, index) => {
                      const hasValue = Boolean(pin[index])
                      const isActive = index === activeIndex

                      return (
                        <div
                          key={index}
                          className={`flex h-16 items-center justify-center rounded-2xl border text-2xl font-semibold transition ${
                            isActive
                              ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-500/10'
                              : hasValue
                              ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-300'
                          }`}
                        >
                          <span className="relative flex items-center justify-center">
                            {hasValue ? '*' : isActive ? '' : index + 1}
                            {isActive && !hasValue ? (
                              <span className="absolute h-7 w-0.5 animate-pulse bg-indigo-500" />
                            ) : null}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </button>

                <p className="mt-3 text-sm text-slate-500">
                  Enter the current admin PIN to open the dashboard. The PIN is verified from Supabase on the server.
                </p>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Verifying PIN...' : 'Unlock Dashboard'}
                <ArrowRight size={16} />
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, title, value, tone }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className={`inline-flex rounded-2xl p-2 ${tones[tone]}`}>
        <Icon size={16} />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

