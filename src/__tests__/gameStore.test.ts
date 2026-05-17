// src/__tests__/gameStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../store/gameStore'

beforeEach(() => {
  useGameStore.getState().reset()
})

describe('initial state', () => {
  it('starts as idle', () => {
    expect(useGameStore.getState().status).toBe('idle')
  })
  it('has 3-segment snake', () => {
    expect(useGameStore.getState().snake.length).toBe(3)
  })
})

describe('start', () => {
  it('sets status to playing', () => {
    useGameStore.getState().start()
    expect(useGameStore.getState().status).toBe('playing')
  })
})

describe('setNextDirection', () => {
  it('updates nextDirection when not opposite', () => {
    useGameStore.getState().start()
    useGameStore.getState().setNextDirection([0, 1, 0])
    expect(useGameStore.getState().nextDirection).toEqual([0, 1, 0])
  })
  it('ignores direction exactly opposite to current', () => {
    // initial direction is [1,0,0]
    useGameStore.getState().start()
    useGameStore.getState().setNextDirection([-1, 0, 0])
    expect(useGameStore.getState().nextDirection).toEqual([1, 0, 0])
  })
})

describe('tick', () => {
  it('does nothing when status is not playing', () => {
    const before = useGameStore.getState().snake[0]
    useGameStore.getState().tick()
    expect(useGameStore.getState().snake[0]).toEqual(before)
  })

  it('moves snake head by current direction', () => {
    useGameStore.getState().start()
    const { snake, direction } = useGameStore.getState()
    const head = snake[0]
    useGameStore.getState().tick()
    expect(useGameStore.getState().snake[0]).toEqual([
      head[0] + direction[0],
      head[1] + direction[1],
      head[2] + direction[2],
    ])
  })

  it('sets status to dead on wall collision', () => {
    useGameStore.setState({
      status: 'playing',
      snake: [[10, 0, 0], [9, 0, 0]],
      direction: [1, 0, 0],
      nextDirection: [1, 0, 0],
      gridSize: 10,
    })
    useGameStore.getState().tick()
    expect(useGameStore.getState().status).toBe('dead')
  })

  it('sets status to dead on self collision', () => {
    useGameStore.setState({
      status: 'playing',
      snake: [[1, 0, 0], [0, 0, 0], [2, 0, 0]],
      direction: [1, 0, 0],
      nextDirection: [1, 0, 0],
      gridSize: 10,
    })
    // next head = [2,0,0] which matches snake[2]
    useGameStore.getState().tick()
    expect(useGameStore.getState().status).toBe('dead')
  })

  it('grows snake and increases score when eating food', () => {
    useGameStore.setState({
      status: 'playing',
      snake: [[0, 0, 0], [-1, 0, 0]],
      direction: [1, 0, 0],
      nextDirection: [1, 0, 0],
      food: [1, 0, 0],
      score: 0,
      gridSize: 10,
    })
    useGameStore.getState().tick()
    const state = useGameStore.getState()
    expect(state.snake.length).toBe(3)
    expect(state.score).toBe(1)
  })

  it('does not grow snake when not eating food', () => {
    useGameStore.setState({
      status: 'playing',
      snake: [[0, 0, 0], [-1, 0, 0]],
      direction: [1, 0, 0],
      nextDirection: [1, 0, 0],
      food: [0, 5, 0],
      score: 0,
      gridSize: 10,
    })
    useGameStore.getState().tick()
    expect(useGameStore.getState().snake.length).toBe(2)
  })

  it('decreases tickInterval as score increases', () => {
    useGameStore.setState({
      status: 'playing',
      snake: [[0, 0, 0], [-1, 0, 0]],
      direction: [1, 0, 0],
      nextDirection: [1, 0, 0],
      food: [1, 0, 0],
      score: 9,
      tickInterval: 173,
      gridSize: 10,
    })
    useGameStore.getState().tick()
    expect(useGameStore.getState().tickInterval).toBe(170)
  })
})

describe('reset', () => {
  it('restores initial state and sets status to idle', () => {
    useGameStore.getState().start()
    useGameStore.getState().reset()
    const state = useGameStore.getState()
    expect(state.status).toBe('idle')
    expect(state.score).toBe(0)
    expect(state.snake.length).toBe(3)
  })
})
