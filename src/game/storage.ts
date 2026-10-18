const COINS_KEY = 'zauberschmiede.coins.v1'
const WIZARD_UNLOCKED_KEY = 'zauberschmiede.wizard-clock-unlocked.v1'
const SENTENCE_UNLOCKED_KEY = 'zauberschmiede.sentence-game-unlocked.v1'
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

export function loadWizardUnlocked(): boolean {
  try {
    return readStorage()?.getItem(WIZARD_UNLOCKED_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveWizardUnlocked(unlocked: boolean): void {
  try {
    if (unlocked) readStorage()?.setItem(WIZARD_UNLOCKED_KEY, 'true')
    else readStorage()?.removeItem(WIZARD_UNLOCKED_KEY)
  } catch {
    /* Storage can be disabled; game still works in memory. */
  }
}

export function loadSentenceUnlocked(): boolean {
  try {
    return readStorage()?.getItem(SENTENCE_UNLOCKED_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveSentenceUnlocked(unlocked: boolean): void {
  try {
    if (unlocked) readStorage()?.setItem(SENTENCE_UNLOCKED_KEY, 'true')
    else readStorage()?.removeItem(SENTENCE_UNLOCKED_KEY)
  } catch {
    /* Storage can be disabled; game still works in memory. */
  }
}
