import {
  foodKinds,
  type Food,
  type FoodKind,
  type Operation,
  type Problem,
} from './types'
const randomInt = (max: number, random: () => number) =>
  Math.floor(random() * max)
const choose = <T>(values: readonly T[], random: () => number): T =>
  values[randomInt(values.length, random)]
export function createFoodField(random: () => number = Math.random): Food[] {
  return Array.from({ length: 12 }, (_, id) => ({
    id,
    kind: choose(foodKinds, random),
    value: 1 + randomInt(12, random),
    isGold: random() < 0.16,
  }))
}
export function createNextRound(
  previousFoods: Food[],
  eatenFoods: Food[],
  random: () => number = Math.random,
) {
  const eatenIds = new Set(eatenFoods.map((food) => food.id))
  const foods = previousFoods.map((food) =>
    eatenIds.has(food.id)
      ? {
          ...food,
          kind: choose(foodKinds, random) as FoodKind,
          value: 1 + randomInt(12, random),
          isGold: random() < 0.16,
        }
      : food,
  )
  return { foods, problem: createProblem(foods, random) }
}
export function isCorrectAnswer(problem: Problem, foods: Food[]): boolean {
  if (problem.kind === 'single') {
    return (
      foods.length === 1 &&
      (problem.operation === 'addition'
        ? (problem.missing === 'left'
            ? foods[0].value + problem.fixed
            : problem.fixed + foods[0].value) === problem.target
        : (problem.missing === 'left'
            ? foods[0].value - problem.fixed
            : problem.fixed - foods[0].value) === problem.target)
    )
  }
  if (foods.length !== 2 || foods[0].id === foods[1].id) return false
  const [left, right] = foods.map((food) => food.value)
  return (
    (problem.operation === 'addition' ? left + right : left - right) ===
    problem.target
  )
}
export function hasSolution(problem: Problem, field: Food[]): boolean {
  if (problem.kind === 'single')
    return field.some((food) => isCorrectAnswer(problem, [food]))
  return field.some((left, i) =>
    field.slice(i + 1).some((right) => isCorrectAnswer(problem, [left, right])),
  )
}
export function createProblem(
  field: Food[],
  random: () => number = Math.random,
): Problem {
  const candidates: Problem[] = []
  for (const operation of [
    'addition',
    'subtraction',
  ] as const satisfies Operation[]) {
    for (let target = 1; target <= 24; target++)
      candidates.push({ kind: 'pair', operation, target })
    for (let fixed = 1; fixed <= 12; fixed++)
      for (let target = 1; target <= 20; target++)
        candidates.push({
          kind: 'single',
          operation,
          fixed,
          target,
          missing: choose(['left', 'right'] as const, random),
        })
  }
  const solvable = candidates.filter((candidate) =>
    hasSolution(candidate, field),
  )
  if (solvable.length === 0)
    return {
      kind: 'pair',
      operation: 'addition',
      target: field[0].value + field[1].value,
    }
  const pairs = solvable.filter((candidate) => candidate.kind === 'pair')
  const singles = solvable.filter((candidate) => candidate.kind === 'single')
  const preferred = random() < 0.5 ? pairs : singles
  return choose(preferred.length ? preferred : solvable, random)
}
export function createRound(random: () => number = Math.random) {
  const foods = createFoodField(random)
  return { foods, problem: createProblem(foods, random) }
}
export function rewardForFoods(foods: Food[], correct: boolean): number {
  return correct
    ? foods.reduce((sum, food) => sum + (food.isGold ? 10 : 0), 0)
    : 0
}
export function formatProblem(problem: Problem) {
  if (problem.kind === 'pair')
    return problem.operation === 'addition'
      ? `□ + □ = ${problem.target}`
      : `□ − □ = ${problem.target}`
  if (problem.operation === 'addition')
    return problem.missing === 'left'
      ? `□ + ${problem.fixed} = ${problem.target}`
      : `${problem.fixed} + □ = ${problem.target}`
  return problem.missing === 'left'
    ? `□ − ${problem.fixed} = ${problem.target}`
    : `${problem.fixed} − □ = ${problem.target}`
}

export function formatSolution(problem: Problem, foods: Food[]) {
  const symbol = problem.operation === 'addition' ? '+' : '−'
  if (problem.kind === 'pair') {
    const [left, right] = foods
    return `${left.value} ${symbol} ${right.value} = ${problem.target}`
  }

  const [food] = foods
  const left = problem.missing === 'left' ? food.value : problem.fixed
  const right = problem.missing === 'right' ? food.value : problem.fixed
  return `${left} ${symbol} ${right} = ${problem.target}`
}
