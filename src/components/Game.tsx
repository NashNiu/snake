// src/components/Game.tsx
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { GameScene } from './GameScene'

export function Game() {
  return (
    <Canvas
      camera={{ position: [0, 4, 16], fov: 60, near: 0.1, far: 500 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <GameScene />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.5}
        />
      </EffectComposer>
    </Canvas>
  )
}
