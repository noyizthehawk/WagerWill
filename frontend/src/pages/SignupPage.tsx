import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {// async function
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })  // sign up with supabase, wait for response
    if (error) {
      console.log(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="page">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Sign up</button>
      </form>
    </div>
  )
}
