'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div
        className={`mobile-overlay${open ? ' active' : ''}`}
        onClick={() => setOpen(false)}
      />

      <div className={`sidebar-container${open ? ' open' : ''}`}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header className="mobile-header">
          <button
            onClick={() => setOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text)',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Open menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <path d="M3 6h16M3 11h16M3 16h10" />
            </svg>
          </button>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            aria-label="prep — go to home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: 'var(--text)',
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                background: 'var(--green)',
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(122, 255, 161, 0.35)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M1 6.5 L4 6.5 L5.5 1.5 L7 12 L8.5 6.5 L12 6.5"
                  stroke="#0A0C16"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>prep</span>
          </Link>
          <div style={{ width: 30 }} />
        </header>

        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
