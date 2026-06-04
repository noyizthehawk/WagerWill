import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Challenge } from '../types/challengeCard'

/*make props,we would dynammically add a challenge later */
type Props = {
  onAdd: (challenge: Challenge) => void
}
/*make form for challenge creation*/
export default function CreateChallengeForm({ onAdd }: Props) {
  const navigate = useNavigate()

  const [form, setForm] = useState({  /*set initial state */
    habitName: '',
    duration: '',
    entryFee: '',
  })
  
  /*handle change, update the form with the new values */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newChallenge: Challenge = {
      id: Date.now().toString(), // temporary unique id
      habitName: form.habitName,
      duration: Number(form.duration),
      entryFee: Number(form.entryFee),
      prizePool: Number(form.entryFee), // just entry fee for now, grows with players
      daysRemaining: Number(form.duration),
      status: 'active',
      players: [
        { id: 'u1', name: 'You', streak: 0, checkedInToday: false },
      ],
    }

    onAdd(newChallenge)
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="habitName" value={form.habitName} onChange={handleChange} placeholder="Habit name" />
      <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (days)" type="number" />
      <input name="entryFee" value={form.entryFee} onChange={handleChange} placeholder="Entry fee ($)" type="number" />
      <button type="submit">Create</button>
    </form>
  )
}
