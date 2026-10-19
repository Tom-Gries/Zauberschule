import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PotionGamePage } from './PotionGamePage'
import { createPurchase } from '../game/potions'

vi.mock('../game/potions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../game/potions')>()),
  createPurchase: vi.fn(() => ({ total: 6, packs: [5, 1] })),
}))

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.useRealTimers()
})

describe('potion shop customer', () => {
  it('uses five columns for four fives alongside a twenty bundle', () => {
    vi.mocked(createPurchase).mockReturnValueOnce({
      total: 40,
      packs: [20, 5, 5, 5, 5],
    })
    const { container } = render(
      <MemoryRouter>
        <PotionGamePage coins={0} addCoins={vi.fn()} />
      </MemoryRouter>,
    )
    const arrangement = container.querySelector('.potion-balanced-packs')
    expect(arrangement).toHaveStyle({
      gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    })
    expect(
      Array.from(arrangement!.children).map(
        (element) => element.querySelector('span')?.textContent,
      ),
    ).toEqual(['5', '5', '20', '5', '5'])
  })
  it('waits for the right quantity, rewards once, leaves and brings in the next customer', () => {
    vi.useFakeTimers()
    const addCoins = vi.fn()
    const { container } = render(
      <MemoryRouter>
        <PotionGamePage coins={0} addCoins={addCoins} />
      </MemoryRouter>,
    )
    expect(container.querySelector('.customer-entering')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Zählhilfe', { selector: 'summary' }))
    expect(
      screen.getByRole('img', { name: 'Elfe Fina kauft Zaubertränke' }),
    ).toHaveAttribute('src', '/images/potion-customer.png')
    for (const [value, color] of [
      [20, 'Orange'],
      [50, 'Rot'],
    ] as const) {
      const quantity = screen.getByRole('img', {
        name: `${color}: ${value} Zaubertränke`,
      })
      expect(quantity.querySelectorAll('img')).toHaveLength(value)
      expect(quantity).toHaveStyle({
        gridTemplateColumns: `repeat(${value >= 50 ? 10 : 5}, minmax(0, 1fr))`,
      })
    }
    expect(
      screen.getByRole('img', { name: 'Gold: 100 Zaubertränke' }),
    ).toHaveAttribute('src', '/images/potion-100-ordered.png')
    act(() => vi.advanceTimersByTime(1300))
    const input = screen.getByLabelText('Anzahl der Zaubertränke')
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.click(screen.getByRole('button', { name: /Einkauf prüfen/ }))
    expect(addCoins).not.toHaveBeenCalled()
    expect(container.querySelector('.customer-shopping')).toBeInTheDocument()
    fireEvent.change(input, { target: { value: '6' } })
    fireEvent.click(screen.getByRole('button', { name: /Einkauf prüfen/ }))
    expect(addCoins).toHaveBeenCalledExactlyOnceWith(10)
    expect(
      screen.getByRole('img', { name: 'Elfe Fina kauft Zaubertränke' }),
    ).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(1500))
    expect(container.querySelector('.customer-leaving')).toBeInTheDocument()
    expect(container.querySelector('.potion-counter')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    act(() => vi.advanceTimersByTime(1500))
    expect(container.querySelector('.customer-entering')).toBeInTheDocument()
    expect(input).toHaveValue('')
    expect(addCoins).toHaveBeenCalledTimes(1)
    expect(screen.queryByText(/KAUF \d+/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Hexe Alma kauft Zaubertränke' }),
    ).toHaveAttribute('src', '/images/potion-customer-witch.png')
    fireEvent.error(
      screen.getByRole('img', { name: 'Hexe Alma kauft Zaubertränke' }),
    )
    expect(
      screen.getByRole('img', { name: 'Hexe Alma kauft Zaubertränke' }),
    ).toHaveAttribute('src', '/images/potion-customer.png')
  })
})
