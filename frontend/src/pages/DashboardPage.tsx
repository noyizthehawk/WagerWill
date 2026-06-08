import { Challenge } from '../types/challengeCard'
import ChallengeCard from '../components/ChallengeCard'

type Props = {
  challenges: Challenge[]
  onDelete: (id: string) => void
  onLeave: (id: string) => void
  user: any
}

export default function DashboardPage({ challenges, onDelete, onLeave, user }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-white font-bold text-2xl mb-6">My Challenges</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challengeCard={challenge} onDelete={onDelete} onLeave={onLeave} user={user} />
        ))}
      </div>
    </div>
  )
}
