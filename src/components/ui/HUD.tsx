// src/components/ui/HUD.tsx
import { useGameStore } from '../../store/gameStore'

export function HUD() {
  const score = useGameStore(s => s.score)
  const tickInterval = useGameStore(s => s.tickInterval)
  const status = useGameStore(s => s.status)

  if (status !== 'playing') return null

  const speedLabel =
    tickInterval >= 160 ? '慢' :
    tickInterval >= 120 ? '中' :
    tickInterval >= 100 ? '快' : '极速'

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      pointerEvents: 'none', zIndex: 10,
      fontFamily: '"Courier New", monospace',
      userSelect: 'none',
    }}>
      <div style={{
        position: 'absolute', top: 20, left: 24,
        color: '#39ff14', fontSize: 22, fontWeight: 'bold',
        textShadow: '0 0 10px #39ff14',
      }}>
        得分: {score}
      </div>
      <div style={{
        position: 'absolute', top: 20, right: 24,
        color: '#00fff7', fontSize: 18,
        textShadow: '0 0 8px #00fff7',
      }}>
        速度: {speedLabel}
      </div>
      <div style={{
        position: 'absolute', bottom: 24, left: 24,
        color: '#444', fontSize: 12, lineHeight: '1.6',
      }}>
        WASD / 方向键 移动 &nbsp;·&nbsp; Space 上升 &nbsp;·&nbsp; Shift 下降
      </div>
    </div>
  )
}
