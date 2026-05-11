// src/components/GameScene.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'
import { Arena } from './Arena'
import { Snake } from './Snake'
import { Food } from './Food'
import { FollowCamera } from './FollowCamera'
import { useControls } from '../hooks/useControls'

export function GameScene() {
  useControls()
  const accRef = useRef(0)

  useFrame((_, delta) => {
    const { status, tickInterval, tick } = useGameStore.getState()
    if (status !== 'playing') return

    accRef.current += delta * 1000
    if (accRef.current >= tickInterval) {
      accRef.current = 0
      tick()
    }
  })

  return (
    <>
      <color attach="background" args={['#050510']} />
      <ambientLight intensity={0.08} />
      <Stars radius={120} depth={60} count={3000} factor={4} saturation={0} fade />
      <Arena />
      <Snake />
      <Food />
      <FollowCamera />
    </>
  )
}
