# 3D Snake 重设计 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将贪吃蛇恢复为真·3D（六自由度移动），竞技场扩大到 40³，全面升级霓虹视觉表现。

**Architecture:** 纯组件级改动，无架构变化。逻辑层（gameLogic / gameStore / useControls）先行，视觉层（Arena / FollowCamera / Snake / Food）随后，UI 文本最后。每个 task 独立可提交。

**Tech Stack:** React 18, TypeScript, Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing, Zustand, Vitest

---

## Task 1: 恢复 Y 轴逻辑 + 更新速度公式

**Files:**
- Modify: `src/utils/gameLogic.ts`
- Modify: `src/__tests__/gameLogic.test.ts`

- [ ] **Step 1: 先跑测试，确认当前哪些失败**

```bash
npm test -- --reporter=verbose
```

预期：`isOutOfBounds` 中的 Y 轴测试失败，`calcTickInterval` 部分测试失败。

- [ ] **Step 2: 更新 `src/utils/gameLogic.ts`**

将文件完整替换为：

```ts
// src/utils/gameLogic.ts
import type { Vec3 } from '../types/game'

export function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export function vec3Equal(a: Vec3, b: Vec3): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

export function isOpposite(a: Vec3, b: Vec3): boolean {
  return a[0] === -b[0] && a[1] === -b[1] && a[2] === -b[2]
}

export function isOutOfBounds(pos: Vec3, gridSize: number): boolean {
  return pos[0] > gridSize || pos[0] < -gridSize
    || pos[1] > gridSize || pos[1] < -gridSize
    || pos[2] > gridSize || pos[2] < -gridSize
}

export function collidesWithSelf(head: Vec3, body: Vec3[]): boolean {
  return body.some(seg => vec3Equal(head, seg))
}

export function randomFood(snake: Vec3[], gridSize: number): Vec3 {
  let pos: Vec3
  do {
    pos = [
      Math.floor(Math.random() * (gridSize * 2 + 1)) - gridSize,
      Math.floor(Math.random() * (gridSize * 2 + 1)) - gridSize,
      Math.floor(Math.random() * (gridSize * 2 + 1)) - gridSize,
    ]
  } while (snake.some(seg => vec3Equal(seg, pos)))
  return pos
}

export function calcTickInterval(score: number): number {
  return Math.max(80, 200 - score * 3)
}
```

- [ ] **Step 3: 更新 `src/__tests__/gameLogic.test.ts`**

