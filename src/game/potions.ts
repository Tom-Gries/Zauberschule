export const potionValues = [100, 50, 20, 10, 5, 1] as const
export const potionLimits = [10, 20, 50, 100, 200] as const
const progressKey = 'zauberschmiede.potion-purchases.v1'

export function purchaseLimit(completed: number): number {
  return potionLimits[
    Math.min(Math.floor(completed / 10), potionLimits.length - 1)
  ]
}

export function createPurchase(completed: number, random = Math.random) {
  const limit = purchaseLimit(completed)
  const total = 1 + Math.min(limit - 1, Math.floor(random() * limit))
  let remaining = total
  const packs: number[] = []
  // Sometimes exchange a larger pack for smaller ones to vary the counting task.
  for (const value of potionValues) {
    while (remaining >= value) {
      if (value > 5 && remaining / value <= 3 && random() < 0.25) break
      packs.push(value)
      remaining -= value
    }
  }
  return { total, packs }
}

export function loadPurchases(): number {
  try {
    const value = Number(localStorage.getItem(progressKey) ?? 0)
    return Number.isSafeInteger(value) && value >= 0 ? value : 0
  } catch {
    return 0
  }
}

export function savePurchases(value: number) {
  try {
    localStorage.setItem(progressKey, String(value))
  } catch {
    // Continue playing when browser storage is unavailable.
  }
}
