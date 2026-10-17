import { beforeEach, describe, expect, it } from 'vitest'
import { loadCoins, saveCoins } from './storage'

describe('coin persistence', () => {
  beforeEach(() => localStorage.clear())
  it('defaults to zero and survives reading again after a reload', () => {
    expect(loadCoins()).toBe(0)
    saveCoins(130)
    expect(loadCoins()).toBe(130)
  })
  it('ignores invalid stored values', () => {
    localStorage.setItem('zauberschmiede.coins.v1', '-20')
    expect(loadCoins()).toBe(0)
  })
})
