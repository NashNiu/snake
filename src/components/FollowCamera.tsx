// src/components/FollowCamera.tsx
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

// Truly static isometric camera — never moves or rotates
export function FollowCamera() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(36, 46, 36)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}
