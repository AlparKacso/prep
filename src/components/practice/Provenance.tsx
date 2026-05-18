import type { PrepQuestion } from '@/types'

/** Small trust badge shown whenever a question's answer/explanation is not
 *  from an official key — so she always knows what to double-check. */
export function ProvenanceBadge({ q }: { q: PrepQuestion }) {
  const aiAnswer = q.answerProvenance === 'ai_proposed'
  const aiExpl = !!q.aiExplanation
  if (!aiAnswer && !aiExpl) return null

  const label = aiAnswer
    ? 'AI-proposed answer — verify'
    : 'AI-written explanation — verify'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        color: 'var(--warning)',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: 999,
        padding: '0.2rem 0.6rem',
        marginBottom: 10,
      }}
    >
      ⚠ {label}
    </div>
  )
}

/** True if the question carries any explanation — a question-level one OR
 *  per-statement explanations on an MTF question. */
export function hasAnyExplanation(q: PrepQuestion): boolean {
  if (q.explanation) return true
  if (q.type === 'mtf') return q.statements.some((s) => !!s.explanation)
  return false
}

/** Whether the "Explain / verify with Claude" CTA should be offered:
 *  no explanation anywhere, OR the answer/explanation is AI-generated. */
export function shouldOfferClaude(q: PrepQuestion): boolean {
  return (
    !hasAnyExplanation(q) ||
    q.answerProvenance === 'ai_proposed' ||
    !!q.aiExplanation
  )
}
