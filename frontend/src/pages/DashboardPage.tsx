import { Bet } from '../types/betCard'
import BetCard from '../components/BetCard'

const bets: Bet[] = [
  {
    id: '1',
    habitName: 'Morning run',
    opponentName: 'Alex',
    yourStreak: 12,
    theirStreak: 9,
    potAmount: 50,
    daysRemaining: 18,
  },
  {
    id: '2',
    habitName: 'No sugar',
    opponentName: 'Jordan',
    yourStreak: 5,
    theirStreak: 7,
    potAmount: 25,
    daysRemaining: 25,
  },
]

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      {bets.map((bet) => (
        <BetCard key={bet.id} bet={bet} />
      ))}
    </div>
  )
}