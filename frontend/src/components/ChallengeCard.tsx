import { Link, useNavigate } from 'react-router-dom'
import { Challenge, ChallengeType } from '../types/challengeCard'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const typeConfig: Record<ChallengeType, { gradient: string }> = {
  running: { gradient: 'from-orange-500 to-red-600' },
  gym:     { gradient: 'from-blue-500 to-purple-600' },
  cycling: { gradient: 'from-green-400 to-teal-600' },
  steps:   { gradient: 'from-yellow-400 to-orange-500' },
  custom:  { gradient: 'from-pink-500 to-rose-600' },
}

type Props = {
  challengeCard: Challenge
  onDelete: (id: string) => void
  onLeave: (id: string) => void
  user: any
}

export default function ChallengeCard({ challengeCard, onDelete, onLeave, user }: Props) {
  const navigate = useNavigate()
  const config = typeConfig[challengeCard.type]

  const [showInvite, setShowInvite] = useState(false)

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget.email.value

    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    await fetch('/api/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        challenge_id: Number(challengeCard.id),
        invited_email: email,
      })
    })

    setShowInvite(false)
  }
  
  console.log('user:', user)
  console.log('challenge userId:', challengeCard.userId)

  return (
    <div className="rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/10 hover:border-white/20 transition cursor-pointer w-64 shrink-0">

      <Link to={`/challenge/${challengeCard.id}/challengedetail`}>
        <div className={`bg-gradient-to-br ${config.gradient} h-40 flex items-center justify-center text-6xl`}>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3">
        <div>
          <Link to={`/challenge/${challengeCard.id}/challengedetail`}>
            <h2 className="text-white font-bold text-lg leading-tight hover:opacity-80 transition">
              {challengeCard.habitName}
            </h2>
          </Link>
          <p className="text-gray-400 text-sm mt-0.5">
            {challengeCard.daysRemaining} days left · {challengeCard.status}
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Prize</p>
            <p className="text-white font-semibold">${challengeCard.prizePool}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Entry</p>
            <p className="text-white font-semibold">${challengeCard.entryFee}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Players</p>
            <p className="text-white font-semibold">{challengeCard.players.length}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/challenge/${challengeCard.id}/checkin`)}
          className="w-full bg-white text-black font-semibold text-sm py-2 rounded-xl hover:bg-gray-200 transition"
        >
          Check in
        </button>
        {user?.id === challengeCard.userId ? (
          <button
            onClick={() => onDelete(challengeCard.id)}
            className="w-full bg-red-500/10 text-red-400 font-semibold text-sm py-2 rounded-xl hover:bg-red-500/20 transition"
          >
            Delete
          </button>
        ) : (
          <button
            onClick={() => onLeave(challengeCard.id)}
            className="w-full bg-yellow-500/10 text-yellow-400 font-semibold text-sm py-2 rounded-xl hover:bg-yellow-500/20 transition"
          >
            Leave
          </button>
        )}
        {user?.id === challengeCard.userId && (
         <button onClick={() => setShowInvite(true)}>Invite Friends</button>
        )}
        {showInvite && (
          <form  onSubmit={handleInviteSubmit}>
            <input name="email" placeholder="Friend's email" />
            <button type="submit" >Send Invite</button>
            <button type="button" onClick={() => setShowInvite(false)}>Cancel</button>
          </form>
        )}
      </div>
    </div>
    
  )
  
}
