import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white px-8 py-8 sm:px-16">
      {/* Small tagline */}
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
      </p>

      {/* Giant heading */}
      <h1 className="mt-4 text-center font-display leading-[0.85] tracking-tight text-black text-[20vw] sm:text-[16vw] lg:text-[14vw]">
        WAGER<br />WILL
      </h1>

      {/* Image card */}
      <div className="flex justify-center px-8 sm:px-16 mt-8">
      <div className="relative w-full max-w-7xl overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"
          alt="Person training"
          className="h-[300px] w-full object-cover sm:h-[420px]"
        />

        {/* dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Centered overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center  text-center">
          <h2 className="font-display leading-[0.85] tracking-tight text-white text-[20vw] sm:text-[16vw] lg:text-[14vw]">
            Bet on<br />Yourself
          </h2>

          <p className="mt-4 max-w-xs text-sm text-white/90">
           
          </p>

          <Link
            to="/signup"
            className="animate-bounce font-game mt-6 flex items-center gap-3 text-sm text-white fon"
          >
            Get Started
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50">
              →
            </span>
          </Link>
        </div>
      </div>
      </div>
    </div>
  )
}
