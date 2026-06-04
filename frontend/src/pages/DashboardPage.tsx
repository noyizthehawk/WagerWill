import { Challenge } from '../types/challengeCard'
import ChallengeCard from '../components/ChallengeCard'

type Props = {
  challenges: Challenge[]
}

export default function DashboardPage({ challenges }: Props) {
  return (
    <div>
      <h1>Dashboard</h1>

      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challengeCard={challenge} />
      ))}
    </div>
  )
}
