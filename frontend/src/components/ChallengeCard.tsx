import { Link, useNavigate } from 'react-router-dom'
import { Challenge, ChallengeType } from '../types/challengeCard'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const typeConfig: Record<ChallengeType, { image: string; label: string }> = {
  running: {
    label: 'Running',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1600&auto=format&fit=crop',
  },
  gym: {
    label: 'Gym',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
  },
  cycling: {
    label: 'Cycling',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1600&auto=format&fit=crop',
  },
  steps: {
    label: 'Steps',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1600&auto=format&fit=crop',
  },
  custom: {
    label: 'Custom',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop',
  },
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

  const [expanded, setExpanded] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const isOwner = user?.id === challengeCard.userId

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
      }),
    })

    setShowInvite(false)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-sm">
      {/* background image */}
      <img
        src={config.image}
        alt={config.label}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20" />

      {/* main banner content */}
      <div className="relative flex min-h-[200px] flex-col items-center justify-end px-20 py-8">
        {/* top row: label + stats */}
        <div className="flex justify-between">
          <div>
            <Link to={`/challenge/${challengeCard.id}/challengedetail`}>
              <h2 className="font-game text-3xl uppercase leading-none tracking-tight text-white drop-shadow hover:opacity-80 transition sm:text-5xl">
                {challengeCard.habitName}
              </h2>
            </Link>
            <p className="mt-2 text-sm text-white">
              {challengeCard.daysRemaining} days left · {challengeCard.status}
            </p>
          </div>

          {/* expand / collapse arrow button */}
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Hide actions' : 'Show actions'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/60 text-white transition hover:bg-white hover:text-black"
          >
            <span className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>→</span>
          </button>
        </div>

        {/* stats row */}
        <div className="mt-6 flex gap-8 text-white">
          <div>
            <p className="text-xs uppercase tracking-wide !text-white/60">Prize</p>
            <p className="font-semibold !text-white">${challengeCard.prizePool}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide !text-white/60">Entry</p>
            <p className="font-semibold !text-white">${challengeCard.entryFee}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide !text-white/60">Players</p>
            <p className="font-semibold !text-white">{challengeCard.players.length}</p>
          </div>
        </div>

        {/* actions — only visible when expanded */}
        {expanded && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              onClick={() => navigate(`/challenge/${challengeCard.id}/checkin`)}
              className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
            >
              Check in
            </button>

            {isOwner ? (
              <button
                onClick={() => onDelete(challengeCard.id)}
                className="rounded-xl bg-red-500/20 px-5 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/30"
              >
                Delete
              </button>
            ) : (
              <button
                onClick={() => onLeave(challengeCard.id)}
                className="rounded-xl bg-yellow-500/20 px-5 py-2 text-sm font-semibold text-yellow-200 transition hover:bg-yellow-500/30"
              >
                Leave
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setShowInvite((v) => !v)}
                className="rounded-xl border border-white/50 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
              >
                Invite Friends
              </button>
            )}
          </div>
        )}

        {/* invite form */}
        {expanded && showInvite && (
          <form onSubmit={handleInviteSubmit} className="mt-4 flex flex-wrap gap-2">
            <input
              name="email"
              placeholder="Friend's email"
              className="rounded-xl px-4 py-2 text-sm text-black"
            />
            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/80"
            >
              Send Invite
            </button>
            <button
              type="button"
              onClick={() => setShowInvite(false)}
              className="rounded-xl border border-white/50 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
