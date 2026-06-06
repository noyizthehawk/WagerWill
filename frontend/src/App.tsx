import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CreateChallengePage from './pages/CreateChallengePage'
import { Challenge } from './types/challengeCard'
import CheckInPage from './pages/CheckInPage'
import ChallengeDetailPage from './pages/ChallengeDetailPage'
function App() {
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
  const addChallenge = (newChallenge: Challenge) => {
    fetchChallenges()
  }

  const deleteChallenge = async (challengeId: string) => {
    await fetch(`/api/challenges/${challengeId}`, { method: 'DELETE' })
    fetchChallenges()
  }

  const checkIn = (challengeId: string, playerId: string) => {
    setChallenges(challenges.map((c) => { //update the challenge
      if (c.id !== challengeId) return c   //if the challenge is not the one we want to update
      return {
        ...c, //copy the old challenge
        players: c.players.map((p) => {
          if (p.id !== playerId) return p
          return { ...p, streak: p.streak + 1, checkedInToday: true }
        })
      }
    }))
  }

  return (
    <BrowserRouter>
      <nav className="flex items-center gap-6 px-6 py-4 border-b border-white/10">
    <span className="font-bold text-white mr-4 ">WagerWill</span>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/challenge/new">Create Challenge</Link>
    <button className="ml-auto w-9 h-9 rounded-full bg-green-500 text-white font-bold text-sm absolute top-2 right-4">
    </button>
  </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={loading ? <p className="p-6 text-white">Loading...</p> : <DashboardPage challenges={challenges} onDelete={deleteChallenge} />} />
        <Route path="/challenge/new" element={<CreateChallengePage onAdd={addChallenge} />} />
        <Route path="/challenge/:id/checkin" element={<CheckInPage challenges={challenges} onCheckIn={checkIn} />} />
        <Route path="/challenge/:id/challengedetail" element={<ChallengeDetailPage challenges={challenges} onDelete={deleteChallenge} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