```ts
// src/__tests__/gameLogic.test.ts
import { describe, it, expect } from 'vitest'
import {
  addVec3, vec3Equal, isOpposite,
  isOutOfBounds, collidesWithSelf, randomFood, calcTickInterval,
} from '../utils/gameLogic'
import type { Vec3 } from '../types/game'

describe('addVec3', () => {
  it('adds two vectors component-wise', () => {
    expect(addVec3([1, 0, 0], [0, 1, 0])).toEqual([1, 1, 0])
    expect(addVec3([3, -1, 2], [-1, 1, -2])).toEqual([2, 0, 0])
  })
})

describe('vec3Equal', () => {
  it('returns true for identical vectors', () => {
    expect(vec3Equal([1, 2, 3], [1, 2, 3])).toBe(true)
  })
  it('returns false when any component differs', () => {
    expect(vec3Equal([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(vec3Equal([0, 2, 3], [1, 2, 3])).toBe(false)
  })
})

describe('isOpposite', () => {
  it('returns true for exactly opposite vectors', () => {
    expect(isOpposite([1, 0, 0], [-1, 0, 0])).toBe(true)
    expect(isOpposite([0, -1, 0], [0, 1, 0])).toBe(true)
  })
  it('returns false for perpendicular or same direction', () => {
    expect(isOpposite([1, 0, 0], [0, 1, 0])).toBe(false)
    expect(isOpposite([1, 0, 0], [1, 0, 0])).toBe(false)
  })
})

describe('isOutOfBounds', () => {
  it('returns true when X exceeds gridSize', () => {
    expect(isOutOfBounds([11, 0, 0], 10)).toBe(true)
    expect(isOutOfBounds([-11, 0, 0], 10)).toBe(true)
  })
  it('returns true when Y exceeds gridSize', () => {
    expect(isOutOfBounds([0, 11, 0], 10)).toBe(true)
    expect(isOutOfBounds([0, -11, 0], 10)).toBe(true)
  })
  it('returns true when Z exceeds gridSize', () => {
    expect(isOutOfBounds([0, 0, 11], 10)).toBe(true)
    expect(isOutOfBounds([0, 0, -11], 10)).toBe(true)
  })
  it('returns false when on boundary or inside', () => {
    expect(isOutOfBounds([10, 0, 0], 10)).toBe(false)
    expect(isOutOfBounds([-10, -10, -10], 10)).toBe(false)
    expect(isOutOfBounds([0, 10, 0], 10)).toBe(false)
  })
})

describe('collidesWithSelf', () => {
  it('returns true when head matches a body segment', () => {
    const head: Vec3 = [1, 0, 0]
    const body: Vec3[] = [[0, 0, 0], [1, 0, 0], [2, 0, 0]]
    expect(collidesWithSelf(head, body)).toBe(true)
  })
  it('returns false when head has no collision', () => {
    const head: Vec3 = [3, 0, 0]
    const body: Vec3[] = [[0, 0, 0], [1, 0, 0], [2, 0, 0]]
    expect(collidesWithSelf(head, body)).toBe(false)
  })
})

describe('randomFood', () => {
  it('returns a position within bounds', () => {
    const snake: Vec3[] = [[0, 0, 0]]
    for (let i = 0; i < 20; i++) {
      const pos = randomFood(snake, 10)
      expect(pos[0]).toBeGreaterThanOrEqual(-10)
      expect(pos[0]).toBeLessThanOrEqual(10)
      expect(pos[1]).toBeGreaterThanOrEqual(-10)
      expect(pos[1]).toBeLessThanOrEqual(10)
      expect(pos[2]).toBeGreaterThanOrEqual(-10)
      expect(pos[2]).toBeLessThanOrEqual(10)
    }
  })
  it('never spawns on the snake body', () => {
    const snake: Vec3[] = Array.from({ length: 50 }, (_, i) => [i, 0, 0] as Vec3)
    for (let i = 0; i < 10; i++) {
      const pos = randomFood(snake, 25)
      expect(snake.some(s => s[0] === pos[0] && s[1] === pos[1] && s[2] === pos[2])).toBe(false)
    }
  })
})

describe('calcTickInterval', () => {
  it('returns 200ms at score 0', () => {
    expect(calcTickInterval(0)).toBe(200)
  })
  it('decreases by 3ms per point', () => {
    expect(calcTickInterval(10)).toBe(170)
    expect(calcTickInterval(20)).toBe(140)
  })
  it('floors at 80ms', () => {
    expect(calcTickInterval(100)).toBe(80)
    expect(calcTickInterval(999)).toBe(80)
  })
})
```

- [ ] **Step 4: 跑测试，确认全部通过**

```bash
npm test -- --reporter=verbose
```

预期：所有测试 PASS。

- [ ] **Step 5: 提交**

```bash
git add src/utils/gameLogic.ts src/__tests__/gameLogic.test.ts
git commit -m "feat: restore Y-axis bounds/food, update speed formula to *3"
```

---

## Task 2: 扩大 gridSize + 修复 store 测试

**Files:**
- Modify: `src/store/gameStore.ts`
- Modify: `src/__tests__/gameStore.test.ts`

- [ ] **Step 1: 修改 `src/store/gameStore.ts`**

只改第 9 行：

```ts
const GRID_SIZE = 20
```

- [ ] **Step 2: 修复 `src/__tests__/gameStore.test.ts` 中的 tickInterval 测试**

找到 `'decreases tickInterval as score increases'` 这个 it block，将 expectation 从 `150` 改为 `170`（score 9→10，`200 - 10*3 = 170`）：

```ts
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
```

- [ ] **Step 3: 跑测试，确认全部通过**

```bash
npm test -- --reporter=verbose
```

预期：所有测试 PASS。

- [ ] **Step 4: 提交**

```bash
git add src/store/gameStore.ts src/__tests__/gameStore.test.ts
git commit -m "feat: expand GRID_SIZE to 20, fix tickInterval test for new formula"
```

---

## Task 3: 恢复六方向控制

**Files:**
- Modify: `src/hooks/useControls.ts`

- [ ] **Step 1: 更新 `src/hooks/useControls.ts`**

```ts
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
```

- [ ] **Step 2: 跑测试确认无回归**

```bash
npm test
```

预期：PASS。

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useControls.ts
git commit -m "feat: restore Space/Shift Y-axis controls"
```

---

## Task 4: Arena 重设计（3D 线框 + 顶角装饰）

**Files:**
- Modify: `src/components/Arena.tsx`

- [ ] **Step 1: 完整替换 `src/components/Arena.tsx`**

```tsx
// src/components/Arena.tsx
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

