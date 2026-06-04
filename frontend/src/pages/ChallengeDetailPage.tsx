import { useParams } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'

type Props = {
  challenges: Challenge[]
}

export default function ChallengeDetailPage({ challenges }: Props) {
  const { id } = useParams()
  const challenge = challenges.find((c) => c.id === id)

  if (!challenge) {
    return <div>Challenge not found</div>   
  }

  return (
    <div>
      <h1>{challenge.habitName}</h1>
      <p>{challenge.status}</p>
    </div>
  )
}