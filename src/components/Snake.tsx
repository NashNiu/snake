// src/components/Snake.tsx
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'

const DEFAULT_DIR = new THREE.Vector3(0, 0, -1)

export function Snake() {
  const snake = useGameStore(s => s.snake)
  const direction = useGameStore(s => s.direction)
  const gridSize = useGameStore(s => s.gridSize)

  const headDir = new THREE.Vector3(...direction).normalize()
  const headQuat = new THREE.Quaternion()
  if (headDir.dot(DEFAULT_DIR) < -0.9999) {
    headQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
  } else {
    headQuat.setFromUnitVectors(DEFAULT_DIR, headDir)
  }

  const head = snake[0]
  const floorY = -gridSize

  return (
    <group>
      {/* 蛇头高度投影：垂直线 + 地面圆环 */}
      {head && (
        <>
          <Line
            points={[[head[0], head[1], head[2]], [head[0], floorY, head[2]]]}
            color="#39ff14"
            transparent
            opacity={0.3}
            lineWidth={1}
          />
          <mesh position={[head[0], floorY + 0.05, head[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.8, 16]} />
            <meshBasicMaterial color="#39ff14" transparent opacity={0.45} />
          </mesh>
        </>
      )}

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
