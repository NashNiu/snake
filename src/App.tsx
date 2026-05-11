// src/App.tsx
import { Game } from './components/Game'
import { HUD } from './components/ui/HUD'
import { GameOverlay } from './components/ui/GameOverlay'
import './index.css'

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Game />
      <HUD />
      <GameOverlay />
    </div>
  )
}
