import { useParams } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'

type Props = {
  challenges: Challenge[]
}

export default function ChallengeDetailPage({ challenges }: Props) {
  const { id } = useParams()
  /**find the challege with id */
  const challenge = challenges.find((c) => c.id === id)

  if (!challenge) {
    return <div>Challenge not found</div>   
  }

  return (
    <div className="page">
      <h1>{challenge.habitName}</h1>
      <p>{challenge.status}</p>
      <div>
      {challenge.players
          .sort((a, b) => b.streak - a.streak)
          .map((p) => (
            <p key={p.id}>{p.name}: {p.streak} days</p>
          ))}
      </div>
    </div>
  )
}