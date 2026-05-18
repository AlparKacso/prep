'use client'

// Browser-only "review missed" memory. No accounts, no server — this device only.

const MISSED_KEY = 'prep:missed'

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(MISSED_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function write(set: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(MISSED_KEY, JSON.stringify([...set]))
  } catch {
    /* storage unavailable — degrade silently */
  }
}

export function getMissedIds(): string[] {
  return [...read()]
}

export function missedCount(): number {
  return read().size
}

/**
 * Record the outcome of a graded question. A wrong answer adds the id to the
 * missed set; answering it correctly later clears it. Ungradable questions
 * (no recorded answer) pass `correct = null` and are not tracked.
 */
export function recordResult(questionId: string, correct: boolean | null): void {
  if (correct === null) return
  const set = read()
  if (correct) set.delete(questionId)
  else set.add(questionId)
  write(set)
}

export function clearAllMissed(): void {
  write(new Set())
}
