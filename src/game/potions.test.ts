import { describe, expect, it } from 'vitest'
import { createPurchase, potionValues, purchaseLimit } from './potions'

describe('potion purchases', () => {
  it('increases the number range after ten completed purchases', () => {
    expect([0, 9, 10, 19, 20, 30, 40, 100].map(purchaseLimit)).toEqual([
      10, 10, 20, 20, 50, 100, 200, 200,
    ])
  })
  it('creates countable packs matching the total within each level', () => {
    for (const completed of [0, 10, 20, 30, 40, 100]) {
      for (let i = 0; i < 300; i++) {
        const { total, packs } = createPurchase(completed)
        expect(total).toBeGreaterThanOrEqual(1)
        expect(total).toBeLessThanOrEqual(purchaseLimit(completed))
        expect(packs.reduce((sum, value) => sum + value, 0)).toBe(total)
        expect(
          packs.every((value) =>
            potionValues.some((allowed) => allowed === value),
          ),
        ).toBe(true)
        expect(packs.length).toBeLessThanOrEqual(30)
      }
    }
  })
})
