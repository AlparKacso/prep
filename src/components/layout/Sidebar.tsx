'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const lock = async () => {
    await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lock: true }),
    })
    router.replace('/unlock')
    router.refresh()
  }

  return (
    <aside
      style={{
        width: 224,
        minWidth: 224,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem 0.875rem',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0.25rem 0.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: 28,
              height: 28,
              background: 'var(--green)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(122, 255, 161, 0.35)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 7 L4.5 7 L6 2 L7.5 12 L9 7 L13 7"
                stroke="#0A0C16"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}
          >
            prep
          </span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            marginTop: 5,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            fontWeight: 600,
            paddingLeft: 2,
          }}
        >
          EDAIC Part I
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link
          href="/dashboard"
          className={`nav-item${isActive('/dashboard') ? ' active' : ''}`}
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          href="/practice?source=missed&order=random&feedback=each"
          className={`nav-item${isActive('/practice') ? ' active' : ''}`}
          onClick={onClose}
        >
          Review missed
        </Link>
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
        <button type="button" onClick={lock} className="nav-item" style={{ fontSize: 13 }}>
          Lock
        </button>
      </div>
    </aside>
  )
}
