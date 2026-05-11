// src/components/FollowCamera.tsx
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

export function FollowCamera() {
  const { camera } = useThree()
  const smoothPos = useRef(new THREE.Vector3(0, 4, 16))

  useFrame(() => {
    const { snake, direction } = useGameStore.getState()
    if (snake.length === 0) return

    const head = new THREE.Vector3(...snake[0])
    const dir = new THREE.Vector3(...direction).normalize()

    // 摄像机目标位置：蛇头后方8格 + 向上4格
    const target = head.clone()
      .addScaledVector(dir, -8)
      .add(new THREE.Vector3(0, 4, 0))

    smoothPos.current.lerp(target, 0.08)
    camera.position.copy(smoothPos.current)
    camera.lookAt(head)
  })

  return null
}
