import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import {
  loadCoins,
  loadSentenceUnlocked,
  loadWizardUnlocked,
  saveCoins,
  saveSentenceUnlocked,
  saveWizardUnlocked,
} from '../game/storage'
import { GamePage } from './GamePage'
import { HomePage } from './HomePage'
import { WizardClockPage } from './WizardClockPage'
import { SentenceGamePage } from './SentenceGamePage'
export default function App() {
  const [coins, setCoins] = useState(loadCoins)
  const [wizardUnlocked, setWizardUnlocked] = useState(loadWizardUnlocked)
  const [sentenceUnlocked, setSentenceUnlocked] = useState(loadSentenceUnlocked)
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
  const unlockSentence = () => {
    if (sentenceUnlocked || coins < 250) return
    const remainingCoins = coins - 250
    setCoins(remainingCoins)
    saveCoins(remainingCoins)
    setSentenceUnlocked(true)
    saveSentenceUnlocked(true)
  }
  const homePage = (
    <HomePage
      coins={coins}
      wizardUnlocked={wizardUnlocked}
      onUnlockWizard={unlockWizard}
      sentenceUnlocked={sentenceUnlocked}
      onUnlockSentence={unlockSentence}
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
      <Route
        path="/spiele/wort-zauber"
        element={
          sentenceUnlocked ? (
            <SentenceGamePage coins={coins} addCoins={addCoins} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={homePage} />
    </Routes>
  )
}
