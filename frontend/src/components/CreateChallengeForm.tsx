import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Challenge, ChallengeType } from '../types/challengeCard'

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { //async function
    e.preventDefault()

    const response = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      habitName: form.habitName,
      type: form.type,
      duration: Number(form.duration),
      entryFee: Number(form.entryFee),
      prizePool: Number(form.entryFee),
      daysRemaining: Number(form.duration),
      status: 'active',
    })
    
  })

  const newChallenge = await response.json()
  onAdd(newChallenge)
  navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="habitName" value={form.habitName} onChange={handleChange} placeholder="Habit name" />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="running">Running</option>
        <option value="gym">Gym</option>
        <option value="cycling">Cycling</option>
        <option value="steps">Steps</option>
        <option value="custom">Custom</option>
      </select>
      <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration (days)" type="number" />
      <input name="entryFee" value={form.entryFee} onChange={handleChange} placeholder="Entry fee ($)" type="number" />
      <button type="submit">Create</button>
    </form>
  )
}
