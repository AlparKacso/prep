// Deterministic parser for the HOLA 2021 questions-only docx.
// Format: paper markers "A" / "B" on their own line, then per question:
//   "N. stem"
//   "\t•\topt"  ×5  (bullet statements)
// Source has NO answers — emits the ai_proposed skeleton; verdicts and
// explanations are filled in manually.
// Usage: node parse-hola-2021.mjs <in.txt> <outFolderSlug> <label>

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

const PAPER = /^([AB])\s*$/
const STEM = /^(\d+)\.\s*(.+?)\s*$/
const BULLET = /^•\s*(.+?)\s*$/
// Fallback for the handful of questions that use "a." letter-dot format
// instead of bullets (e.g. Paper A Q31). Dot is mandatory to avoid false
// positives against bullet text that happens to start with "a ".
const OPT = /^([a-e])\.\s*(.+?)\s*$/i

let paper = null
const questions = []
let cur = null
const seenKey = new Set()
const flush = () => {
  if (!cur) return
  const key = `${cur.paper}-${cur.num}-${cur.stem.slice(0, 40)}`
  if (!seenKey.has(key)) {
    questions.push(cur)
    seenKey.add(key)
  }
  cur = null
}

for (const line of lines) {
  const pm = line.match(PAPER)
  if (pm) {
    flush()
    paper = pm[1]
    continue
  }
  if (!paper) continue
  const sm = line.match(STEM)
  if (sm) {
    flush()
    cur = { paper, num: +sm[1], stem: clean(sm[2]), statements: [] }
    continue
  }
  if (!cur) continue
  const bm = line.match(BULLET)
  if (bm) {
    cur.statements.push({ text: clean(bm[1]) })
    continue
  }
  const om = line.match(OPT)
  if (om) cur.statements.push({ text: clean(om[2]) })
}
flush()

// Disambiguate duplicate numbers (the source has two Q11 in Paper A).
const idSeen = new Map()
for (const q of questions) {
  const base = `${q.paper.toLowerCase()}${q.num}`
  const count = (idSeen.get(base) || 0) + 1
  idSeen.set(base, count)
  q._suffix = count === 1 ? '' : String.fromCharCode(96 + count) // 'b','c',...
}

const out = questions.map((q) => ({
  id: `${slug}-${q.paper.toLowerCase()}${q.num}${q._suffix}`,
  type: 'mtf',
  stem: q.stem,
  source: `${label} · ${q.paper}${q.num}${q._suffix}`,
  explanation: null,
  answerKnown: q.statements.length > 0,
  answerProvenance: 'ai_proposed',
  aiExplanation: true,
  statements: q.statements.map((s) => ({
    text: s.text,
    isCorrect: null,
    explanation: null,
  })),
}))

const outPath = `src/content/${slug}/questions.json`
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n')
const byPaper = out.reduce((a, q) => ((a[q.id.match(/-([ab])\d/)[1]] = (a[q.id.match(/-([ab])\d/)[1]] || 0) + 1), a), {})
console.log(`${slug}: ${out.length} questions → ${outPath}`)
console.log(`  Paper A: ${byPaper.a || 0}, Paper B: ${byPaper.b || 0}`)
console.log(`  questions with 0 statements: ${out.filter((q) => q.statements.length === 0).length}`)
console.log(`  questions with <5 statements: ${out.filter((q) => q.statements.length > 0 && q.statements.length < 5).length}`)
