// ─────────────────────────────────────────
// Question bank — file-based, mixed format
// ─────────────────────────────────────────

export type QuestionType = 'mtf' | 'mcq'

/** When the feedback is shown */
export type FeedbackTiming = 'each' | 'end'

/** Where questions are drawn from */
export type PracticeSource = 'all' | 'missed'

/** Order questions are presented in */
export type PracticeOrder = 'sequential' | 'random'

export interface MTFStatement {
  text: string
  /** null = the source doc has no answer for this statement */
  isCorrect: boolean | null
  explanation?: string | null
}

export interface MCQOption {
  text: string
}

/** Where a question's correct answers came from */
export type AnswerProvenance =
  | 'official' // source doc supplied a worked solution / official key
  | 'key' // a handwritten / printed answer-key listed the correct letters
  | 'ai_proposed' // no answer in the source — proposed by AI, must be verified

interface BaseQuestion {
  id: string
  folder: string
  type: QuestionType
  stem: string
  /** Originating doc / page reference, if known */
  source?: string | null
  /** Question-level explanation, if available (official or AI-written) */
  explanation?: string | null
  /** false → no answer at all (Claude CTA instead of grading) */
  answerKnown: boolean
  /** Trust level of the correct answers */
  answerProvenance: AnswerProvenance
  /** true → the explanation text was written by AI, not the source */
  aiExplanation?: boolean
}

export interface MTFQuestion extends BaseQuestion {
  type: 'mtf'
  statements: MTFStatement[]
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq'
  options: MCQOption[]
  /** null = no answer in the source yet */
  correctIndex: number | null
}

export type PrepQuestion = MTFQuestion | MCQQuestion

export interface FolderSummary {
  /** slug / directory name */
  name: string
  /** human label */
  label: string
  count: number
}

// ─────────────────────────────────────────
// Practice run config (carried via query string)
// ─────────────────────────────────────────

export interface PracticeConfig {
  folders: string[] // empty = all folders
  order: PracticeOrder
  batch: number | null // null = all
  feedback: FeedbackTiming
  source: PracticeSource
}

// ─────────────────────────────────────────
// In-memory answer tracking (no server)
// ─────────────────────────────────────────

/** A user's answer to one question, computed entirely client-side */
export interface AnsweredQuestion {
  question: PrepQuestion
  /** MTF: index→boolean per statement. MCQ: chosen option index */
  mtfAnswers?: (boolean | null)[]
  mcqAnswer?: number | null
  /** null = ungradable (answerKnown === false) */
  correct: boolean | null
}
