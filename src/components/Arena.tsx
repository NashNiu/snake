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
