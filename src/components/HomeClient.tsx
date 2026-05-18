'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FolderSummary } from '@/types'
import { missedCount } from '@/lib/progress'
import PracticeSetupModal from '@/components/practice/PracticeSetupModal'

export default function HomeClient({
  folders,
  total,
}: {
  folders: FolderSummary[]
  total: number
}) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [missed, setMissed] = useState(0)

  useEffect(() => {
    setMissed(missedCount())
  }, [])

  const quickFolder = (name: string) => {
    router.push(`/practice?folders=${name}&order=random&feedback=each`)
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            EDAIC Part I practice
          </p>
          <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Question bank
          </h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary"
          style={{ height: 44, fontSize: 14 }}
        >
          Start practice →
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div
          className="card"
          style={{
            background: 'rgba(221, 203, 245, 0.06)',
            borderColor: 'rgba(221, 203, 245, 0.12)',
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--lavender)',
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            {total}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            Total questions
          </div>
        </div>
        <div
          className="card"
          style={{
            background: 'rgba(122, 255, 161, 0.06)',
            borderColor: 'rgba(122, 255, 161, 0.12)',
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--green)',
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            {folders.length}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            Folders
          </div>
        </div>
        <button
          className="card"
          onClick={() =>
            router.push('/practice?source=missed&order=random&feedback=each')
          }
          style={{
            background: 'rgba(255, 162, 125, 0.06)',
            borderColor: 'rgba(255, 162, 125, 0.12)',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--coral)',
              lineHeight: 1.1,
              marginBottom: 6,
            }}
          >
            {missed}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            Review missed →
          </div>
        </button>
      </div>

      <div
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          marginBottom: '0.875rem',
        }}
      >
        Folders
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {folders.map((f) => (
          <button
            key={f.name}
            onClick={() => quickFolder(f.name)}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600 }}>{f.label}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
              {f.count} question{f.count !== 1 ? 's' : ''} →
            </span>
          </button>
        ))}
      </div>

      {modalOpen && (
        <PracticeSetupModal folders={folders} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
