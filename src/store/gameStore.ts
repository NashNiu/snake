// src/store/gameStore.ts
import { create } from 'zustand'
import type { GameState, GameActions, Vec3 } from '../types/game'
import {
  addVec3, vec3Equal, isOpposite,
  isOutOfBounds, collidesWithSelf, randomFood, calcTickInterval,
} from '../utils/gameLogic'

const GRID_SIZE = 10
const INITIAL_SNAKE: Vec3[] = [[0, 0, 0], [-1, 0, 0], [-2, 0, 0]]
const INITIAL_DIRECTION: Vec3 = [1, 0, 0]

function makeInitialState(): GameState {
  return {
    snake: INITIAL_SNAKE,
    direction: INITIAL_DIRECTION,
    nextDirection: INITIAL_DIRECTION,
    food: randomFood(INITIAL_SNAKE, GRID_SIZE),
    score: 0,
    status: 'idle',
    gridSize: GRID_SIZE,
    tickInterval: 200,
  }
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...makeInitialState(),

  start: () => set({ status: 'playing' }),

  reset: () => set(makeInitialState()),

  setNextDirection: (dir: Vec3) => {
    const { direction } = get()
    if (!isOpposite(dir, direction)) {
      set({ nextDirection: dir })
    }
  },

  tick: () => {
    const { snake, nextDirection, food, score, gridSize, status } = get()
    if (status !== 'playing') return

    const newHead = addVec3(snake[0], nextDirection)

    if (isOutOfBounds(newHead, gridSize) || collidesWithSelf(newHead, snake)) {
      set({ status: 'dead' })
      return
    }

    const ateFood = vec3Equal(newHead, food)
    const newSnake = ateFood
      ? [newHead, ...snake]
      : [newHead, ...snake.slice(0, -1)]
    const newScore = ateFood ? score + 1 : score

    set({
      snake: newSnake,
      direction: nextDirection,
      food: ateFood ? randomFood(newSnake, gridSize) : food,
      score: newScore,
      tickInterval: calcTickInterval(newScore),
    })
  },
}))
