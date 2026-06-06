import { useParams, useNavigate } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'

type Props = {
  challenges: Challenge[]
  onDelete: (id: string) => void
}

export default function ChallengeDetailPage({ challenges, onDelete }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const challenge = challenges.find((c) => c.id === id)

  if (!challenge) {
    return <div>Challenge not found</div>
  }

  const handleDelete = () => { // delete challenge
    onDelete(challenge.id) //pass the id of the challenge to the onDelete function
    navigate('/dashboard')
  }

  return (
    <div className="page">
      <h1>{challenge.habitName}</h1>
      <p>{challenge.status}</p>
      <div>
        {challenge.players
          .sort((a, b) => b.streak - a.streak)
          .map((p) => (
            <p key={p.id}>{p.name}: {p.streak} days</p>
          ))}
      </div>
      <button
        onClick={handleDelete}
        className="mt-6 bg-red-500/10 text-red-400 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-500/20 transition"
      >
        Delete Challenge
      </button>
    </div>
  )
}
