// Deterministic parser for BARSAC 2024 Pre / Post docs.
// Format: section marker (Part A/B for Pre, Part 1/2 for Post) on its own
// line, then questions as 6 consecutive bullet lines separated by blank
// lines (1 stem + 5 options). No numbering; we assign sequential numbers.
//
// Both docs share the same shape, so this parser is parameterised on
// section markers.
//
// Usage: node parse-bullet-doc.mjs <in.txt> <outFolderSlug> <label> <secAregex> <secBregex>
//   e.g.: node parse-bullet-doc.mjs in.txt barsac-2024-pre "BARSAC 2024 Pre" "^Part A$" "^Part B$"

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const [, , inPath, slug, label, secAre, secBre] = process.argv
if (!inPath || !slug || !label || !secAre || !secBre) {
  console.error('args: <in.txt> <slug> <label> <secAregex> <secBregex>')
  process.exit(1)
}
const SEC_A = new RegExp(secAre, 'i')
const SEC_B = new RegExp(secBre, 'i')

const raw = readFileSync(inPath, 'utf8')
const clean = (s) =>
  s
    .replace(/•/g, '')
    .replace(/ /g, ' ')
    .replace(/[​-‏‪-‮]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const lines = raw.split('\n').map((l) => l.replace(/\t/g, ' ').trim())

// Walk through file. Maintain current section. Collect consecutive bullet
// lines into a buffer; flush on blank/non-bullet boundary.
let section = null
const blocks = []
let buf = []
const flush = () => {
  if (buf.length >= 2 && section) blocks.push({ section, lines: buf.slice() })
  buf = []
}
for (const line of lines) {
  if (SEC_A.test(line)) {
    flush()
    section = 'A'
    continue
  }
  if (SEC_B.test(line)) {
    flush()
    section = 'B'
    continue
  }
  if (line.startsWith('•')) {
    buf.push(clean(line.replace(/^•\s*/, '')))
  } else {
    flush()
  }
}
flush()

// Build questions: 6-bullet blocks → 1 stem + 5 options. Tolerate stray
// short blocks by skipping them.
const questions = []
const counters = { A: 0, B: 0 }
for (const b of blocks) {
  if (b.lines.length < 2) continue
  const stem = b.lines[0]
  const opts = b.lines.slice(1, 6)
  counters[b.section]++
  const num = counters[b.section]
  const paper = b.section.toLowerCase()
  questions.push({
    id: `${slug}-${paper}${num}`,
    type: 'mtf',
    stem,
    source: `${label} · ${b.section}${num}`,
    explanation: null,
    answerKnown: opts.length > 0,
    answerProvenance: 'ai_proposed',
    aiExplanation: true,
    statements: opts.map((t) => ({ text: t, isCorrect: null, explanation: null })),
  })
}

const outPath = `src/content/${slug}/questions.json`
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(questions, null, 2) + '\n')
console.log(`${slug}: ${questions.length} questions → ${outPath}`)
console.log(`  Section A: ${counters.A}, Section B: ${counters.B}`)
console.log(`  questions with <5 statements: ${questions.filter((q) => q.statements.length < 5).length}`)
