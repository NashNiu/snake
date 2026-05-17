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
