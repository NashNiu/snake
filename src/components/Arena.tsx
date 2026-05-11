// src/components/Arena.tsx
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function Arena() {
  const gridSize = useGameStore(s => s.gridSize)
  const size = gridSize * 2

  return (
    <group>
      {/* 半透明内表面，让玩家感知边界 */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color="#00fff7"
          transparent
          opacity={0.025}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* 霓虹线框 */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial
          color="#00fff7"
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  )
}
