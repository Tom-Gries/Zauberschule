import { describe, expect, it } from 'vitest'
import { createPurchase, potionValues, purchaseLimit } from './potions'

describe('potion purchases', () => {
  it('checks every reachable bundle combination for all totals from 1 to 200', () => {
    let checked = 0
    function visit(
      total: number,
      remaining: number,
      index: number,
      packs: number[],
      choices: number[],
    ) {
      if (index === potionValues.length) {
        const randomValues = [(total - 0.5) / 200, ...choices]
        let cursor = 0
        const purchase = createPurchase(40, () => {
          const value = randomValues[cursor++]
          if (value === undefined) throw new Error('Unexpected random choice')
          return value
        })
        expect(purchase).toEqual({ total, packs })
        expect(cursor).toBe(randomValues.length)
        checked++
        return
      }
      const value = potionValues[index]
      for (let count = 0; count <= Math.floor(remaining / value); count++) {
        const rest = remaining - count * value
        if (rest >= value && !(value > 5 && rest / value <= 3)) continue
        const branchChoices = [...choices]
        for (let taken = 0; taken < count; taken++) {
          if (value > 5 && (remaining - taken * value) / value <= 3)
            branchChoices.push(0.9)
        }
        if (rest >= value) branchChoices.push(0)
        visit(
          total,
          rest,
          index + 1,
          [...packs, ...Array<number>(count).fill(value)],
          branchChoices,
        )
      }
    }
    for (let total = 1; total <= 200; total++) visit(total, total, 0, [], [])
    expect(checked).toBe(3580)
  })
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
