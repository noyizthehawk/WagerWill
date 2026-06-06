import { Link, useNavigate } from 'react-router-dom'
import { Challenge, ChallengeType } from '../types/challengeCard'

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
}

export default function ChallengeCard({ challengeCard, onDelete }: Props) {
  const navigate = useNavigate()
  const config = typeConfig[challengeCard.type]

  return (
    <div className="rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/10 hover:border-white/20 transition cursor-pointer w-64 shrink-0">

      <Link to={`/challenge/${challengeCard.id}/challengedetail`}>
        <div className={`bg-gradient-to-br ${config.gradient} h-40 flex items-center justify-center text-6xl`} />
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
        <button
          onClick={() => onDelete(challengeCard.id)}
          className="w-full bg-red-500/10 text-red-400 font-semibold text-sm py-2 rounded-xl hover:bg-red-500/20 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
