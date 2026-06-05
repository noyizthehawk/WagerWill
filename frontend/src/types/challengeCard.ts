// export betcard type
export type Player = {
  id: string
  name: string
  streak: number
  checkedInToday: boolean
}
 /*chllenge card tkaing a player object */
export type Challenge = {
  id: string
  habitName: string
  duration: number
  entryFee: number
  prizePool: number
  players: Player[]
  daysRemaining: number
  status: 'active' | 'completed'
}