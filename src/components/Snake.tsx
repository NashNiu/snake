// src/components/Snake.tsx
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

const DEFAULT_DIR = new THREE.Vector3(0, 0, -1)

export function Snake() {
  const snake = useGameStore(s => s.snake)
  const direction = useGameStore(s => s.direction)

  const headDir = new THREE.Vector3(...direction).normalize()
  // Handle the case where direction is exactly opposite DEFAULT_DIR
  const headQuat = new THREE.Quaternion()
  if (headDir.dot(DEFAULT_DIR) < -0.9999) {
    headQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI)
  } else {
    headQuat.setFromUnitVectors(DEFAULT_DIR, headDir)
  }

  return (
    <group>
      {snake.map((seg, i) => {
        const t = i / Math.max(snake.length - 1, 1)
        const emissiveIntensity = 1.5 - t * 1.2
        const isHead = i === 0

        return (
          <group
            key={i}
            position={[seg[0], seg[1], seg[2]]}
            quaternion={isHead ? headQuat : undefined}
          >
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
                <mesh position={[-0.22, 0.18, -0.45]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
                </mesh>
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
