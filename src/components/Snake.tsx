// src/components/Snake.tsx
import { useGameStore } from '../store/gameStore'

export function Snake() {
  const snake = useGameStore(s => s.snake)

  return (
    <group>
      {snake.map((seg, i) => {
        const t = i / Math.max(snake.length - 1, 1)
        const emissiveIntensity = 1.5 - t * 1.2
        const isHead = i === 0

        return (
          <group key={i} position={[seg[0], seg[1], seg[2]]}>
            <mesh>
              <boxGeometry args={[0.88, 0.88, 0.88]} />
              <meshStandardMaterial
                color="#39ff14"
                emissive="#39ff14"
                emissiveIntensity={emissiveIntensity}
              />
            </mesh>
            {isHead && (
              <>
                {/* 左眼 */}
                <mesh position={[-0.22, 0.18, -0.45]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
                </mesh>
                {/* 右眼 */}
                <mesh position={[0.22, 0.18, -0.45]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
                </mesh>
              </>
            )}
          </group>
        )
      })}
    </group>
  )
}
