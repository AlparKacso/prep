'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UnlockPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.replace('/dashboard')
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
      setPassword('')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--green)',
              borderRadius: 10,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 18px rgba(122, 255, 161, 0.35)',
              marginBottom: 14,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7 L4.5 7 L6 2 L7.5 12 L9 7 L13 7"
                stroke="#0A0C16"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
            prep
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
            Enter the password to continue
          </p>
        </div>

        <form onSubmit={submit} className="card">
          <label className="label" htmlFor="pw">
            PASSWORD
          </label>
          <input
            id="pw"
            className="input"
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ marginBottom: error ? 8 : 16 }}
          />
          {error && (
            <p
              style={{
                fontSize: 12,
                color: 'var(--coral)',
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !password}
            style={{ width: '100%', justifyContent: 'center', height: 44 }}
          >
            {loading ? 'Unlocking…' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  )
}
