import { Coins } from 'lucide-react'
export function CoinPill({ amount }: { amount: number }) {
  return (
    <div className="coin-pill" aria-label={`${amount} Goldmünzen`}>
      <Coins size={22} fill="currentColor" />
      <strong>{amount}</strong>
      <span>Gold</span>
    </div>
  )
}
