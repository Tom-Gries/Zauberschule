import { useState } from 'react'
import { Route, Routes } from 'react-router'
import { loadCoins, saveCoins } from '../game/storage'
import { GamePage } from './GamePage'
import { HomePage } from './HomePage'
export default function App() {
  const [coins, setCoins] = useState(loadCoins)
  const addCoins = (amount: number) =>
    setCoins((current) => {
      const next = current + amount
      saveCoins(next)
      return next
    })
  return (
    <Routes>
      <Route path="/" element={<HomePage coins={coins} />} />
      <Route
        path="/spiele/monster-fuettern"
        element={<GamePage coins={coins} addCoins={addCoins} />}
      />
      <Route path="*" element={<HomePage coins={coins} />} />
    </Routes>
  )
}
