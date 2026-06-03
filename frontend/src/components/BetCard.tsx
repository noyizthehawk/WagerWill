import { Link } from 'react-router-dom'
import { Challenge } from '../types/betCard'

export default function BetCard({ bet }: { bet: Challenge }) {
  return (
    <div>
      <h2>
        <Link to={`/bet/${bet.id}`}>{bet.habitName}</Link>
      </h2>
      {bet.players.map((p) => (
        <p key={p.id}>{p.name}: {p.streak} days {p.checkedInToday ? '✓' : ''}</p>
      ))}
      <p>Prize pool: ${bet.prizePool} · Entry: ${bet.entryFee}</p>
      <p>{bet.daysRemaining} days left · {bet.status}</p>
      <button onClick={() => console.log("Button clicked!")}>Check in</button>
    </div>
  )
}