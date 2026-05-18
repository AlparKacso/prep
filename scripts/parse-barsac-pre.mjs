// Deterministic parser for BARSAC "Pre" docx (textutil txt output).
// Format per solved question:
//   A.1: <stem>
//     • a) <opt> ... • e) <opt>
//   Solution:
//     • A - True. <expl> ... • E - False. <expl>
//   [Note: ...] [Rationale: <text>]
// Usage: node parse-barsac-pre.mjs <in.txt> <outFolderSlug> <label>

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const [, , inPath, slug, label] = process.argv
const raw = readFileSync(inPath, 'utf8')

// Normalise: strip bullet glyphs / NBSP / trailing control whitespace.
const clean = (s) =>
  s
    .replace(/•/g, '')
    .replace(/ /g, ' ')
    .replace(/[​-‏‪-‮]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const lines = raw.split('\n').map((l) => l.replace(/\t/g, ' '))

const HEADER = /^\s*([A-Z])\.(\d+):\s*(.*)$/ // flush-left question id
const OPT = /^\s*[••\-\s]*([a-e])\)\s*(.+)$/i
const SOL = /^\s*Solution:\s*$/i
const SOLBULLET = /^\s*[••\-\s]*([A-E])\s*[-–—]\s*(True|False)\b\.?\s*(.*)$/i
const RATIONALE = /^\s*Rationale:\s*(.*)$/i
const NOTE = /^\s*Note:\s*(.*)$/i

// Split into blocks at header lines.
const blocks = []
let cur = null
for (const line of lines) {
  const h = line.match(HEADER)
  // A header line must not itself be an option/solution bullet.
  if (h && !OPT.test(line) && !SOLBULLET.test(line)) {
    if (cur) blocks.push(cur)
    cur = { id: `${h[1]}.${h[2]}`, paper: h[1], num: +h[2], stem: h[3], body: [] }
  } else if (cur) {
    cur.body.push(line)
  }
}
if (cur) blocks.push(cur)

const questions = []
for (const b of blocks) {
  const solIdx = b.body.findIndex((l) => SOL.test(l))
  if (solIdx === -1) continue // question-only listing → skip

  // Options: a)-e) lines before Solution:
  const opts = []
  for (const l of b.body.slice(0, solIdx)) {
    const m = l.match(OPT)
    if (m) opts.push(clean(m[2]))
  }

  // Solution bullets after Solution:
  const ans = []
  let rationaleParts = []
  let mode = 'sol'
  for (const l of b.body.slice(solIdx + 1)) {
    const sb = l.match(SOLBULLET)
    const rat = l.match(RATIONALE)
    const note = l.match(NOTE)
    if (sb && mode === 'sol') {
      ans.push({
        letter: sb[1].toUpperCase(),
        isCorrect: /true/i.test(sb[2]),
        explanation: clean(sb[3]) || null,
      })
    } else if (rat) {
      mode = 'rat'
      if (rat[1].trim()) rationaleParts.push(clean(rat[1]))
    } else if (note) {
      // fold notes into rationale context
      if (note[1].trim()) rationaleParts.push('Note: ' + clean(note[1]))
    } else if (mode === 'rat') {
      const c = clean(l)
      if (c) rationaleParts.push(c)
    }
  }

  if (opts.length === 0 || ans.length === 0) continue

  const n = Math.min(opts.length, ans.length)
  const statements = []
  for (let i = 0; i < n; i++) {
    statements.push({
      text: opts[i],
      isCorrect: ans[i].isCorrect,
      explanation: ans[i].explanation,
    })
  }

  questions.push({
    id: `${slug}-${b.id.toLowerCase()}`,
    type: 'mtf',
    stem: clean(b.stem),
    source: `${label} · ${b.id}`,
    explanation: rationaleParts.length ? rationaleParts.join(' ') : null,
    answerKnown: true,
    answerProvenance: 'official',
    aiExplanation: false,
    statements,
  })
}

const outPath = `src/content/${slug}/questions.json`
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(questions, null, 2) + '\n')
console.log(`${slug}: ${questions.length} questions → ${outPath}`)
const incomplete = questions.filter((q) => q.statements.length !== 5).length
console.log(`  (questions without exactly 5 statements: ${incomplete})`)
