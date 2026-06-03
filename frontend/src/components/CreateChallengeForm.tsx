import { useState } from 'react'
export default function CreateChallengeForm() {
  const [form, setForm] = useState({
    habitName: '',
    duration: '',
    entryFee: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(form)
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
