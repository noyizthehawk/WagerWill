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
    <div className="flex flex-col items-center px-6 py-8">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <h1 className="text-gray-900 font-display text-8xl">My Challenges</h1>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challengeCard={challenge} onDelete={onDelete} onLeave={onLeave} user={user} />
        ))}
      </div>
    </div>
  )
}
