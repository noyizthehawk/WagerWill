import { Link, useNavigate } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'


/*take in challengeCard object, and display it*/
export default function ChallengeCard({ challengeCard }: { challengeCard: Challenge }) {
  const navigate = useNavigate()
  return (
    <div>
      <h2>
        <Link to={`/challenge/${challengeCard.id}/challengedetail`}>{challengeCard.habitName}</Link>
      </h2>
      {challengeCard.players.map((p) => (
        <p key={p.id}>{p.name}: {p.streak} days {p.checkedInToday ? '✓' : ''}</p>
      ))}
      <p>Prize pool: ${challengeCard.prizePool} · Entry: ${challengeCard.entryFee}</p>
      <p>{challengeCard.daysRemaining} days left · {challengeCard.status}</p>
      <button onClick={() => navigate(`/challenge/${challengeCard.id}/checkin`)}>Check in</button>
    </div>
  )
}