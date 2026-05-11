// src/__tests__/gameLogic.test.ts
import { describe, it, expect } from 'vitest'
import {
  addVec3, vec3Equal, isOpposite,
  isOutOfBounds, collidesWithSelf, calcTickInterval,
} from '../utils/gameLogic'
import type { Vec3 } from '../types/game'

describe('addVec3', () => {
  it('adds two vectors component-wise', () => {
    expect(addVec3([1, 0, 0], [0, 1, 0])).toEqual([1, 1, 0])
    expect(addVec3([3, -1, 2], [-1, 1, -2])).toEqual([2, 0, 0])
  })
})

describe('vec3Equal', () => {
  it('returns true for identical vectors', () => {
    expect(vec3Equal([1, 2, 3], [1, 2, 3])).toBe(true)
  })
  it('returns false when any component differs', () => {
    expect(vec3Equal([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(vec3Equal([0, 2, 3], [1, 2, 3])).toBe(false)
  })
})

describe('isOpposite', () => {
  it('returns true for exactly opposite vectors', () => {
    expect(isOpposite([1, 0, 0], [-1, 0, 0])).toBe(true)
    expect(isOpposite([0, -1, 0], [0, 1, 0])).toBe(true)
  })
  it('returns false for perpendicular or same direction', () => {
    expect(isOpposite([1, 0, 0], [0, 1, 0])).toBe(false)
    expect(isOpposite([1, 0, 0], [1, 0, 0])).toBe(false)
  })
})

describe('isOutOfBounds', () => {
  it('returns true when any component exceeds gridSize', () => {
    expect(isOutOfBounds([11, 0, 0], 10)).toBe(true)
    expect(isOutOfBounds([0, -11, 0], 10)).toBe(true)
    expect(isOutOfBounds([0, 0, 11], 10)).toBe(true)
  })
  it('returns false when on boundary or inside', () => {
    expect(isOutOfBounds([10, 0, 0], 10)).toBe(false)
    expect(isOutOfBounds([-10, -10, -10], 10)).toBe(false)
  })
})

describe('collidesWithSelf', () => {
  it('returns true when head matches a body segment', () => {
    const head: Vec3 = [1, 0, 0]
    const body: Vec3[] = [[0, 0, 0], [1, 0, 0], [2, 0, 0]]
    expect(collidesWithSelf(head, body)).toBe(true)
  })
  it('returns false when head has no collision', () => {
    const head: Vec3 = [3, 0, 0]
    const body: Vec3[] = [[0, 0, 0], [1, 0, 0], [2, 0, 0]]
    expect(collidesWithSelf(head, body)).toBe(false)
  })
})

describe('calcTickInterval', () => {
  it('returns 200ms at score 0', () => {
    expect(calcTickInterval(0)).toBe(200)
  })
  it('decreases by 5ms per point', () => {
    expect(calcTickInterval(10)).toBe(150)
    expect(calcTickInterval(20)).toBe(100)
  })
  it('floors at 80ms', () => {
    expect(calcTickInterval(100)).toBe(80)
    expect(calcTickInterval(999)).toBe(80)
  })
})
