'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type {
  FolderSummary,
  PracticeOrder,
  FeedbackTiming,
  PracticeSource,
} from '@/types'
import { missedCount } from '@/lib/progress'

const BATCH_OPTIONS = [10, 20, 30] as const

export default function PracticeSetupModal({
  folders,
  onClose,
}: {
  folders: FolderSummary[]
  onClose: () => void
}) {
  const router = useRouter()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [order, setOrder] = useState<PracticeOrder>('random')
  const [batch, setBatch] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<FeedbackTiming>('each')
  const [source, setSource] = useState<PracticeSource>('all')
  const [missed, setMissed] = useState(0)

  useEffect(() => {
    setMissed(missedCount())
  }, [])

  const toggleFolder = (name: string) => {
    setSelected((prev) => {
      const n = new Set(prev)
      n.has(name) ? n.delete(name) : n.add(name)
      return n
    })
  }

  const start = () => {
    const p = new URLSearchParams()
    if (selected.size > 0) p.set('folders', [...selected].join(','))
    p.set('order', order)
    if (batch != null) p.set('batch', String(batch))
    p.set('feedback', feedback)
    p.set('source', source)
    router.push(`/practice?${p.toString()}`)
    onClose()
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
        }}
      />
      <div
        className="practice-setup-sheet"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 101,
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border)',
          borderRadius: '20px 20px 0 0',
          padding: '1.5rem 1.5rem 2rem',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Start practice
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <Section label="Folders">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <Chip active={selected.size === 0} onClick={() => setSelected(new Set())}>
              All folders
            </Chip>
            {folders.map((f) => (
              <Chip
                key={f.name}
                active={selected.has(f.name)}
                onClick={() => toggleFolder(f.name)}
              >
                {f.label} <span style={{ opacity: 0.6 }}>{f.count}</span>
              </Chip>
            ))}
          </div>
        </Section>

        <Section label="Order">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Opt active={order === 'random'} onClick={() => setOrder('random')} label="Random" />
            <Opt
              active={order === 'sequential'}
              onClick={() => setOrder('sequential')}
              label="In order"
            />
          </div>
        </Section>

        <Section label="Batch size">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {BATCH_OPTIONS.map((n) => (
              <Opt
                key={n}
                active={batch === n}
                onClick={() => setBatch((b) => (b === n ? null : n))}
                label={String(n)}
              />
            ))}
            <Opt active={batch === null} onClick={() => setBatch(null)} label="All" />
          </div>
        </Section>

        <Section label="Feedback">
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <ModeCard
              active={feedback === 'each'}
              onClick={() => setFeedback('each')}
              title="After each"
              desc="Answer revealed per question"
            />
            <ModeCard
              active={feedback === 'end'}
              onClick={() => setFeedback('end')}
              title="At the end"
              desc="Score and answers after the run"
            />
          </div>
        </Section>

        <Section label="Source">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Opt active={source === 'all'} onClick={() => setSource('all')} label="All questions" />
            <Opt
              active={source === 'missed'}
              onClick={() => setSource('missed')}
              label={`Review missed (${missed})`}
            />
          </div>
        </Section>

        <button
          onClick={start}
          className="btn btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            height: 52,
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 16,
            marginTop: '0.5rem',
          }}
        >
          Start →
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .practice-setup-sheet {
            top: 50% !important; bottom: auto !important;
            left: 50% !important; right: auto !important;
            transform: translate(-50%, -50%);
            width: 560px;
            border-radius: 20px !important;
            border: 1px solid var(--border) !important;
            max-height: 88vh;
          }
        }
      `}</style>
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '0.625rem',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.35rem 0.875rem',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
        background: active ? 'rgba(122, 255, 161, 0.13)' : 'var(--bg-subtle)',
        color: active ? 'var(--green)' : 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function Opt({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.45rem 1.125rem',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
        background: active ? 'rgba(122, 255, 161, 0.1)' : 'var(--bg-subtle)',
        color: active ? 'var(--green)' : 'var(--text-muted)',
      }}
    >
      {label}
    </button>
  )
}

function ModeCard({
  active,
  onClick,
  title,
  desc,
}: {
  active: boolean
  onClick: () => void
  title: string
  desc: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '0.875rem 1rem',
        borderRadius: 14,
        textAlign: 'left',
        cursor: 'pointer',
        border: `1.5px solid ${active ? 'var(--green)' : 'var(--border)'}`,
        background: active ? 'rgba(122, 255, 161, 0.07)' : 'var(--bg-subtle)',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: active ? 'var(--green)' : 'var(--text)',
          marginBottom: 3,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
    </button>
  )
}
