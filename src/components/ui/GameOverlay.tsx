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
        ? 'rgba(5, 5, 16, 0.82)'
        : 'rgba(5, 5, 16, 0.65)',
    }}>
      {status === 'idle' && (
        <>
          <h1 style={{
            color: '#39ff14', fontSize: 56, margin: 0,
            textShadow: '0 0 30px #39ff14, 0 0 60px #39ff14',
            letterSpacing: 4,
          }}>
            3D SNAKE
          </h1>
          <p style={{ color: '#00fff7', marginTop: 24, fontSize: 16 }}>
            按方向键开始游戏
          </p>
          <p style={{ color: '#444', marginTop: 8, fontSize: 12 }}>
            Space 上升 &nbsp;·&nbsp; Shift 下降
          </p>
        </>
      )}
      {status === 'dead' && (
        <>
          <h1 style={{
            color: '#ff00ff', fontSize: 48, margin: 0,
            textShadow: '0 0 30px #ff00ff',
          }}>
            游戏结束
          </h1>
          <p style={{ color: '#ffffff', fontSize: 28, margin: '20px 0 8px' }}>
            得分: {score}
          </p>
          <p style={{ color: '#555', fontSize: 14 }}>
            按 R 重新开始
          </p>
        </>
      )}
    </div>
  )
}
