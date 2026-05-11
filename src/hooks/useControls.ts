// src/hooks/useControls.ts
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import type { Vec3 } from '../types/game'

const KEY_MAP: Record<string, Vec3> = {
  KeyW: [0, 0, -1],
  ArrowUp: [0, 0, -1],
  KeyS: [0, 0, 1],
  ArrowDown: [0, 0, 1],
  KeyA: [-1, 0, 0],
  ArrowLeft: [-1, 0, 0],
  KeyD: [1, 0, 0],
  ArrowRight: [1, 0, 0],
  Space: [0, 1, 0],
  ShiftLeft: [0, -1, 0],
  ShiftRight: [0, -1, 0],
}

export function useControls() {
  const setNextDirection = useGameStore(s => s.setNextDirection)
  const start = useGameStore(s => s.start)
  const reset = useGameStore(s => s.reset)
  const status = useGameStore(s => s.status)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.code]
      if (dir) {
        e.preventDefault()
        if (status === 'idle') {
          start()
          setNextDirection(dir)
        } else if (status === 'playing') {
          setNextDirection(dir)
        }
      }
      if (e.code === 'KeyR' && status === 'dead') {
        e.preventDefault()
        reset()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [status, setNextDirection, start, reset])
}
