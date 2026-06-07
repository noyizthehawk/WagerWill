import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CreateChallengePage from './pages/CreateChallengePage'
import { Challenge } from './types/challengeCard'
import CheckInPage from './pages/CheckInPage'
import ChallengeDetailPage from './pages/ChallengeDetailPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import { supabase } from './lib/supabase'
import { Navigate } from 'react-router-dom'
function App() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // get current session on page load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChallenges = () => { //fetch challenges from backend
    fetch('/api/challenges')
      .then((r) => r.json())
      .then((data) => {
        setChallenges(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { //fetch challenges on page load
    fetchChallenges()
  }, [])//empty dependency array, so it runs once on page load

  // after adding a challenge, refetch from backend so data is always fresh
  const addChallenge = async (newChallenge: Challenge) => {
    await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChallenge)
    });
    fetchChallenges()
  }

  const deleteChallenge = async (challengeId: string) => {
    await fetch(`/api/challenges/${challengeId}`, { method: 'DELETE' })
    fetchChallenges()
  }

  const checkIn = async (challengeId: string, playerId: string) => {
    await fetch(`/api/challenges/${challengeId}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId })
    })
    fetchChallenges() // refetch fresh data from backend after checkin saved
  }

  return (
    <BrowserRouter>
      <nav className="flex items-center gap-6 px-6 py-4 border-b border-white/10">
        <span className="font-bold text-white mr-4">WagerWill</span>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/challenge/new">Create Challenge</Link>
        {user ? (
          <>
            <span className="text-[#888] text-sm ml-auto">{user.email}</span>
            <button onClick={() => supabase.auth.signOut()} className="text-sm text-red-400">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
            path="/dashboard" 
            element={
              !user ? <Navigate to="/login" /> : 
              loading ? <p className="p-6 text-white">Loading...</p> : 
              <DashboardPage challenges={challenges} onDelete={deleteChallenge} />
            } 
          />
        <Route path="/challenge/new" element={<CreateChallengePage onAdd={addChallenge} />} />
        <Route path="/challenge/:id/checkin" element={<CheckInPage challenges={challenges} onCheckIn={checkIn} />} />
        <Route path="/challenge/:id/challengedetail" element={<ChallengeDetailPage challenges={challenges} onDelete={deleteChallenge} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
