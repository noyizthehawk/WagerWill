import { useParams } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'

type Props = {
  challenges: Challenge[]
}

export default function CheckInPage({ challenges }: Props) {
  const { id } = useParams()
  const challenge = challenges.find((c) => c.id === id)

  if (!challenge) {
    return <div>Challenge not found</div>
  }

  return (
    <div>
      <h1>Check in: {challenge.habitName}</h1>
      <p>{challenge.daysRemaining} days remaining</p>
      {challenge.players.map((p) => (
        <p key={p.id}>{p.name}: {p.streak} days {p.checkedInToday ? '✓' : ''}</p>
      ))}
      <button onClick={() => console.log('checked in!')}>Confirm check in</button>
    </div>
  )
}
