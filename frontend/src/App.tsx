import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CreateChallengePage from './pages/CreateChallengePage'
import { Challenge } from './types/challengeCard'
import CheckInPage from './pages/CheckInPage'
import ChallengeDetailPage from './pages/ChallengeDetailPage'
// dummy values
const initialChallenges: Challenge[] = [
  {
    id: '1',
    habitName: 'Morning run',
    type: 'running',
    duration: 30,
    entryFee: 25,
    prizePool: 50,
    daysRemaining: 18,
    status: 'active',
    players: [
      { id: 'u1', name: 'You', streak: 12, checkedInToday: true },
      { id: 'u2', name: 'Alex', streak: 9, checkedInToday: false },
    ],
  },
  {
    id: '2',
    habitName: 'No sugar',
    type: 'custom',
    duration: 30,
    entryFee: 25,
    prizePool: 50,
    daysRemaining: 25,
    status: 'active',
    players: [
      { id: 'u1', name: 'You', streak: 5, checkedInToday: false },
      { id: 'u3', name: 'Jordan', streak: 7, checkedInToday: true },
    ],
  },
]

function App() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges)

  //add a new challenge with setchallenges
  const addChallenge = (newChallenge: Challenge) => {
    setChallenges([...challenges, newChallenge])
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
    <span className="font-bold text-white mr-4">WagerWill</span>
    <Link to="/">Home</Link>
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/challenge/new">Create Challenge</Link>
    <button className="ml-auto w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm absolute top-2 right-4">
    </button>
  </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage challenges={challenges} />} />
        <Route path="/challenge/new" element={<CreateChallengePage onAdd={addChallenge} />} />
        <Route path="/challenge/:id/checkin" element={<CheckInPage challenges={challenges} onCheckIn={checkIn} />} />
        <Route path="/challenge/:id/challengedetail" element={<ChallengeDetailPage challenges={challenges} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
