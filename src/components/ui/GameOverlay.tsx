// src/components/ui/GameOverlay.tsx
import type { CSSProperties } from 'react'
import { useGameStore } from '../../store/gameStore'

const overlayBase: CSSProperties = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  zIndex: 20,
  fontFamily: '"Courier New", monospace',
  userSelect: 'none',
}

export function GameOverlay() {
  const status = useGameStore(s => s.status)
  const score = useGameStore(s => s.score)

  if (status === 'playing') return null

  return (
    <div style={{
      ...overlayBase,
      background: status === 'dead'
        ? 'rgba(5, 5, 16, 0.85)'
        : 'rgba(5, 5, 16, 0.70)',
    }}>
      {status === 'idle' && (
        <>
          <h1 style={{
            color: '#39ff14', fontSize: 64, margin: 0,
            textShadow: '0 0 30px #39ff14, 0 0 70px #39ff14',
            letterSpacing: 8,
          }}>
            3D SNAKE
          </h1>
          <p style={{ color: '#00fff7', marginTop: 28, fontSize: 16, letterSpacing: 2 }}>
            按方向键 / WASD 开始
          </p>
          <p style={{ color: '#2a2a4a', marginTop: 10, fontSize: 12 }}>
            R 重新开始
          </p>
        </>
      )}
      {status === 'dead' && (
        <>
          <h1 style={{
            color: '#ff00ff', fontSize: 52, margin: 0,
            textShadow: '0 0 30px #ff00ff, 0 0 60px #ff00ff',
            letterSpacing: 4,
          }}>
            GAME OVER
          </h1>
          <p style={{ color: '#ffffff', fontSize: 32, margin: '24px 0 6px', fontWeight: 'bold' }}>
            得分: {score}
          </p>
          <p style={{ color: '#444', fontSize: 14, letterSpacing: 1 }}>
            按 R 重新开始
          </p>
        </>
      )}
    </div>
  )
}
