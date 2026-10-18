import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import {
  loadCoins,
  loadWizardUnlocked,
  saveCoins,
  saveWizardUnlocked,
} from '../game/storage'
import { GamePage } from './GamePage'
import { HomePage } from './HomePage'
import { WizardClockPage } from './WizardClockPage'
export default function App() {
  const [coins, setCoins] = useState(loadCoins)
  const [wizardUnlocked, setWizardUnlocked] = useState(loadWizardUnlocked)
  const addCoins = (amount: number) =>
    setCoins((current) => {
      const next = current + amount
      saveCoins(next)
      return next
    })
  const unlockWizard = () => {
    if (wizardUnlocked || coins < 100) return
    const remainingCoins = coins - 100
    setCoins(remainingCoins)
    saveCoins(remainingCoins)
    setWizardUnlocked(true)
    saveWizardUnlocked(true)
  }
  const homePage = (
    <HomePage
      coins={coins}
      wizardUnlocked={wizardUnlocked}
      onUnlockWizard={unlockWizard}
    />
  )
  return (
    <Routes>
      <Route path="/" element={homePage} />
      <Route
        path="/spiele/monster-fuettern"
        element={<GamePage coins={coins} addCoins={addCoins} />}
      />
      <Route
        path="/spiele/mueden-zauberer"
        element={
          wizardUnlocked ? (
            <WizardClockPage coins={coins} addCoins={addCoins} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={homePage} />
    </Routes>
  )
}
