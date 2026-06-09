import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-white px-6 py-10 sm:px-12">
      {/* Small tagline */}
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-700">
      </p>

      {/* Giant heading */}
      <h1 className="mt-6 text-center font-display text-7xl leading-[0.85] tracking-tight text-gray-900 sm:text-8xl">
        WAGER<br />WILL
      </h1>

      {/* Image card */}
      <div className="relative mt-10 mx-auto max-w-2xl overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"
          alt="Person training"
          className="h-[320px] w-full object-cover sm:h-[400px]"
        />

        {/* dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Centered overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="font-display text-6xl leading-[0.85] tracking-tight text-white sm:text-7xl">
            Inside<br />And Out.
          </h2>

          <p className="mt-4 max-w-xs text-sm text-white/90">
           
          </p>

          <Link
            to="/signup"
            className=" font-game mt-6 flex items-center gap-3 text-sm text-white fon"
          >
            Get Started
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
