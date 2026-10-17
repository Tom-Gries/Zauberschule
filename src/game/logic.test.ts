import { describe, expect, it } from 'vitest'
import {
  createFoodField,
  createNextRound,
  createRound,
  createProblem,
  formatSolution,
  hasSolution,
  isCorrectAnswer,
  rewardForFoods,
} from './logic'
import type { Food, Problem } from './types'

const food = (id: number, value: number, isGold = false): Food => ({
  id,
  value,
  isGold,
  kind: 'apple',
})

describe('answer checking', () => {
  it('accepts two missing addends', () => {
    const problem: Problem = { kind: 'pair', operation: 'addition', target: 12 }
    expect(isCorrectAnswer(problem, [food(0, 5), food(1, 7)])).toBe(true)
  })
  it('accepts subtraction with the selected order', () => {
    const problem: Problem = {
      kind: 'pair',
      operation: 'subtraction',
      target: 3,
    }
    expect(isCorrectAnswer(problem, [food(0, 7), food(1, 4)])).toBe(true)
    expect(isCorrectAnswer(problem, [food(1, 4), food(0, 7)])).toBe(false)
  })
  it('handles one missing number on either side', () => {
    expect(
      isCorrectAnswer(
        {
          kind: 'single',
          operation: 'addition',
          fixed: 5,
          target: 12,
          missing: 'right',
        },
        [food(0, 7)],
      ),
    ).toBe(true)
    expect(
      isCorrectAnswer(
        {
          kind: 'single',
          operation: 'subtraction',
          fixed: 4,
          target: 3,
          missing: 'left',
        },
        [food(0, 7)],
      ),
    ).toBe(true)
  })
  it('allows matching values in different positions, but not the same position twice', () => {
    const problem: Problem = { kind: 'pair', operation: 'addition', target: 10 }
    expect(isCorrectAnswer(problem, [food(0, 5), food(1, 5)])).toBe(true)
    expect(isCorrectAnswer(problem, [food(0, 5), food(0, 5)])).toBe(false)
  })
  it('rejects incorrect answers and wrong selection counts', () => {
    const problem: Problem = { kind: 'pair', operation: 'addition', target: 10 }
    expect(isCorrectAnswer(problem, [food(0, 3), food(1, 4)])).toBe(false)
    expect(isCorrectAnswer(problem, [food(0, 10)])).toBe(false)
  })
  it('formats a solved subtraction in the correct operand order', () => {
    expect(
      formatSolution({ kind: 'pair', operation: 'subtraction', target: 3 }, [
        food(0, 7),
        food(1, 4),
      ]),
    ).toBe('7 − 4 = 3')
    expect(
      formatSolution(
        {
          kind: 'single',
          operation: 'subtraction',
          fixed: 4,
          target: 3,
          missing: 'left',
        },
        [food(0, 7)],
      ),
    ).toBe('7 − 4 = 3')
  })
})

describe('round generation and rewards', () => {
  it('always creates a 3 by 4 food field and a solvable problem', () => {
    for (let seed = 1; seed <= 80; seed++) {
      let state = seed
      const random = () =>
        ((state = (state * 16807) % 2147483647) - 1) / 2147483646
      const round = createRound(random)
      expect(round.foods).toHaveLength(12)
      expect(hasSolution(round.problem, round.foods)).toBe(true)
    }
  })
  it('includes regular exercises where both numbers are missing', () => {
    let state = 31
    const random = () =>
      ((state = (state * 16807) % 2147483647) - 1) / 2147483646
    const rounds = Array.from({ length: 60 }, () => createRound(random))
    expect(
      rounds.filter(({ problem }) => problem.kind === 'pair').length,
    ).toBeGreaterThan(15)
  })
  it('replaces only the food that was eaten', () => {
    const field = Array.from({ length: 12 }, (_, id) => food(id, (id % 12) + 1))
    const next = createNextRound(field, [field[7]], () => 0.5)
    expect(next.foods).toHaveLength(12)
    expect(next.foods[7]).not.toEqual(field[7])
    expect(next.foods.filter((_, id) => id !== 7)).toEqual(
      field.filter((_, id) => id !== 7),
    )
    expect(hasSolution(next.problem, next.foods)).toBe(true)
  })
  it('terminates for any valid 12-position field and generates solvable replacement rounds', () => {
    const field = Array.from({ length: 12 }, (_, id) => food(id, (id % 12) + 1))
    expect(
      hasSolution(
        createProblem(field, () => 0.5),
        field,
      ),
    ).toBe(true)
    const replaced = createRound(() => 0.5)
    expect(hasSolution(replaced.problem, replaced.foods)).toBe(true)
  })
  it('awards ten coins per used gold food only after a correct answer', () => {
    expect(rewardForFoods([food(0, 4, true), food(1, 9)], true)).toBe(10)
    expect(rewardForFoods([food(0, 4, true), food(1, 9, true)], true)).toBe(20)
    expect(rewardForFoods([food(0, 4, true)], false)).toBe(0)
  })
  it('creates varied food in the configured value range', () => {
    const field = createFoodField(() => 0.6)
    expect(field.every((item) => item.value >= 1 && item.value <= 12)).toBe(
      true,
    )
  })
})
