'use client'

import { Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import PracticeClient from '@/components/practice/PracticeClient'
import { parsePracticeConfig, selectQuestions } from '@/lib/content'
import { getMissedIds } from '@/lib/progress'

function PracticeRunner() {
  const sp = useSearchParams()

  const { questions, feedback, title } = useMemo(() => {
    const params: Record<string, string | undefined> = {
      folders: sp.get('folders') ?? undefined,
      order: sp.get('order') ?? undefined,
      batch: sp.get('batch') ?? undefined,
      feedback: sp.get('feedback') ?? undefined,
      source: sp.get('source') ?? undefined,
    }
    const config = parsePracticeConfig(params)
    const missed = config.source === 'missed' ? getMissedIds() : []
    const qs = selectQuestions(config, missed)
    const scope =
      config.source === 'missed'
        ? 'Review missed'
        : config.folders.length > 0
          ? config.folders.join(', ')
          : 'All folders'
    return {
      questions: qs,
      feedback: config.feedback,
      title: `${qs.length} question${qs.length !== 1 ? 's' : ''} · ${scope}`,
    }
  }, [sp])

  return <PracticeClient questions={questions} feedback={feedback} title={title} />
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading…</div>
      }
    >
      <PracticeRunner />
    </Suspense>
  )
}
