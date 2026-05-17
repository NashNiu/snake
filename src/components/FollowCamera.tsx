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