const CORNER_SIGNS: [number, number, number][] = [
  [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
  [-1, -1,  1], [1, -1,  1], [-1, 1,  1], [1, 1,  1],
]

export function Arena() {
  const gridSize = useGameStore(s => s.gridSize)
  const size = gridSize * 2

  return (
    <group>
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color="#00fff7"
          transparent
          opacity={0.018}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color="#00fff7" wireframe transparent opacity={0.5} />
      </mesh>

      {CORNER_SIGNS.map(([sx, sy, sz], i) => (
        <group key={i} position={[sx * gridSize, sy * gridSize, sz * gridSize]}>
          <mesh>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial
              color="#00fff7"
              emissive="#00fff7"
              emissiveIntensity={3}
            />
          </mesh>
          <pointLight color="#00fff7" intensity={1.5} distance={8} decay={2} />
        </group>
      ))}
    </group>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Arena.tsx
git commit -m "feat: redesign Arena as 3D cube wireframe with glowing corner accents"
```

---

## Task 5: 摄像机适配大空间

**Files:**
- Modify: `src/components/FollowCamera.tsx`

- [ ] **Step 1: 完整替换 `src/components/FollowCamera.tsx`**

```tsx
// src/components/FollowCamera.tsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function FollowCamera() {
  const { camera } = useThree()
  const smoothPos = useRef(new THREE.Vector3(0, 6, 12))
  const headVec = useRef(new THREE.Vector3())
  const dirVec = useRef(new THREE.Vector3())
  const targetVec = useRef(new THREE.Vector3())

  useFrame(() => {
    const { snake, direction } = useGameStore.getState()
    if (snake.length === 0) return

    headVec.current.set(...snake[0])
    dirVec.current.set(...direction).normalize()

    // 目标位置：蛇头移动方向正后方 12 格 + 向上 6 格
    targetVec.current
      .copy(headVec.current)
      .addScaledVector(dirVec.current, -12)
    targetVec.current.y += 6

    smoothPos.current.lerp(targetVec.current, 0.05)
    camera.position.copy(smoothPos.current)
    camera.lookAt(headVec.current)
  })

  return null
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/FollowCamera.tsx
git commit -m "feat: update camera follow distance to -12/+6, lerp 0.05 for larger arena"
```

---

## Task 6: 蛇身视觉升级（白色蛇头 + 更强渐变）

**Files:**
- Modify: `src/components/Snake.tsx`

- [ ] **Step 1: 完整替换 `src/components/Snake.tsx`**

```tsx
// src/components/Snake.tsx
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

const DEFAULT_DIR = new THREE.Vector3(0, 0, -1)

export function Snake() {
  const snake = useGameStore(s => s.snake)
  const direction = useGameStore(s => s.direction)

  const headDir = new THREE.Vector3(...direction).normalize()
  const headQuat = new THREE.Quaternion()
  if (headDir.dot(DEFAULT_DIR) < -0.9999) {
    headQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
  } else {
    headQuat.setFromUnitVectors(DEFAULT_DIR, headDir)
  }

  return (
    <group>
      {snake.map((seg, i) => {
        const isHead = i === 0
        const t = i / Math.max(snake.length - 1, 1)
        const color = isHead ? '#ffffff' : '#39ff14'
        const emissiveIntensity = isHead ? 2.0 : Math.max(0.05, 1.2 * (1 - t))

        return (
          <group
            key={i}
            position={[seg[0], seg[1], seg[2]]}
            quaternion={isHead ? headQuat : undefined}
          >
            <mesh>
              <boxGeometry args={[0.88, 0.88, 0.88]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {isHead && (
              <>
                <mesh position={[-0.22, 0.18, -0.45]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial color="#00fff7" emissive="#00fff7" emissiveIntensity={2} />
                </mesh>
                <mesh position={[0.22, 0.18, -0.45]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial color="#00fff7" emissive="#00fff7" emissiveIntensity={2} />
                </mesh>
              </>
            )}
          </group>
        )
      })}
    </group>
  )
}
```

> 关键变化：蛇头颜色 `#ffffff`（白色高亮），眼睛改为青色 `#00fff7`；蛇身 emissiveIntensity 从 1.2 线性降至 0.05。

- [ ] **Step 2: 提交**

```bash
git add src/components/Snake.tsx
git commit -m "feat: white snake head, stronger tail fade gradient"
```

---

## Task 7: 食物升级（八面体 + 自转）

**Files:**
- Modify: `src/components/Food.tsx`

- [ ] **Step 1: 完整替换 `src/components/Food.tsx`**

```tsx
// src/components/Food.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function Food() {
  const food = useGameStore(s => s.food)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 1.8
      meshRef.current.rotation.x = clock.elapsedTime * 0.9
    }
  })

  return (
    <group position={[food[0], food[1], food[2]]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2.5}
        />
      </mesh>
      <pointLight color="#ff00ff" intensity={5} distance={6} decay={2} />
    </group>
  )
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Food.tsx
git commit -m "feat: food redesign - octahedron geometry with rotation animation"
```

---

## Task 8: UI 文本更新

**Files:**
- Modify: `src/components/ui/GameOverlay.tsx`
- Modify: `src/components/ui/HUD.tsx`

- [ ] **Step 1: 完整替换 `src/components/ui/GameOverlay.tsx`**

```tsx
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
            Space 上升 &nbsp;·&nbsp; Shift 下降 &nbsp;·&nbsp; R 重新开始
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
```

- [ ] **Step 2: 完整替换 `src/components/ui/HUD.tsx`**

```tsx
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
```

- [ ] **Step 3: 跑测试确认无回归**

```bash
npm test
```

预期：PASS。

- [ ] **Step 4: 提交**

```bash
git add src/components/ui/GameOverlay.tsx src/components/ui/HUD.tsx
git commit -m "feat: restore 3D SNAKE title and Y-axis control hints in UI"
```

---

## Task 9: 更新 README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 完整替换 `README.md`**

```markdown
# 3D Snake Game

A neon-themed 3D snake game built with React, Three.js, and React Three Fiber. Navigate a glowing snake through a 3D arena in full six-degree-of-freedom movement — eat food, grow longer, and survive as the speed ramps up.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.165-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-4-purple)

## Features

- **True 3D movement** — 6 degrees of freedom (X/Y/Z all three axes)
- **Neon aesthetic** — glowing white snake head, green body fade, magenta octahedron food, cyan arena wireframe, Bloom post-processing
- **Glowing arena** — 3D cube wireframe with 8 illuminated corner accents
- **Dynamic difficulty** — tick interval shrinks as score climbs (200ms → 80ms cap)
- **Third-person follow camera** — smooth camera tracking behind the snake head
- **Starfield background** — ambient Three.js star particles

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 + TypeScript |
| 3D Rendering | Three.js + React Three Fiber |
| 3D Helpers | @react-three/drei |
| Post-processing | @react-three/postprocessing (Bloom) |
| State Management | Zustand |
| Build Tool | Vite |
| Testing | Vitest + jsdom |

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
\`\`\`

## Controls

| Key | Action |
|---|---|
| `W` / `↑` | Move forward (−Z) |
| `S` / `↓` | Move backward (+Z) |
| `A` / `←` | Move left (−X) |
| `D` / `→` | Move right (+X) |
| `Space` | Move up (+Y) |
| `Shift` | Move down (−Y) |
| `R` | Restart after game over |

Press any movement key on the start screen to begin.

## Project Structure

\`\`\`
src/
├── components/
│   ├── ui/
│   │   ├── HUD.tsx          # Score + speed display overlay
│   │   └── GameOverlay.tsx  # Start screen and game over screen
│   ├── Arena.tsx            # 3D cube wireframe with glowing corners
│   ├── Food.tsx             # Spinning magenta octahedron food gem
│   ├── Game.tsx             # Canvas + Bloom effect wrapper
│   ├── GameScene.tsx        # Main game loop (useFrame)
│   ├── Snake.tsx            # Snake mesh: white head + green fade body
│   └── FollowCamera.tsx     # Third-person smooth follow camera
├── hooks/
│   └── useControls.ts       # Keyboard input + direction queue
├── store/
│   └── gameStore.ts         # Zustand store — all game state & tick logic
├── types/
│   └── game.ts              # Vec3, GameState, GameActions types
└── utils/
    └── gameLogic.ts         # Pure functions: collision, food spawn, difficulty
\`\`\`

## Game Logic

- **Grid**: 40×40×40 unit 3D arena (gridSize 20, bounds ±20 on all axes)
- **Collision**: hitting any wall face or running into your own body ends the game
- **Growth**: eating food appends a new segment to the snake tail
- **Speed**: `tickInterval = max(80, 200 - score × 3)` ms — reaches max speed at score 40
- **Food**: random X/Y/Z position re-rolled until it doesn't overlap the snake body
```

- [ ] **Step 2: 提交**

```bash
git add README.md
git commit -m "docs: update README for 3D redesign (gridSize 20, 6DOF, new visuals)"
```

---

## 验收检查

所有 task 完成后：

```bash
npm test
npm run build
npm run dev
```

在浏览器中验证：
- [ ] 开始界面显示 `3D SNAKE`，副提示包含 Space/Shift
- [ ] 按 Space 蛇向上移动，按 Shift 向下，WASD/方向键正常
- [ ] 竞技场是 3D 线框立方体，8 个顶角有青色发光球
- [ ] 蛇头为白色，蛇身从亮绿渐变到暗绿
- [ ] 食物是自转的品红八面体
- [ ] 碰到边界（任意方向）游戏结束
- [ ] 速度随分数提升，第 40 分达到极速
