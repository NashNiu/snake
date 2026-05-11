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
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 2.5) * 0.3
    }
  })

  return (
    <group position={[food[0], food[1], food[2]]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight color="#ff00ff" intensity={4} distance={5} decay={2} />
    </group>
  )
}
