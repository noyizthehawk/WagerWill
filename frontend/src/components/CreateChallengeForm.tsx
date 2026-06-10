import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Challenge, ChallengeType } from '../types/challengeCard'

/* visual config for the type picker — mirrors the imagery used on ChallengeCard */
const typeOptions: { value: ChallengeType; label: string; image: string }[] = [
  { value: 'running', label: 'Running', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=800&auto=format&fit=crop' },
  { value: 'gym',     label: 'Gym',     image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' },
  { value: 'cycling', label: 'Cycling', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop' },
  { value: 'steps',   label: 'Steps',   image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop' },
  { value: 'custom',  label: 'Custom',  image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop' },
]

/*make props,we would dynammically add a challenge later */
type Props = {
  onAdd: (challenge: Challenge) => void
}
/*make form for challenge creation*/
export default function CreateChallengeForm({ onAdd }: Props) {
  const navigate = useNavigate()

  const [form, setForm] = useState({  /*set initial state */
    habitName: '',
    type: 'running' as ChallengeType,
    duration: '',
    entryFee: '',
  })

  /*handle change, update the form with the new values */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  /**nandle submit */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onAdd({
      id: '',
      habitName: form.habitName,
      userId: '',
      type: form.type,
      duration: Number(form.duration),
      entryFee: Number(form.entryFee),
      prizePool: Number(form.entryFee),
      daysRemaining: Number(form.duration),
      status: 'active',
      players: [],
    })
    navigate('/dashboard')
  }

  const isValid =
    form.habitName.trim() !== '' && Number(form.duration) > 0 && Number(form.entryFee) > 0

  return (
    <form onSubmit={handleSubmit} className="card mt-6 !p-7">
      {/* Habit name */}
      <div className="form-group">
        <label htmlFor="habitName">Habit name</label>
        <input
          id="habitName"
          name="habitName"
          value={form.habitName}
          onChange={handleChange}
          placeholder="e.g. Morning run before 8am"
        />
      </div>

      {/* Visual type picker */}
      <div className="form-group">
        <label>Challenge type</label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {typeOptions.map((opt) => {
            const selected = form.type === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, type: opt.value })}
                aria-pressed={selected}
                className={`relative h-24 overflow-hidden rounded-xl !p-0 text-left transition ${
                  selected ? 'ring-2 ring-[var(--accent)] ring-offset-2' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <img src={opt.image} alt={opt.label} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                <span className="absolute bottom-2 left-3 font-game text-xs uppercase tracking-tight !text-white drop-shadow">
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Duration + entry fee side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="duration">Duration (days)</label>
          <input
            id="duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="30"
            type="number"
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="entryFee">Entry fee ($)</label>
          <input
            id="entryFee"
            name="entryFee"
            value={form.entryFee}
            onChange={handleChange}
            placeholder="20"
            type="number"
            min="0"
          />
        </div>
      </div>

      {/* Live summary */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
        <span className="stat-label">Starting prize pool</span>
        <span className="stat accent">${Number(form.entryFee) || 0}</span>
      </div>

      <button type="submit" className="btn-primary btn-full" disabled={!isValid}>
        Create challenge
      </button>
    </form>
  )
}
