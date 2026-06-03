import { useParams } from 'react-router-dom'

export default function BetDetailPage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Bet #{id}</h1>
      <p>Streaks and check-in will appear here.</p>
    </div>
  )
}
