import HomeClient from '@/components/HomeClient'
import { FOLDERS, totalQuestionCount } from '@/lib/content'

export default function DashboardPage() {
  return <HomeClient folders={FOLDERS} total={totalQuestionCount()} />
}
