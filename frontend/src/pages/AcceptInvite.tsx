import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

type Props = {
  onAccept: () => void
}

export default function AcceptInvite({ onAccept }: Props) {
  const [invites, setInvites] = useState<any[]>([])
  const Navigate = useNavigate()

  const fetchInvites = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    const res = await fetch('/api/invites', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setInvites(data)
  }

  useEffect(() => {
    fetchInvites()
  }, [])

  const handleAccept = async (challengeId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    await fetch('/api/invites/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ challenge_id: Number(challengeId) })
    })
    await onAccept() // call the parent component's onAccept function
    Navigate('/dashboard')
  }

  return (
    <div className="page">
      <h1 className='font-display text-gray-900 text-8xl'>Pending Invites</h1>
      {invites.length === 0 && <p>No pending invites</p>}
      {invites.map((invite) => (
        <div key={invite.id} className="card mt-4 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">{invite.challengeName}</h2>
            <p className="text-sm">Invited by {invite.inviterEmail}</p>
          </div>
          <button className="btn-primary" onClick={() => handleAccept(invite.challengeId)}>Accept</button>
        </div>
      ))}
    </div>
  )
}
