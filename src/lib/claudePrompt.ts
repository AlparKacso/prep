import type { AnsweredQuestion, MTFQuestion, MCQQuestion } from '@/types'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

/**
 * Build a self-contained prompt the user can paste straight into the Claude
 * app to get an explanation, used when the question has no stored answer or
 * explanation. Includes context, the full question, and her answer.
 */
export function buildClaudePrompt(a: AnsweredQuestion): string {
  const q = a.question
  const lines: string[] = []

  lines.push(
    'This is a practice question for the EDAIC Part I anaesthesia exam. ' +
      'I need you to tell me whether my answer is correct or wrong, give the ' +
      'correct answer, and explain the reasoning concisely and clinically.'
  )
  lines.push('')
  lines.push(`QUESTION (${q.type.toUpperCase()}):`)
  lines.push(q.stem)
  lines.push('')

  if (q.type === 'mtf') {
    const mtf = q as MTFQuestion
    const answers = a.mtfAnswers ?? []
    mtf.statements.forEach((s, i) => {
      const mine = answers[i]
      const mineLabel = mine === true ? 'TRUE' : mine === false ? 'FALSE' : 'no answer'
      lines.push(`${i + 1}. ${s.text}`)
      lines.push(`   My answer: ${mineLabel}`)
    })
  } else {
    const mcq = q as MCQQuestion
    mcq.options.forEach((o, i) => {
      lines.push(`${LETTERS[i]}. ${o.text}`)
    })
    const chosen = a.mcqAnswer
    const chosenLabel =
      chosen != null && chosen >= 0 ? LETTERS[chosen] : 'no answer'
    lines.push('')
    lines.push(`My answer: ${chosenLabel}`)
  }

  lines.push('')
  lines.push(
    'Please reply with: (1) whether I was correct, (2) the correct answer, ' +
      '(3) a brief explanation.'
  )

  return lines.join('\n')
}
