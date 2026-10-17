import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GamePage } from './GamePage'
import { foodEmoji, type Food } from '../game/types'

const { mockCreateRound } = vi.hoisted(() => ({ mockCreateRound: vi.fn() }))

vi.mock('../game/logic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../game/logic')>()
  return { ...actual, createRound: mockCreateRound }
})

const foods: Food[] = [
  { id: 0, kind: 'apple', value: 7, isGold: true },
  { id: 1, kind: 'cheese', value: 4, isGold: true },
  { id: 2, kind: 'carrot', value: 2, isGold: false },
]

function renderGame(addCoins = vi.fn()) {
  render(
    <MemoryRouter>
      <GamePage coins={0} addCoins={addCoins} />
    </MemoryRouter>,
  )
  return addCoins
}

describe('instant food selection', () => {
  beforeEach(() => {
    mockCreateRound.mockReturnValue({
      foods,
      problem: {
        kind: 'single',
        operation: 'addition',
        fixed: 5,
        target: 12,
        missing: 'right',
      },
    })
  })

  afterEach(() => cleanup())

  it('uses a widely supported visible icon for berries', () => {
    expect(foodEmoji.berries).toBe('🍇')
  })

  it('checks a one-food answer immediately without a feed button', async () => {
    const user = userEvent.setup()
    const addCoins = renderGame()

    await user.click(
      screen.getByRole('button', { name: 'Apfel, 7, Goldfutter' }),
    )

    expect(addCoins).toHaveBeenCalledWith(10)
    expect(screen.getByText('Lecker! +10 Goldmünzen')).toBeInTheDocument()
    expect(screen.getByText('5 + 7 = 12')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Apfel, 7, Goldfutter' }),
    ).toHaveAttribute('aria-pressed', 'false')
    expect(
      screen.getByRole('img', { name: 'Mampfi freut sich' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Füttern/ }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/0\s*\/\s*1/)).not.toBeInTheDocument()
  })

  it('checks two-item answers as soon as the second ingredient is chosen', async () => {
    mockCreateRound.mockReturnValue({
      foods,
      problem: { kind: 'pair', operation: 'subtraction', target: 3 },
    })
    const user = userEvent.setup()
    const addCoins = renderGame()

    expect(screen.getByLabelText('Aufgabe: □ − □ = 3')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Apfel, 7, Goldfutter' }),
    )
    expect(screen.getByLabelText('Aufgabe: 7 − □ = 3')).toBeInTheDocument()
    expect(addCoins).not.toHaveBeenCalled()
    expect(
      screen.getByText('Tippe die zweite Zutat an – dann wird geprüft.'),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Käse, 4, Goldfutter' }),
    )

    expect(addCoins).toHaveBeenCalledWith(20)
    expect(screen.getByText('Lecker! +20 Goldmünzen')).toBeInTheDocument()
  })

  it('lets the player replace a wrong choice and checks the new one immediately', async () => {
    const user = userEvent.setup()
    const addCoins = renderGame()

    await user.click(
      screen.getByRole('button', { name: 'Käse, 4, Goldfutter' }),
    )
    expect(
      screen.getByText('Fast! Denk noch einmal nach und versuch es erneut.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Käse, 4, Goldfutter' }),
    ).toHaveAttribute('aria-pressed', 'false')
    expect(addCoins).not.toHaveBeenCalled()

    await user.click(
      screen.getByRole('button', { name: 'Käse, 4, Goldfutter' }),
    )
    await user.click(
      screen.getByRole('button', { name: 'Apfel, 7, Goldfutter' }),
    )

    expect(addCoins).toHaveBeenCalledWith(10)
    expect(screen.getByText('Lecker! +10 Goldmünzen')).toBeInTheDocument()
  })
})
