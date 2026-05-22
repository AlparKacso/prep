// Deterministic parser for the BARSAC "Post" docx (textutil txt output).
//
// Part A — official solution, but split across two sections:
//   Listing  ("Part A - Questions 1-30"): "N. stem" + 5 lines "a) <opt>" .. "e)"
//   Solved   (bare "Part A" marker):      "N. stem" + 5 lines "<L>. <T/F> <expl>"
//   (no statement text in the solved block, so the two are merged by number)
//
// Part B — official solution, self-contained block (bare "Part B" marker):
//   "N. stem" + 5 lines "<L>. <statement> <True|False>. <explanation>"
//
// Usage: node parse-barsac-post.mjs <in.txt> <outFolderSlug> <label>

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

const STEM = /^(\d+)\.\s+(.+)$/
const OPT = /^([a-e])\)\s+(.+)$/i
const ANS_A = /^([A-E])\.\s+(True|False)\b\.?\s*(.*)$/i // text-less Part A answer
const SOLVED_B = /^([A-E])\.\s+(.+?)\s*(True|False)\.\s*(.*)$/i

const idxOf = (re) => lines.findIndex((l) => re.test(l))

// ── Part A ──────────────────────────────────────────────────────────
const listingAStart = idxOf(/^Part A - Questions/i)
const listingBStart = idxOf(/^Part B - Questions/i)
const solvedAStart = idxOf(/^Part A\s*$/i)
const solvedBStart = idxOf(/^Part B\s*$/i)

// Listing → option text per question number.
const optionsByNum = {}
{
  let num = null
  for (const line of lines.slice(listingAStart + 1, listingBStart)) {
    const sm = line.match(STEM)
    const om = line.match(OPT)
    if (om && num !== null) {
      optionsByNum[num].push(clean(om[2]))
    } else if (sm) {
      num = +sm[1]
      optionsByNum[num] = []
    }
  }
}

// Solved → True/False + explanation per question number.
const answersByNum = {}
{
  let num = null
  for (const line of lines.slice(solvedAStart + 1, solvedBStart)) {
    const am = line.match(ANS_A)
    const sm = line.match(STEM)
    if (am && num !== null) {
      answersByNum[num].push({
        isCorrect: /true/i.test(am[2]),
        explanation: clean(am[3]) || null,
      })
    } else if (sm) {
      num = +sm[1]
      answersByNum[num] = []
    }
  }
}

const partA = []
for (const num of Object.keys(optionsByNum).map(Number).sort((a, b) => a - b)) {
  const opts = optionsByNum[num] || []
  const ans = answersByNum[num] || []
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
  partA.push({
    id: `${slug}-a${num}`,
    type: 'mtf',
    stem: clean(stemForNum(num)),
    source: `${label} · A${num}`,
    explanation: null,
    answerKnown: true,
    answerProvenance: 'official',
    aiExplanation: false,
    statements,
  })
}

// The stem text is identical in both sections; take it from the listing.
function stemForNum(num) {
  let inListing = false
  for (const line of lines.slice(listingAStart + 1, listingBStart)) {
    const sm = line.match(STEM)
    if (sm && +sm[1] === num) return sm[2]
  }
  return String(num)
}

// ── Part B ──────────────────────────────────────────────────────────
if (solvedBStart === -1) {
  console.error('Could not find the bare "Part B" solved-block marker.')
  process.exit(1)
}

const partB = []
{
  let cur = null
  const flush = () => {
    if (cur && cur.statements.length) partB.push(cur)
    cur = null
  }
  for (const line of lines.slice(solvedBStart + 1)) {
    const sm = line.match(SOLVED_B)
    if (sm) {
      if (cur) {
        cur.statements.push({
          text: clean(sm[2]),
          isCorrect: /true/i.test(sm[3]),
          explanation: clean(sm[4]) || null,
        })
      }
      continue
    }
    const qm = line.match(STEM)
    if (qm) {
      flush()
      cur = {
        id: `${slug}-b${qm[1]}`,
        type: 'mtf',
        stem: clean(qm[2]),
        source: `${label} · B${qm[1]}`,
        explanation: null,
        answerKnown: true,
        answerProvenance: 'official',
        aiExplanation: false,
        statements: [],
      }
    }
  }
  flush()
}

const questions = [...partA, ...partB]
const outPath = `src/content/${slug}/questions.json`
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(questions, null, 2) + '\n')
console.log(`${slug}: ${questions.length} questions → ${outPath}`)
console.log(`  Part A: ${partA.length}, Part B: ${partB.length}`)
console.log(`  not-5-statement questions: ${questions.filter((q) => q.statements.length !== 5).length}`)
