import CreateChallengeForm from '../components/CreateChallengeForm'
import { Challenge } from '../types/challengeCard'

type Props = {
  onAdd: (challenge: Challenge) => void
}

export default function CreateChallengePage({ onAdd }: Props) {
  return (
    <div className="page">
      <div>
        <h1 className="font-display text-gray-900 text-8xl">Create a Challenge</h1>
        <p>Put your money where your mouth is</p>
      </div>
      <CreateChallengeForm onAdd={onAdd} />
    </div>
  )
}
