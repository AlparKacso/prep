// Deterministic parser for BARSAC "Pre" docx (textutil txt output).
// Part A solved format:
//   A.1: <stem>
//     • a) <opt> ... • e) <opt>
//   Solution:
//     • A - True. <expl> ... • E - False. <expl>
//   [Note: ...] [Rationale: <text>]
// Part B solved format (different — single option line, colon-style answers):
//   B.1: <stem>
//   a) <opt> b) <opt> c) <opt> d) <opt> e) <opt>
//   Solution:
//     • A: True - <expl> ... • E: False - <expl>
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
// Part B answer bullet: "A: True - <expl>" (colon, then dash).
const SOLBULLET_B = /^\s*[••\-\s]*([A-E]):\s*(True|False)\b\.?\s*[-–—]?\s*(.*)$/i
// Part B bullet where the source could not give a true/false (truncated text):
// "B: [Unable to answer ...] - <expl>" → isCorrect null.
const SOLBULLET_B_UNK = /^\s*[••\-\s]*([A-E]):\s*(.+)$/

// Split a Part B one-line option list ("a) ... b) ... e) ...") into a-e.
// Markers are required to appear in order so stray "x)" inside option text
// cannot be mistaken for the next option.
function splitOptionsB(line) {
  const letters = ['a', 'b', 'c', 'd', 'e']
  const markStart = {}
  const markEnd = {}
  let from = 0
  for (let i = 0; i < 5; i++) {
    const L = letters[i]
    const re = i === 0 ? /a\)/ : new RegExp('(?:^|\\s)' + L + '\\)')
    const sub = line.slice(from)
    const m = sub.match(re)
    if (!m) continue
    const close = from + m.index + m[0].length
    markStart[L] = from + m.index + (i === 0 ? 0 : m[0].length - 2)
    markEnd[L] = close
    from = close
  }
  const present = letters.filter((L) => markEnd[L] !== undefined)
  const out = {}
  for (let i = 0; i < present.length; i++) {
    const L = present[i]
    const next = present[i + 1]
    const end = next ? markStart[next] : line.length
    // Strip a leading source-citation artifact like "[source > 51]".
    out[L] = clean(line.slice(markEnd[L], end)).replace(/^\[[^\]]*\]\s*/, '')
  }
  return out
}

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

function parseBlockB(b, solIdx) {
  // Option line: first line before "Solution:" that begins with "a)".
  let optLine = null
  const noteParts = []
  for (const l of b.body.slice(0, solIdx)) {
    const c = clean(l)
    if (!optLine && /^a\)/.test(c)) optLine = c
    const note = c.match(NOTE)
    if (note && note[1].trim()) noteParts.push('Note: ' + clean(note[1]))
  }
  const opts = optLine ? splitOptionsB(optLine) : {}

  // Answer bullets after "Solution:", then optional Rationale paragraphs.
  const ans = {}
  const rationaleParts = []
  let mode = 'sol'
  for (const l of b.body.slice(solIdx + 1)) {
    const sb = l.match(SOLBULLET_B)
    const unk = !sb && l.match(SOLBULLET_B_UNK)
    const rat = l.match(RATIONALE)
    const note = l.match(NOTE)
    const h = l.match(HEADER)
    if (h && !sb && !unk) break // safety: next question header
    if (sb && mode === 'sol') {
      ans[sb[1].toUpperCase()] = {
        isCorrect: /true/i.test(sb[2]),
        explanation: clean(sb[3]) || null,
      }
    } else if (unk && mode === 'sol') {
      // No true/false in the source (truncated statement). Keep the
      // statement but mark the answer unknown.
      const expl = clean(unk[2]).replace(/^\[[^\]]*\]\s*[-–—]?\s*/, '')
      ans[unk[1].toUpperCase()] = {
        isCorrect: null,
        explanation: expl || null,
      }
    } else if (rat) {
      mode = 'rat'
      if (rat[1].trim()) rationaleParts.push(clean(rat[1]))
    } else if (note) {
      if (note[1].trim()) rationaleParts.push('Note: ' + clean(note[1]))
    } else if (mode === 'rat') {
      const c = clean(l)
      if (c) rationaleParts.push(c)
    }
  }

  const statements = []
  for (const L of ['A', 'B', 'C', 'D', 'E']) {
    const a = ans[L]
    if (!a) continue // letter absent from source solution → skip
    const txt = opts[L.toLowerCase()]
    statements.push({
      text: txt && txt.length ? txt : '(statement text missing from source)',
      isCorrect: a.isCorrect,
      explanation: a.explanation,
    })
  }
  if (statements.length === 0) return null

  const explanation = [...noteParts, ...rationaleParts]
  return {
    id: `${slug}-${b.id.toLowerCase()}`,
    type: 'mtf',
    stem: clean(b.stem),
    source: `${label} · ${b.id}`,
    explanation: explanation.length ? explanation.join(' ') : null,
    answerKnown: true,
    answerProvenance: 'official',
    aiExplanation: false,
    statements,
  }
}

const questions = []
for (const b of blocks) {
  const solIdx = b.body.findIndex((l) => SOL.test(l))
  if (solIdx === -1) continue // question-only listing → skip

  // ── Part B: single option line + colon-style answer bullets ──
  if (b.paper === 'B') {
    const q = parseBlockB(b, solIdx)
    if (q) questions.push(q)
    continue
  }

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
