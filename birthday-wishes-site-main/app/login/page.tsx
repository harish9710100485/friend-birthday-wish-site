"use client"
import { useState, type FormEvent } from 'react'
import gate from '../../data/gate.json'

const { title, subtitle, placeholder, unlockLabel, wrongMessage, hintButtonLabel, hints } = gate

export default function LoginPage(){
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hintIndex, setHintIndex] = useState(-1)

  async function handleSubmit(e: FormEvent){
    e.preventDefault()
    setSubmitting(true)
    setWrong(false)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      })
      if (res.ok) {
        window.location.href = '/'
      } else {
        setWrong(true)
        setValue('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleHint(){
    setHintIndex((i) => (i + 1 < hints.length ? i + 1 : i))
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-gradient-to-br from-[#DDF2EF] via-[#FFF9EF] to-[#FFE0C2] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 backdrop-blur-3xl" />
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/10 bg-card p-8 text-center shadow-glow backdrop-blur-xl">
        <div className="mb-4 text-4xl">🔒</div>
        <h1 className="mb-2 text-2xl font-semibold text-gradient-friendship">{title}</h1>
        <p className="mb-6 text-sm text-[#8A6478]">{subtitle}</p>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => { setValue(e.target.value); setWrong(false) }}
            placeholder={placeholder}
            autoFocus
            className="w-full rounded-full border border-[#E56AB3]/30 bg-white/70 px-5 py-3 pr-12 text-center text-[#6B2247] outline-none focus:border-[#E56AB3]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-[#8A6478] transition hover:text-[#D6488F]"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        {wrong && <p className="mt-3 text-xs text-[#C2185B]">{wrongMessage}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#3D0F28] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {unlockLabel}
        </button>
        {hints.length > 0 && (
          <div className="mt-4">
            {hintIndex >= 0 && <p className="mb-2 text-xs text-[#8A6478]">{hints[hintIndex]}</p>}
            {hintIndex + 1 < hints.length && (
              <button
                type="button"
                onClick={handleHint}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D6488F] underline"
              >
                {hintButtonLabel}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
