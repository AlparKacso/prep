// Deterministic parser for the EDAIC 2020 questions-only docx.
// Format: paper markers "A" / "B" on their own line, then per question:
//   "N.  stem"     (digits + dot)
//   "a. opt"  /  "b opt"  /  "cOpt"   (letter then ., space, or uppercase-lookahead)
// Source has NO answers — output goes to the ai_proposed pipeline so the
// statement texts have isCorrect:null + null explanations. Question-level
// + per-statement AI proposals are filled in manually.
// Usage: node parse-edaic-2020.mjs <in.txt> <outFolderSlug> <label>

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const [, , inPath, slug, label] = process.argv
const raw = readFileSync(inPath, 'utf8')

const clean = (s) =>
  s
    .replace(/•/g, '')
    .replace(/ /g, ' ')
    .replace(/[​-‏‪-‮]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const lines = raw.split('\n').map((l) => l.replace(/\t/g, ' ').trim())

const PAPER = /^([AB])\s*$/
// Question headers: number, optional period, whitespace, then a capital
// letter starting the stem. Required capital letter avoids false matches
// like "10% phenylephrine drops" (no space after %) but most importantly
// catches sloppy headers like "9 Patient..." that omit the period.
// Question headers: number, optional period, optional whitespace, then a
// capital letter starting the stem. The capital-letter constraint avoids
// false matches like "10% phenylephrine" while tolerating common typos:
//   "9 Patient..." (no period), "10.Anatomical..." (no space).
const STEM = /^(\d+)\.?\s*([A-Z].+?)\s*$/
// option: a-e then '.' OR whitespace OR uppercase-lookahead (handles "cMedial")
const OPT = /^([a-e])(?:\.\s*|\s+|(?=[A-Z]))(.+?)\s*$/

let paper = null
const questions = []
let cur = null
const flush = () => {
  if (!cur) return
  questions.push(cur)
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
    cur = {
      paper,
      num: +sm[1],
      stem: clean(sm[2]),
      statements: [],
    }
    continue
  }
  if (!cur) continue
  const om = line.match(OPT)
  if (om) {
    // Handle the rare run-on like "d. foo e. bar" on a single line.
    const text = om[2]
    const inline = [...text.matchAll(/\s+([a-e])\.\s+/gi)]
    if (inline.length) {
      const first = clean(text.slice(0, inline[0].index))
      cur.statements.push({ letter: om[1], text: first })
      for (let i = 0; i < inline.length; i++) {
        const start = inline[i].index + inline[i][0].length
        const end = i + 1 < inline.length ? inline[i + 1].index : text.length
        cur.statements.push({
          letter: inline[i][1],
          text: clean(text.slice(start, end)),
        })
      }
    } else {
      cur.statements.push({ letter: om[1], text: clean(text) })
    }
  }
}
flush()

// Emit skeleton with placeholder verdicts; aiExplanation step fills them.
const out = questions.map((q) => ({
  id: `${slug}-${q.paper.toLowerCase()}${q.num}`,
  type: 'mtf',
  stem: q.stem,
  source: `${label} · ${q.paper}${q.num}`,
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
