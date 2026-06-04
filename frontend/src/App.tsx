import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CreateChallengePage from './pages/CreateChallengePage'
import ChallengeDetailPage from './pages/ChallengeDetailPage'
import { Challenge } from './types/challengeCard'

const initialChallenges: Challenge[] = [
  {
    id: '1',
    habitName: 'Morning run',
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

  const addChallenge = (newChallenge: Challenge) => {
    setChallenges([...challenges, newChallenge])
  }

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/challenge/new">Create Challenge</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage challenges={challenges} />} />
        <Route path="/challenge/new" element={<CreateChallengePage onAdd={addChallenge} />} />
        <Route path="/challenge/:id" element={<ChallengeDetailPage challenges={challenges} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
