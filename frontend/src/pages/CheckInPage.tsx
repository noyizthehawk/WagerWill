import { useParams, useNavigate } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'
import { useState } from 'react'

type Props = {
  challenges: Challenge[]
  onCheckIn: (challengeId: string, playerId: string) => void
}

export default function CheckInPage({ challenges, onCheckIn }: Props) {
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null) //state to handle user picks
  const [previewUrl, setPreviewUrl] = useState<string | null>(null) //state to handle preview to show image

  const { id } = useParams()
  const navigate = useNavigate()
  const challenge = challenges.find((c) => c.id === id)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEvidenceFile(file) //set new file
      setPreviewUrl(URL.createObjectURL(file)) //set preview
    }
  }

  const handleConfirm = () => {
    if (!challenge) return
    const me = challenge.players.find((p) => p.name === 'You')
    if (!me) return
    onCheckIn(challenge.id, me.id) // ← real player id from database
    navigate('/dashboard')
  }

  if (!challenge) {
    return <div>Challenge not found</div>
  }

  return (
    <div className="page">
      <h1>Check in: {challenge.habitName}</h1>
      <p>{challenge.daysRemaining} days remaining</p>
      {challenge.players.map((p) => (
        <p key={p.id}>{p.name}: {p.streak} days {p.checkedInToday ? '✓' : ''}</p>
      ))}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <img src={previewUrl} alt="Evidence preview" width={300} />
      )}
      <button disabled={!evidenceFile} onClick={handleConfirm}>
        Confirm check in
      </button>
    </div>
  )
}
