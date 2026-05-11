// src/types/game.ts
export type Vec3 = [number, number, number]

export type GameStatus = 'idle' | 'playing' | 'dead'

export interface GameState {
  snake: Vec3[]
  direction: Vec3
  nextDirection: Vec3
  food: Vec3
  score: number
  status: GameStatus
  gridSize: number
  tickInterval: number
}

export interface GameActions {
  start: () => void
  reset: () => void
  setNextDirection: (dir: Vec3) => void
  tick: () => void
}
