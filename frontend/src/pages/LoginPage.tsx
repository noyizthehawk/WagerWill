import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage(){
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {// async function
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })  // sign in with supabase, wait for response
        if (error) {
          console.log(error.message)
        } else {
          navigate('/dashboard')
        }
      }
    
      return (
        <div className="page">
          <h1 className="font-display text-gray-900 text-8xl">Login</h1>
          <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit" className="btn-primary btn-full">Login</button>
          </form>
        </div>
      )




}