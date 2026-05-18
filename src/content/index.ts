import type { PrepQuestion, FolderSummary } from '@/types'

import barsac2025pre from './barsac-2025-pre/questions.json'
import hola2022b from './hola-2022-b/questions.json'

// Each folder's JSON omits the `folder` field — it's injected here from the
// directory name so a question always knows where it came from.
const RAW: Record<string, unknown[]> = {
  'barsac-2025-pre': barsac2025pre,
  'hola-2022-b': hola2022b,
}

const LABELS: Record<string, string> = {
  'barsac-2025-pre': 'BARSAC 2025 Pre',
  'hola-2022-b': 'HOLA 2022 · Paper B',
}

function labelFor(name: string): string {
  return LABELS[name] ?? name
}

export const ALL_QUESTIONS: PrepQuestion[] = Object.entries(RAW).flatMap(
  ([folder, items]) =>
    (items as Omit<PrepQuestion, 'folder'>[]).map(
      (q) => ({ ...q, folder }) as PrepQuestion
    )
)

export const FOLDERS: FolderSummary[] = Object.keys(RAW).map((name) => ({
  name,
  label: labelFor(name),
  count: ALL_QUESTIONS.filter((q) => q.folder === name).length,
}))
