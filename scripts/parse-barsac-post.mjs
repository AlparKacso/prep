// Deterministic parser for the BARSAC "Post" docx — Part B solved block only.
// That block is self-contained and regular: a bare "Part B" marker, then for
// each question: "N. stem" followed by 5 lines
//   "<Letter>. <statement> <True|False>. <explanation>"
// (Post Part A uses a different, text-less solved format — handled separately.)
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

const PARTB_SOLVED = /^Part B\s*$/i // bare marker (listing one is "Part B - Questions 1-30")
const STEM = /^(\d+)\.\s+(.+)$/
const SOLVED = /^([A-E])\.\s+(.+?)\s*(True|False)\.\s*(.*)$/i

// Locate the Part B solved block.
const start = lines.findIndex((l) => PARTB_SOLVED.test(l))
if (start === -1) {
  console.error('Could not find the bare "Part B" solved-block marker.')
  process.exit(1)
}

const questions = []
let cur = null
const flush = () => {
  if (cur && cur.statements.length) questions.push(cur)
  cur = null
}

for (const line of lines.slice(start + 1)) {
  const sm = line.match(SOLVED)
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

const outPath = `src/content/${slug}/questions.json`
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, JSON.stringify(questions, null, 2) + '\n')
console.log(`${slug}: ${questions.length} questions → ${outPath}`)
console.log(`  not-5-statement questions: ${questions.filter((q) => q.statements.length !== 5).length}`)
