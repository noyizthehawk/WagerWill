import './LandingPage.css'
export default function LandingPage() {
  return (
    <div className="page">
      <header className = "flex justify-center items-center min-h-screen" style={{ position: 'relative' }}>
        <h1>WagerWill</h1>
      </header>
      <main>
        <div className="flex flex-col items-center gap-4 mt-4">
          <p>Put money on your habits. Winner takes the pot.</p>
          <button type="button">Get Started</button>
        </div>
      </main>
    </div>
    
  )
}
