// src/components/ui/HUD.tsx
import { useGameStore } from '../../store/gameStore'
import type { Vec3 } from '../../types/game'

function dirLabel(dir: Vec3): string {
  if (dir[0] > 0) return 'D → +X'
  if (dir[0] < 0) return 'A ← −X'
  if (dir[2] < 0) return 'W ↑ −Z'
  if (dir[2] > 0) return 'S ↓ +Z'
  return ''
}

function AxisBar({ axis, pos, gridSize }: { axis: string; pos: number; gridSize: number }) {
  const pct = (pos + gridSize) / (gridSize * 2)
  const dist = gridSize - Math.abs(pos)
  const barColor = dist <= 3 ? '#ff4444' : dist <= 7 ? '#ffaa00' : '#39ff14'
  const valColor = dist <= 3 ? '#ff4444' : dist <= 7 ? '#ffaa00' : '#aaa'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
      <span style={{ color: '#00fff7', fontSize: 11, minWidth: 12 }}>{axis}</span>
      <div style={{
        position: 'relative', width: 100, height: 6,
        background: '#1a1a2e', borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${pct * 100}%`,
          background: barColor,
          borderRadius: 3,
          transition: 'width 0.1s, background 0.1s',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 1, background: '#2a2a4a',
        }} />
      </div>
      <span style={{ color: valColor, fontSize: 11, minWidth: 28, textAlign: 'right' }}>
        {pos > 0 ? '+' : ''}{pos}
      </span>
    </div>
  )
}

export function HUD() {
  const score = useGameStore(s => s.score)
  const tickInterval = useGameStore(s => s.tickInterval)
  const status = useGameStore(s => s.status)
  const direction = useGameStore(s => s.direction)
  const snake = useGameStore(s => s.snake)
  const gridSize = useGameStore(s => s.gridSize)

  if (status !== 'playing') return null

  const speedLabel =
    tickInterval >= 160 ? '慢' :
    tickInterval >= 120 ? '中' :
    tickInterval >= 100 ? '快' : '极速'

  const head = snake[0] ?? [0, 0, 0]

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none', zIndex: 10,
      fontFamily: '"Courier New", monospace',
      userSelect: 'none',
    }}>
      {/* 左上：得分 */}
      <div style={{
        position: 'absolute', top: 20, left: 24,
        color: '#39ff14', fontSize: 22, fontWeight: 'bold',
        textShadow: '0 0 10px #39ff14',
      }}>
        得分: {score}
      </div>

      {/* 右上：速度 */}
      <div style={{
        position: 'absolute', top: 20, right: 24,
        color: '#00fff7', fontSize: 18,
        textShadow: '0 0 8px #00fff7',
      }}>
        速度: {speedLabel}
      </div>

      {/* 左下：方向 + 位置条 */}
      <div style={{
        position: 'absolute', bottom: 20, left: 24,
      }}>
        <div style={{
          color: '#39ff14', fontSize: 13, marginBottom: 8,
          textShadow: '0 0 6px #39ff14',
        }}>
          {dirLabel(direction)}
        </div>
        <AxisBar axis="X" pos={head[0]} gridSize={gridSize} />
        <AxisBar axis="Z" pos={head[2]} gridSize={gridSize} />
      </div>

      {/* 右下：操作提示 */}
      <div style={{
        position: 'absolute', bottom: 24, right: 24,
        color: '#333', fontSize: 11, textAlign: 'right', lineHeight: '1.6',
      }}>
        WASD / 方向键
      </div>
    </div>
  )
}
