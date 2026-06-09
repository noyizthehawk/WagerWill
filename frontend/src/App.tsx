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
  
  function ProtectedRoute({ children }: { children: React.ReactNode }) {
    if (!user) return <Navigate to="/login" />
    return <>{children}</>
  }

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    if (user) {
      fetchChallenges()
    } else {
      setChallenges([]) // clear old data immediately when user logs out
      setLoading(true)  // reset loading state
    }
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
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {/* hamburger icon */}
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-gray-700"></span>
                <span className="block h-0.5 w-5 bg-gray-700"></span>
                <span className="block h-0.5 w-5 bg-gray-700"></span>
              </div>
            </button>
          )}
          <Link to="/" className="font-display text-2xl tracking-wide text-gray-900">
            WAGERWILL
          </Link>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user.email}</span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-red-600"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">Log in</Link>
            <Link
              to="/signup"
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* Body: sidebar + main */}
      <div className="flex">
        {/* Sidebar — toggled open/closed */}
        {user && sidebarOpen && (
          <aside className="w-56 shrink-0 px-4 py-6">
            <nav className="flex flex-col gap-1">
              <Link onClick={() => setSidebarOpen(false)} to="/dashboard" className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Dashboard</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/challenge/new" className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Create Challenge</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/invites" className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">Invites</Link>
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/dashboard"
                element={
                  !user ? <Navigate to="/login" /> :
                  loading ? <p className="p-6 text-gray-900">Loading...</p> :
                  <DashboardPage challenges={challenges} onDelete={deleteChallenge} onLeave={leaveChallenge} user={user} />
                }
              />
              <Route path="/challenge/new" element={
                <ProtectedRoute><CreateChallengePage onAdd={addChallenge} /></ProtectedRoute>
              } />

              <Route path="/challenge/:id/checkin" element={
                <ProtectedRoute><CheckInPage challenges={challenges} onCheckIn={checkIn} user={user} /></ProtectedRoute>
              } />

              <Route path="/challenge/:id/challengedetail" element={
                <ProtectedRoute><ChallengeDetailPage challenges={challenges} onDelete={deleteChallenge} /></ProtectedRoute>
              } />

              <Route path="/challenge/:id/evidence" element={
                <ProtectedRoute><EvidencePage /></ProtectedRoute>
              } />

              <Route path="/invites" element={
                <ProtectedRoute><AcceptInvite onAccept={fetchChallenges} /></ProtectedRoute>
              } />

              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
              <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignupPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
