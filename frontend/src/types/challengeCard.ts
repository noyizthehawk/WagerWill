// export betcard type
export type Player = {
  id: string
  userId: string
  name: string
  streak: number
  checkedInToday: boolean
}
 /*chllenge card tkaing a player object */
export type ChallengeType = 'running' | 'gym' | 'cycling' | 'steps' | 'custom'

export type Challenge = {
  id: string
  userId: string
  habitName: string
  type: ChallengeType
  duration: number
  entryFee: number
  prizePool: number
  players: Player[]
  daysRemaining: number
  status: 'active' | 'completed'
}

