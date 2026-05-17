// src/utils/gameLogic.ts
import type { Vec3 } from '../types/game'

export function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

export function vec3Equal(a: Vec3, b: Vec3): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
}

export function isOpposite(a: Vec3, b: Vec3): boolean {
  return a[0] === -b[0] && a[1] === -b[1] && a[2] === -b[2]
}

export function isOutOfBounds(pos: Vec3, gridSize: number): boolean {
  return pos[0] > gridSize || pos[0] < -gridSize
    || pos[1] > gridSize || pos[1] < -gridSize
    || pos[2] > gridSize || pos[2] < -gridSize
}

export function collidesWithSelf(head: Vec3, body: Vec3[]): boolean {
  return body.some(seg => vec3Equal(head, seg))
}

export function randomFood(snake: Vec3[], gridSize: number): Vec3 {
  let pos: Vec3
  do {
    pos = [
      Math.floor(Math.random() * (gridSize * 2 + 1)) - gridSize,
      Math.floor(Math.random() * (gridSize * 2 + 1)) - gridSize,
      Math.floor(Math.random() * (gridSize * 2 + 1)) - gridSize,
    ]
  } while (snake.some(seg => vec3Equal(seg, pos)))
  return pos
}

export function calcTickInterval(score: number): number {
  return Math.max(80, 200 - score * 3)
}
