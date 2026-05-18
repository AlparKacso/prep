'use client'

import { useState } from 'react'
import type {
  PrepQuestion,
  MTFQuestion,
  MCQQuestion,
  FeedbackTiming,
  AnsweredQuestion,
} from '@/types'
import { recordResult } from '@/lib/progress'
import ResultsView from './ResultsView'
import ClaudeCTA from './ClaudeCTA'
import { ProvenanceBadge, shouldOfferClaude } from './Provenance'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

interface Props {
  questions: PrepQuestion[]
  feedback: FeedbackTiming
  title: string
}

export default function PracticeClient({ questions, feedback, title }: Props) {
  const isEach = feedback === 'each'

  const [index, setIndex] = useState(0)
  const [answeredList, setAnsweredList] = useState<AnsweredQuestion[]>([])
  const [finished, setFinished] = useState(false)

  // current-question working state
  const [mtfAns, setMtfAns] = useState<(boolean | null)[]>([])
  const [mcqAns, setMcqAns] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [current, setCurrent] = useState<AnsweredQuestion | null>(null)

  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: 560, margin: '4rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            No questions match this selection.
          </p>
          <a href="/dashboard" className="btn btn-primary">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  if (finished) {
    return <ResultsView answered={answeredList} title={title} />
  }

  const q = questions[index]
  const isLast = index === questions.length - 1
  const progressPct = ((index + (checked ? 1 : 0)) / questions.length) * 100

  // statements length for MTF
  const mtf = q.type === 'mtf' ? (q as MTFQuestion) : null
  const mcq = q.type === 'mcq' ? (q as MCQQuestion) : null

  const allAnswered = mtf
    ? mtf.statements.length > 0 &&
      mtf.statements.every((_, i) => mtfAns[i] === true || mtfAns[i] === false)
    : mcqAns !== null

  const grade = (): AnsweredQuestion => {
    if (mtf) {
      const gradable =
        q.answerKnown && mtf.statements.every((s) => s.isCorrect !== null)
      const correct = gradable
        ? mtf.statements.every((s, i) => mtfAns[i] === s.isCorrect)
        : null
      return { question: q, mtfAnswers: [...mtfAns], correct }
    }
    const gradable = q.answerKnown && mcq!.correctIndex !== null
    const correct = gradable ? mcqAns === mcq!.correctIndex : null
    return { question: q, mcqAnswer: mcqAns, correct }
  }

  const commit = (a: AnsweredQuestion) => {
    setAnsweredList((prev) => [...prev, a])
    recordResult(q.id, a.correct)
  }

  const advance = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setMtfAns([])
    setMcqAns(null)
    setChecked(false)
    setCurrent(null)
  }

  // "each" mode: Check grades + reveals; then Next
  const handleCheck = () => {
    if (!allAnswered) return
    const a = grade()
    commit(a)
    setCurrent(a)
    setChecked(true)
  }

  // "end" mode: grade silently and move on
  const handleNextEnd = () => {
    if (!allAnswered) return
    commit(grade())
    advance()
  }

  const setStatement = (i: number, val: boolean) => {
    if (checked) return
    setMtfAns((prev) => {
      const next = [...prev]
      next[i] = val
      return next
    })
  }

  const showFeedback = isEach && checked

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.875rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
              Question <span style={{ color: 'var(--green)' }}>{index + 1}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: 16 }}>
                {' '}
                / {questions.length}
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '0.2rem 0.5rem',
              borderRadius: 6,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            {q.type} · {isEach ? 'Feedback each' : 'Feedback at end'}
          </span>
        </div>
        <div className="progress-bar" style={{ height: 5 }}>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Stem */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}
        >
          {q.folder}
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.75, fontWeight: 500 }}>{q.stem}</p>
      </div>

      {/* MTF statements */}
      {mtf && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {mtf.statements.map((s, i) => {
            const ua = mtfAns[i]
            const reveal = showFeedback && s.isCorrect !== null
            const isCorrect = reveal && ua === s.isCorrect
            const isWrong = reveal && ua !== s.isCorrect
            let rowClass = 'statement-row'
            if (reveal) rowClass += isCorrect ? ' correct' : ' incorrect'
            else if (ua === true) rowClass += ' selected-true'
            else if (ua === false) rowClass += ' selected-false'

            return (
              <div key={i} className={rowClass}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.375rem',
                    flexShrink: 0,
                    paddingTop: 1,
                  }}
                >
                  <button
                    className={`tf-btn ${!checked && ua === true ? 'active-true' : ''}`}
                    onClick={() => setStatement(i, true)}
                    disabled={checked}
                  >
                    T
                  </button>
                  <button
                    className={`tf-btn ${!checked && ua === false ? 'active-false' : ''}`}
                    onClick={() => setStatement(i, false)}
                    disabled={checked}
                  >
                    F
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.65, fontWeight: 500 }}>{s.text}</div>
                  {reveal && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          color: s.isCorrect ? 'var(--green)' : 'var(--coral)',
                          marginRight: 8,
                        }}
                      >
                        {s.isCorrect ? 'TRUE' : 'FALSE'}
                      </span>
                      {s.explanation && (
                        <span
                          style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}
                        >
                          {s.explanation}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {showFeedback && s.isCorrect !== null && (
                  <div style={{ flexShrink: 0, paddingTop: 2, fontSize: 16 }}>
                    {isCorrect ? (
                      <span style={{ color: 'var(--green)' }}>✓</span>
                    ) : (
                      <span style={{ color: 'var(--coral)' }}>✗</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* MCQ options */}
      {mcq && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {mcq.options.map((o, i) => {
            const chosen = mcqAns === i
            const reveal = showFeedback && mcq.correctIndex !== null
            const isAns = reveal && mcq.correctIndex === i
            const isWrongChoice = reveal && chosen && mcq.correctIndex !== i
            let rowClass = 'statement-row'
            if (isAns) rowClass += ' correct'
            else if (isWrongChoice) rowClass += ' incorrect'
            else if (chosen && !showFeedback) rowClass += ' selected-true'

            return (
              <button
                key={i}
                className={rowClass}
                onClick={() => !checked && setMcqAns(i)}
                disabled={checked}
                style={{
                  textAlign: 'left',
                  cursor: checked ? 'default' : 'pointer',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    borderRadius: 7,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    background: chosen ? 'var(--green)' : 'var(--bg-subtle)',
                    color: chosen ? '#0A0C16' : 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {LETTERS[i]}
                </div>
                <div style={{ flex: 1, fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>
                  {o.text}
                </div>
                {reveal && isAns && <span style={{ color: 'var(--green)' }}>✓</span>}
                {isWrongChoice && <span style={{ color: 'var(--coral)' }}>✗</span>}
              </button>
            )
          })}
        </div>
      )}

      {/* Feedback (each mode, after check) */}
      {showFeedback && current && (
        <>
          {current.correct === null && (
            <div
              style={{
                fontSize: 12,
                color: 'var(--lavender)',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              No recorded answer for this question — not graded.
            </div>
          )}
          <ProvenanceBadge q={q} />
          {q.explanation && (
            <div
              className="card"
              style={{
                marginBottom: '1.25rem',
                background: 'rgba(221, 203, 245, 0.06)',
                borderColor: 'rgba(221, 203, 245, 0.15)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--lavender)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 6,
                }}
              >
                Explanation
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {q.explanation}
              </p>
            </div>
          )}
          {shouldOfferClaude(q) && <ClaudeCTA answered={current} />}
        </>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isEach && !checked ? (
          <button
            className="btn btn-primary"
            onClick={handleCheck}
            disabled={!allAnswered}
            style={{ minWidth: 120, height: 44, fontSize: 14 }}
          >
            Check
          </button>
        ) : isEach && checked ? (
          <button
            className="btn btn-primary"
            onClick={advance}
            style={{ minWidth: 160, height: 44, fontSize: 14 }}
          >
            {isLast ? 'Finish →' : 'Next Question →'}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNextEnd}
            disabled={!allAnswered}
            style={{ minWidth: 160, height: 44, fontSize: 14 }}
          >
            {isLast ? 'Finish →' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  )
}
