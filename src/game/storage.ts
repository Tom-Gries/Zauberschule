const COINS_KEY = 'zauberschmiede.coins.v1'
const readStorage = (): Storage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}
export function loadCoins(): number {
  try {
    const value = Number(readStorage()?.getItem(COINS_KEY) ?? 0)
    return Number.isFinite(value) && value >= 0 ? value : 0
  } catch {
    return 0
  }
}
export function saveCoins(coins: number): void {
  try {
    readStorage()?.setItem(COINS_KEY, String(Math.max(0, Math.floor(coins))))
  } catch {
    /* Storage can be disabled; game still works in memory. */
  }
}
