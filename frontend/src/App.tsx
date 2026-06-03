import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CreateChallengePage from './pages/CreateChallengePage'
import ChallengeDetailPage from './pages/ChallengeDetailPage'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/challenge/new">Create Challenge</Link> |{' '}
        <Link to="/challenge/123">Challenge #123 (example)</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/challenge/new" element={<CreateChallengePage />} />
        <Route path="/challenge/:id" element={<ChallengeDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
