import type { PrepQuestion, PracticeConfig } from '@/types'
import { ALL_QUESTIONS, FOLDERS } from '@/content'

export { FOLDERS }

export function totalQuestionCount(): number {
  return ALL_QUESTIONS.length
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Resolve a practice run to a concrete, ordered list of questions.
 * `missedIds` comes from the client (localStorage) — the server has no state.
 */
export function selectQuestions(
  config: PracticeConfig,
  missedIds: string[] = []
): PrepQuestion[] {
  let pool = ALL_QUESTIONS

  if (config.folders.length > 0) {
    const set = new Set(config.folders)
    pool = pool.filter((q) => set.has(q.folder))
  }

  if (config.source === 'missed') {
    const set = new Set(missedIds)
    pool = pool.filter((q) => set.has(q.id))
  }

  const ordered = config.order === 'random' ? shuffle(pool) : pool

  return config.batch != null ? ordered.slice(0, config.batch) : ordered
}

/** Parse the practice query string into a typed config. */
export function parsePracticeConfig(sp: Record<string, string | undefined>): PracticeConfig {
  const folders = sp.folders ? sp.folders.split(',').filter(Boolean) : []
  const order = sp.order === 'sequential' ? 'sequential' : 'random'
  const batchNum = sp.batch ? parseInt(sp.batch, 10) : NaN
  const batch = Number.isFinite(batchNum) && batchNum > 0 ? batchNum : null
  const feedback = sp.feedback === 'end' ? 'end' : 'each'
  const source = sp.source === 'missed' ? 'missed' : 'all'
  return { folders, order, batch, feedback, source }
}
