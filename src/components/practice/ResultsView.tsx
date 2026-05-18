'use client'

import Link from 'next/link'
import type { AnsweredQuestion, MTFQuestion, MCQQuestion } from '@/types'
import ClaudeCTA from './ClaudeCTA'
import { ProvenanceBadge, shouldOfferClaude } from './Provenance'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export default function ResultsView({
  answered,
  title,
}: {
  answered: AnsweredQuestion[]
  title: string
}) {
  const gradable = answered.filter((a) => a.correct !== null)
  const correct = gradable.filter((a) => a.correct === true).length
  const total = gradable.length
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0
  const passed = pct >= 60
  const ungradable = answered.length - gradable.length

  return (
    <div style={{ maxWidth: 700 }}>
      <div
        className="card"
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          padding: '2.5rem 2rem',
          background: passed ? 'rgba(122, 255, 161, 0.05)' : 'rgba(255, 162, 125, 0.05)',
          borderColor: passed ? 'rgba(122, 255, 161, 0.15)' : 'rgba(255, 162, 125, 0.15)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}
        >
          Session complete · {title}
        </div>
        {total > 0 ? (
          <>
            <div
              style={{
                fontSize: 80,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: passed ? 'var(--green)' : 'var(--coral)',
                marginBottom: 12,
              }}
            >
              {pct}
              <span style={{ fontSize: 36, opacity: 0.5 }}>%</span>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
              <span style={{ color: 'var(--text)', fontWeight: 700 }}>{correct}</span> of{' '}
              <span style={{ color: 'var(--text)', fontWeight: 700 }}>{total}</span> graded
              questions correct
            </div>
          </>
        ) : (
          <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>
            No questions in this session had a recorded answer to grade.
          </div>
        )}
        {ungradable > 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
            {ungradable} question{ungradable !== 1 ? 's' : ''} had no recorded answer —
            use the Claude prompt below.
          </div>
        )}
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
        Breakdown
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {answered.map((a, idx) => {
          const q = a.question
          const ungraded = a.correct === null
          const color = ungraded
            ? 'var(--lavender)'
            : a.correct
              ? 'var(--green)'
              : 'var(--coral)'
          return (
            <div key={q.id} className="card" style={{ padding: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '0.875rem',
                }}
              >
                <div style={{ fontSize: 13, lineHeight: 1.6, flex: 1, fontWeight: 500 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{idx + 1}. </span>
                  {q.stem}
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    padding: '0.25rem 0.7rem',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
                    color,
                    background: `${color}1f`,
                  }}
                >
                  {ungraded ? 'Not graded' : a.correct ? 'Correct' : 'Wrong'}
                </div>
              </div>

              {q.type === 'mtf' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {(q as MTFQuestion).statements.map((s, i) => {
                    const mine = a.mtfAnswers?.[i]
                    const right = s.isCorrect
                    const ok = right !== null && mine === right
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: '0.6rem',
                          alignItems: 'flex-start',
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          lineHeight: 1.55,
                        }}
                      >
                        <span style={{ flexShrink: 0, fontWeight: 700, color: 'var(--text-dim)' }}>
                          {i + 1}.
                        </span>
                        <span style={{ flex: 1 }}>{s.text}</span>
                        <span style={{ flexShrink: 0, fontWeight: 700 }}>
                          You: {mine === true ? 'T' : mine === false ? 'F' : '–'}
                          {right !== null && (
                            <>
                              {' '}
                              · Ans:{' '}
                              <span style={{ color: ok ? 'var(--green)' : 'var(--coral)' }}>
                                {right ? 'T' : 'F'}
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {q.type === 'mcq' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  {(q as MCQQuestion).options.map((o, i) => {
                    const chosen = a.mcqAnswer === i
                    const isAns = (q as MCQQuestion).correctIndex === i
                    return (
                      <div
                        key={i}
                        style={{
                          fontSize: 12,
                          lineHeight: 1.55,
                          color: isAns
                            ? 'var(--green)'
                            : chosen
                              ? 'var(--coral)'
                              : 'var(--text-muted)',
                          fontWeight: isAns || chosen ? 700 : 500,
                        }}
                      >
                        {LETTERS[i]}. {o.text}
                        {chosen && ' ← your answer'}
                        {isAns && ' ✓'}
                      </div>
                    )
                  })}
                </div>
              )}

              <div
                style={{
                  marginTop: '0.875rem',
                  paddingTop: '0.875rem',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <ProvenanceBadge q={q} />
                {q.explanation && (
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--text-muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    {q.explanation}
                  </p>
                )}
                {shouldOfferClaude(q) && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <ClaudeCTA answered={a} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <Link href="/dashboard" className="btn btn-ghost">
          ← Home
        </Link>
        <Link href="/dashboard" className="btn btn-primary">
          Practice again →
        </Link>
      </div>
    </div>
  )
}
