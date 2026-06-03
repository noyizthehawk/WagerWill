import { Challenge } from '../types/betCard'
import BetCard from '../components/BetCard'

const bets: Challenge[] = [
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