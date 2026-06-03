import { Link } from 'react-router-dom'
import { Bet } from '../types/betCard'

export default function BetCard({ bet }: { bet: Bet }) {
  return (
    <div>
      <h2>
        <Link to={`/bet/${bet.id}`}>{bet.habitName}</Link>
      </h2>
      <p>vs {bet.opponentName}</p>
      <p>You: {bet.yourStreak} days · Them: {bet.theirStreak} days</p>
      <p>Pot: ${bet.potAmount}</p>
      <p>{bet.daysRemaining} days left</p>
      <button onClick={() => console.log("Button clicked!")}>Check in</button>
    </div>
  )
}