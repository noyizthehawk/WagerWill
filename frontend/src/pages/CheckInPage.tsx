import { useParams, useNavigate } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Props = {
  challenges: Challenge[]
  onCheckIn: (challengeId: string, playerId: string, evidenceUrl: string) => void
  user: any
}

export default function CheckInPage({ challenges, onCheckIn, user }: Props) {
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

  const handleConfirm = async () => {
    console.log('handleConfirm called')
    if (!challenge || !evidenceFile) return
    const me = challenge.players.find((p) => p.userId === user?.id)
    console.log('me:', me)
    if (!me) return
    console.log('uploading...')

    // upload image to supabase storage
    const fileName = `${challenge.id}/${me.id}/${Date.now()}`
    const { error } = await supabase.storage
      .from('Evidence')
      .upload(fileName, evidenceFile)

    if (error) {
      console.error('Upload failed:', error.message)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('Evidence')
      .getPublicUrl(fileName)

    onCheckIn(challenge.id, me.id, publicUrl)
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
