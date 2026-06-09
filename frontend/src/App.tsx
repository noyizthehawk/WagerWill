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
import AcceptInvite from './pages/AcceptInvite'
import { supabase } from './lib/supabase'
import { Navigate } from 'react-router-dom'
import EvidencePage from './pages/EvidencePage'
function App() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // get current session on page load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    // listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChallenges = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    fetch('/api/challenges', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => {
        setChallenges(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    if (user) fetchChallenges()
  }, [user]) // re-fetch when user logs in or out

  // after adding a challenge, refetch from backend so data is always fresh
  const addChallenge = async (newChallenge: Challenge) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newChallenge)
    })
    fetchChallenges()
  }

  const leaveChallenge = async (challengeId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    await fetch(`/api/challenges/${challengeId}/leave`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchChallenges()
  }

  const deleteChallenge = async (challengeId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    await fetch(`/api/challenges/${challengeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchChallenges()
  }

  const checkIn = async (challengeId: string, playerId: string, evidenceUrl: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    await fetch(`/api/challenges/${challengeId}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ player_id: playerId, evidence_url: evidenceUrl })
    })
    fetchChallenges()
  }

  return (
    <BrowserRouter>
      <nav className="flex items-center gap-6 px-6 py-4 border-b border-white/10">
        <span className="font-bold text-white mr-4">WagerWill</span>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/challenge/new">Create Challenge</Link>
        <Link to="/invites">Invites</Link>
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
              <DashboardPage challenges={challenges} onDelete={deleteChallenge} onLeave={leaveChallenge} user={user} />
            } 
          />
        <Route path="/challenge/new" element={<CreateChallengePage onAdd={addChallenge} />} />
        <Route path="/challenge/:id/checkin" element={<CheckInPage challenges={challenges} onCheckIn={checkIn} user={user} />} />
        <Route path="/challenge/:id/challengedetail" element={<ChallengeDetailPage challenges={challenges} onDelete={deleteChallenge} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/invites" element={<AcceptInvite onAccept={fetchChallenges} />} />
        <Route path="/challenge/:id/evidence" element={<EvidencePage />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
