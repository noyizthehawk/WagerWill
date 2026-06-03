import { Link } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'

export default function ChallengeCard({ challengeCard }: { challengeCard: Challenge }) {
  return (
    <div>
      <h2>
        <Link to={`/challenge/${challengeCard.id}`}>{challengeCard.habitName}</Link>
      </h2>
      {challengeCard.players.map((p) => (
        <p key={p.id}>{p.name}: {p.streak} days {p.checkedInToday ? '✓' : ''}</p>
      ))}
      <p>Prize pool: ${challengeCard.prizePool} · Entry: ${challengeCard.entryFee}</p>
      <p>{challengeCard.daysRemaining} days left · {challengeCard.status}</p>
      <button onClick={() => console.log("Button clicked!")}>Check in</button>
    </div>
  )
}