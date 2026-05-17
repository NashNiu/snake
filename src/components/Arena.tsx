// src/components/Arena.tsx
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
      {/* 线框边缘：只画 12 条边，不填充面 */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshBasicMaterial color="#00fff7" wireframe transparent opacity={0.6} />
      </mesh>

      {/* 底面参考网格：每 5 格一线，帮助判断 XZ 位置 */}
      <gridHelper
        args={[size, size / 5, '#00fff7', '#0d2030']}
        position={[0, -gridSize, 0]}
      />

      {/* 顶面网格：同样稀疏，帮助判断是否快撞顶 */}
      <gridHelper
        args={[size, size / 5, '#00fff7', '#0d2030']}
        position={[0, gridSize, 0]}
      />

      {/* 8 顶角发光球 */}
      {CORNER_SIGNS.map(([sx, sy, sz], i) => (
        <group key={i} position={[sx * gridSize, sy * gridSize, sz * gridSize]}>
          <mesh>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial
              color="#00fff7"
              emissive="#00fff7"
              emissiveIntensity={4}
            />
          </mesh>
          <pointLight color="#00fff7" intensity={2} distance={10} decay={2} />
        </group>
      ))}
    </group>
  )
}
