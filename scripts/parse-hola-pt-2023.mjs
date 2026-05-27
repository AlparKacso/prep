// Tolerant parser for HOLA Portugalia 2023 (translated, no answers).
// Stem formats vary: "N. stem", "N stem" (no period), bulleted ("•  stem"
// for the few that were transcribed without a number). Options use the
// "a) text" form, often with multiple options run together on one line.
//
// Usage: node parse-hola-pt-2023.mjs <in.txt> <slug> <label>

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const [, , inPath, slug, label] = process.argv
const raw = readFileSync(inPath, 'utf8')

const clean = (s) =>
  s
    .replace(/ /g, ' ')
    .replace(/[​-‏‪-‮]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const lines = raw.split('\n').map((l) => l.replace(/\t/g, ' ').trim())

// A numeric-stem line: digits, optional period, optional whitespace, then
// text starting with a letter. Tolerates "4.Regarding" (no space after dot)
// and "7 stem" (no dot).
const NUM_STEM = /^(\d+)\.?\s*([A-Za-z].+?)\s*$/
// A bullet-only stem (the source uses the • glyph after a tab).
const BULLET_STEM = /^•\s*([A-Za-z].+?)\s*$/
// Option marker(s) — possibly several on a single line.
const OPT_MARKER = /\b([a-e])\)\s*/gi

let lastNum = 0
const questions = []
let cur = null
const flush = () => {
  if (cur) questions.push(cur)
  cur = null
}

function pushOptionsLine(line) {
  // Split a line on a-e markers, preserving order. Strip stray single
  // capital letters between options (e.g. "(VD/VT) F b)" → drop "F").
  const marks = [...line.matchAll(OPT_MARKER)]
  if (!marks.length) return
  for (let i = 0; i < marks.length; i++) {
    const m = marks[i]
    const start = m.index + m[0].length
    const end = i + 1 < marks.length ? marks[i + 1].index : line.length
    let text = clean(line.slice(start, end))
    // Remove a trailing "F" or "T" letter that was an embedded T/F marker.
    text = text.replace(/\s+[FT]\s*$/, '').trim()
    if (cur) cur.statements.push({ text, isCorrect: null, explanation: null })
  }
}

for (const line of lines) {
  if (!line) continue
  // Header lines: "HOLA 2023" etc. Skip if no letter ‘starting’ pattern.
  if (/^HOLA\b/i.test(line)) continue

  // Try option first if line begins with "a-e)" — but a stem could also
  // have "(SVR) a) ..." (run-on with stem). We resolve by: if line begins
  // with `[a-e])`, it's purely options.
  if (/^[a-e]\)/i.test(line)) {
    pushOptionsLine(line)
    continue
  }

  const ns = line.match(NUM_STEM)
  const bs = line.match(BULLET_STEM)

  if (ns) {
    flush()
    lastNum = +ns[1]
    // Split out any inline "a) ..." options on the same line.
    const text = ns[2]
    const m = text.match(/\b[a-e]\)/i)
    if (m) {
      cur = newQuestion(lastNum, clean(text.slice(0, m.index)))
      pushOptionsLine(text.slice(m.index))
    } else {
      cur = newQuestion(lastNum, clean(text))
    }
    continue
  }
  if (bs) {
    flush()
    lastNum += 1
    cur = newQuestion(lastNum, clean(bs[1]))
    continue
  }

  // A line that contains options later (run-on stem + first option).
  // Rare; not the case in this doc — but handle defensively.
  if (cur && /\b[a-e]\)/.test(line)) {
    pushOptionsLine(line)
  }
}
flush()

function newQuestion(num, stem) {
  return {
    id: `${slug}-${num}`,
    type: 'mtf',
    stem,
    source: `${label} · Q${num}`,
    explanation: null,
    answerKnown: true,
    answerProvenance: 'ai_proposed',
    aiExplanation: true,
    statements: [],
  }
}

// Mark stem-only questions
for (const q of questions) {
  if (q.statements.length === 0) q.answerKnown = false
}

const outPath = `src/content/${slug}/questions.json`
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(questions, null, 2) + '\n')
console.log(`${slug}: ${questions.length} questions → ${outPath}`)
console.log(`  q with 0 statements: ${questions.filter((q) => q.statements.length === 0).length}`)
console.log(`  q with <5 statements: ${questions.filter((q) => q.statements.length > 0 && q.statements.length < 5).length}`)
