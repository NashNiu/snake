// src/components/Food.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function Food() {
  const food = useGameStore(s => s.food)
  const gridSize = useGameStore(s => s.gridSize)
  const meshRef = useRef<THREE.Mesh>(null)
  const floorY = -gridSize

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

      {/* 高度投影：让玩家判断食物在哪个高度 */}
      <Line
        points={[[0, 0, 0], [0, floorY - food[1], 0]]}
        color="#ff00ff"
        transparent
        opacity={0.25}
        lineWidth={1}
      />
      <mesh position={[0, floorY - food[1] + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.65, 16]} />
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}
