import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import CreateBetPage from './pages/CreateBetPage'
import BetDetailPage from './pages/BetDetailPage'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/bet/new">Create Bet</Link> |{' '}
        <Link to="/bet/123">Bet #123 (example)</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bet/new" element={<CreateBetPage />} />
        <Route path="/bet/:id" element={<BetDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
