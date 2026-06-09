import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function EvidencePage() {
  const { id } = useParams()
  const [checkIns, setCheckIns] = useState<any[]>([])

  useEffect(() => {
    const fetch_checkins = async () => {
      const { data: { session } } = await supabase.auth.getSession()// get current session
      const token = session?.access_token // get access token
      // fetch check-ins
      const res = await fetch(`/api/challenges/${id}/checkins`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // parse response
      const data = await res.json()
      setCheckIns(data)
    }
    fetch_checkins()
  }, [id])

  return (
    <div className="page">
      <h1 className="text-white font-bold text-2xl mb-6">Evidence</h1>
      {checkIns.length === 0 && <p>No check-ins yet</p>}
      <div className="grid grid-cols-2 gap-4">
        {checkIns.map((c) => (
          <div key={c.id} className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10">
            <img src={c.evidenceUrl} alt="evidence" className="w-full h-48 object-cover" />
            <div className="p-3">
              <p className="text-white text-sm font-semibold">{c.playerName}</p>
              <p className="text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
