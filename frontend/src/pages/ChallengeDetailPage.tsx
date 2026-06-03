import { useParams } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'

const challenges: Challenge[] = [
  {
    id: '1',
    habitName: 'Morning run',
    duration: 30,
    entryFee: 25,
    prizePool: 50,
    daysRemaining: 18,
    status: 'active',
    players: [
      { id: 'u1', name: 'You', streak: 12, checkedInToday: true },
      { id: 'u2', name: 'Alex', streak: 9, checkedInToday: false },
    ],
  },
  {
    id: '2',
    habitName: 'No sugar',
    duration: 30,
    entryFee: 25,
    prizePool: 50,
    daysRemaining: 25,
    status: 'active',
    players: [
      { id: 'u1', name: 'You', streak: 5, checkedInToday: false },
      { id: 'u3', name: 'Jordan', streak: 7, checkedInToday: true },
    ],
  },
]

export default function ChallengeDetailPage() {
  const { id } = useParams()
  /*fetch challenge by id */

  const challenge = challenges.find((c) => c.id === id)
  console.log(challenge)
  if (!challenge) return <p>Challenge not found</p>
  return (
    <div>
      <h1>{challenge.habitName}</h1>
      <p>Prize pool: ${challenge.prizePool}</p>
      <p>{challenge.daysRemaining} days left</p>
    </div>
  )
}
