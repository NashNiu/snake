# 3D Snake Game

A neon-themed 3D snake game built with React, Three.js, and React Three Fiber. Navigate a glowing snake through a 3D arena in full six-degree-of-freedom movement — eat food, grow longer, and survive as the speed ramps up.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.165-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-4-purple)

## Features

- **True 3D movement** — 6 degrees of freedom (X/Y/Z all three axes)
- **Neon aesthetic** — glowing white snake head, green body fade, magenta octahedron food, cyan arena wireframe, Bloom post-processing
- **Glowing arena** — 3D cube wireframe with 8 illuminated corner accents
- **Dynamic difficulty** — tick interval shrinks as score climbs (200ms → 80ms cap)
- **Third-person follow camera** — smooth camera tracking behind the snake head
- **Starfield background** — ambient Three.js star particles

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 + TypeScript |
| 3D Rendering | Three.js + React Three Fiber |
| 3D Helpers | @react-three/drei |
| Post-processing | @react-three/postprocessing (Bloom) |
| State Management | Zustand |
| Build Tool | Vite |
| Testing | Vitest + jsdom |

## Getting Started

```bash
npm install
npm run dev
npm test
npm run build
```

## Controls

| Key | Action |
|---|---|
| `W` / `↑` | Move forward (−Z) |
| `S` / `↓` | Move backward (+Z) |
| `A` / `←` | Move left (−X) |
| `D` / `→` | Move right (+X) |
| `Space` | Move up (+Y) |
| `Shift` | Move down (−Y) |
| `R` | Restart after game over |

Press any movement key on the start screen to begin.

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── HUD.tsx          # Score + speed display overlay
│   │   └── GameOverlay.tsx  # Start screen and game over screen
│   ├── Arena.tsx            # 3D cube wireframe with glowing corners
│   ├── Food.tsx             # Spinning magenta octahedron food gem
│   ├── Game.tsx             # Canvas + Bloom effect wrapper
│   ├── GameScene.tsx        # Main game loop (useFrame)
│   ├── Snake.tsx            # Snake mesh: white head + green fade body
│   └── FollowCamera.tsx     # Third-person smooth follow camera
├── hooks/
│   └── useControls.ts       # Keyboard input + direction queue
├── store/
│   └── gameStore.ts         # Zustand store — all game state & tick logic
├── types/
│   └── game.ts              # Vec3, GameState, GameActions types
└── utils/
    └── gameLogic.ts         # Pure functions: collision, food spawn, difficulty
```

## Game Logic

- **Grid**: 40×40×40 unit 3D arena (gridSize 20, bounds ±20 on all axes)
- **Collision**: hitting any wall face or running into your own body ends the game
- **Growth**: eating food appends a new segment to the snake tail
- **Speed**: `tickInterval = max(80, 200 - score × 3)` ms — reaches max speed at score 40
- **Food**: random X/Y/Z position re-rolled until it doesn't overlap the snake body
