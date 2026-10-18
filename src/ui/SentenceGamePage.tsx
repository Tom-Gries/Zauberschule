import { ArrowLeft, Coins, Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import sentenceEntries from '../game/sentences.json'
import { CoinPill } from './CoinPill'

type Sentence = { before: string; missing: string; after: string }

const sentences: Sentence[] = sentenceEntries.flatMap((line) => {
  const match = line.trim().match(/^(.*?)\[([^\]]+)\](.*)$/)
  return match && match[2].trim()
    ? [{ before: match[1], missing: match[2].trim(), after: match[3] }]
    : []
})

function shuffled(items: number[]): number[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function SentenceLine({
  sentence,
  answer,
  ariaLabel,
}: {
  sentence: Sentence
  answer?: string
  ariaLabel?: string
}) {
  return (
    <p className="broken-sentence" aria-label={ariaLabel}>
      {sentence.before}
      <span className={`word-gap ${answer ? 'is-solved' : ''}`}>
        {answer}
      </span>
      {sentence.after}
    </p>
  )
}

export function SentenceGamePage({
  coins,
  addCoins,
}: {
  coins: number
  addCoins: (amount: number) => void
}) {
  const [bag, setBag] = useState<number[]>([])
  const [sentenceIndex, setSentenceIndex] = useState<number | null>(null)
  const [nextPageIndex, setNextPageIndex] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [round, setRound] = useState(0)

  const nextSentence = useCallback(() => {
    if (!sentences.length) return
    const available = bag.filter((index) => index < sentences.length)
    const nextBag = available.length ? available : shuffled(sentences.map((_, index) => index))
    const [nextIndex, ...remaining] = nextBag
    setSentenceIndex(nextIndex)
    setBag(remaining)
    setAnswer('')
    setFeedback(null)
    setRound((value) => value + 1)
  }, [bag, sentences])

  const finishPageTurn = () => {
    if (nextPageIndex === null) return
    setSentenceIndex(nextPageIndex)
    setNextPageIndex(null)
    setAnswer('')
    setFeedback(null)
    setRound((value) => value + 1)
  }

  const current = sentenceIndex === null ? null : sentences[sentenceIndex]
  const checkAnswer = () => {
    if (!current || feedback === 'correct' || !answer.trim()) return
    if (answer.trim().toLocaleLowerCase('de') === current.missing.toLocaleLowerCase('de')) {
      let available = bag.filter((index) => index !== sentenceIndex)
      if (!available.length) {
        available = shuffled(sentences.map((_, index) => index).filter((index) => index !== sentenceIndex))
      }
      if (!available.length) available = shuffled(sentences.map((_, index) => index))
      const [nextIndex, ...remaining] = available
      setNextPageIndex(nextIndex)
      setBag(remaining)
      setFeedback('correct')
      addCoins(10)
    } else {
      setFeedback('wrong')
    }
  }

  return (
    <main className="world-page game-page sentence-game-page">
      <header className="topbar game-topbar">
        <Link to="/" className="back-button"><ArrowLeft size={18} /> <span>Spielauswahl</span></Link>
        <div className="round-chip">SATZ {round}</div>
        <CoinPill amount={coins} />
      </header>
      <section className="sentence-layout">
        <div className="sentence-main">
          <p className="eyebrow"><Sparkles size={15} /> DAS VERZAUBERTE SATZBUCH</p>
          <h1>Welches Wort fehlt?</h1>
          <p className="sentence-intro">Schreibe das fehlende Wort in die Lücke. Für jeden richtigen Satz gibt es 10 Goldmünzen.</p>
          <div className="open-book-scene" aria-live="polite">
            <div className="open-book-spread">
              <div className="book-right-page" aria-live="polite">
                {feedback === 'correct' && nextPageIndex !== null && (
                  <div className="book-next-content" aria-hidden="true">
                    <SentenceLine sentence={sentences[nextPageIndex]} />
                  </div>
                )}
                {feedback === 'correct' && current ? (
                  <div className="book-turn-leaf" onAnimationEnd={finishPageTurn}>
                    <div className="book-turn-front">
                      <SentenceLine sentence={current} answer={current.missing} />
                      <span className="book-stamp">Richtig! ✨</span>
                    </div>
                  </div>
                ) : current ? (
                  <SentenceLine sentence={current} ariaLabel={`Satz: ${current.before} fehlendes Wort ${current.after}`} />
                ) : (
                  <p className="broken-sentence">Bereit für deinen ersten Satz?</p>
                )}
              </div>
            </div>
          </div>
          {current && feedback !== 'correct' && (
            <form className="answer-form" onSubmit={(event) => { event.preventDefault(); checkAnswer() }}>
              <label htmlFor="missing-word">Dein fehlendes Wort</label>
              <div className="answer-row">
                <input id="missing-word" value={answer} onChange={(event) => { setAnswer(event.target.value); setFeedback(null) }} autoComplete="off" placeholder="Wort schreiben und Enter drücken" />
              </div>
            </form>
          )}
          {feedback === 'wrong' && <p className="sentence-feedback wrong" aria-live="polite">Noch nicht ganz. Versuch es noch einmal!</p>}
          {feedback === 'correct' && (
            <div className="sentence-correct-actions">
              <p className="sentence-feedback correct" aria-live="polite"><Coins size={17} /> Richtig! +10 Goldmünzen</p>
            </div>
          )}
          {!current && sentences.length > 0 && <button className="play-button begin-button" onClick={nextSentence}>Satz beginnen <Sparkles size={16} /></button>}
          {!sentences.length && <p className="sentence-feedback wrong">Füge unten mindestens einen Satz mit markiertem Wort ein.</p>}
        </div>
      </section>
    </main>
  )
}
