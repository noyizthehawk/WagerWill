import './LandingPage.css'
export default function LandingPage() {
  return (
    <div>
      <header style={{ position: "relative" }}>
        <h1>WagerWill</h1>
        <button className = "user-button">👤</button>
      </header>
      <main>
        <p>Put money on your habits. Winner takes the pot.</p>
        <button>Get Started</button>
      </main>
    </div>
    
  )
}
