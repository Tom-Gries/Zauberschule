import { ArrowLeft, Coins, Sparkles } from 'lucide-react'
import { useState } from 'react'
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
  inputValue,
  onInputChange,
}: {
  sentence: Sentence
  answer?: string
  ariaLabel?: string
  inputValue?: string
  onInputChange?: (value: string) => void
}) {
  const visibleWord = inputValue ?? answer ?? ''

  return (
    <p className="broken-sentence" aria-label={ariaLabel}>
      {sentence.before}
      <span
        className={`word-gap ${answer ? 'is-solved' : ''}`}
        style={
          onInputChange || answer
            ? { width: `${Math.max(3.3, visibleWord.length * 0.58 + 0.5)}em` }
            : undefined
        }
      >
        {onInputChange ? (
          <>
            <span className="word-gap-value" aria-hidden="true">
              {inputValue}
            </span>
            <input
              className="word-gap-input"
              aria-label="Fehlendes Wort"
              value={inputValue ?? ''}
              onChange={(event) => onInputChange(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
          </>
        ) : (
          answer
        )}
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
  const [sentenceIndex, setSentenceIndex] = useState<number | null>(() =>
    sentences.length ? Math.floor(Math.random() * sentences.length) : null,
  )
  const [bag, setBag] = useState<number[]>(() =>
    sentenceIndex === null
      ? []
      : shuffled(
          sentences
            .map((_, index) => index)
            .filter((index) => index !== sentenceIndex),
        ),
  )
  const [nextPageIndex, setNextPageIndex] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [round, setRound] = useState(sentenceIndex === null ? 0 : 1)

  const finishPageTurn = () => {
    if (nextPageIndex === null) return
    setSentenceIndex(nextPageIndex)
    setNextPageIndex(null)
    setAnswer('')
    setFeedback(null)
    setRound((value) => value + 1)
  }

  const current = sentenceIndex === null ? null : sentences[sentenceIndex]
  const checkAnswer = (value = answer) => {
    if (!current || feedback === 'correct' || !value.trim()) return
    if (
      value.trim().toLocaleLowerCase('de') ===
      current.missing.toLocaleLowerCase('de')
    ) {
      let available = bag.filter((index) => index !== sentenceIndex)
      if (!available.length) {
        available = shuffled(
          sentences
            .map((_, index) => index)
            .filter((index) => index !== sentenceIndex),
        )
      }
      if (!available.length)
        available = shuffled(sentences.map((_, index) => index))
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
        <Link to="/" className="back-button">
          <ArrowLeft size={18} /> <span>Spielauswahl</span>
        </Link>
        <div className="round-chip">SATZ {round}</div>
        <CoinPill amount={coins} />
      </header>
      <section className="sentence-layout">
        <div className="sentence-main">
          <p className="eyebrow">
            <Sparkles size={15} /> DAS VERZAUBERTE SATZBUCH
          </p>
          <h1>Welches Wort fehlt?</h1>
          <p className="sentence-intro">
            Schreibe das fehlende Wort in die Lücke. Für jeden richtigen Satz
            gibt es 10 Goldmünzen.
          </p>
          <div className="open-book-scene" aria-live="polite">
            <div
              className="open-book-spread"
              onClick={(event) => {
                event.currentTarget
                  .querySelector<HTMLInputElement>('.word-gap-input')
                  ?.focus()
              }}
            >
              <div className="book-cover" aria-hidden="true" />
              <div className="book-page-stack">
                <div
                  className="book-static-page book-left-page"
                  aria-hidden="true"
                >
                  <span className="book-page-star">✦</span>
                </div>
                <div className="book-right-page" aria-live="polite">
                  {feedback === 'correct' && nextPageIndex !== null && (
                    <div className="book-next-content" aria-hidden="true">
                      <SentenceLine sentence={sentences[nextPageIndex]} />
                    </div>
                  )}
                  {feedback === 'correct' && current ? (
                    <div
                      className="book-turn-leaf"
                      onAnimationEnd={(event) => {
                        if (
                          event.target === event.currentTarget &&
                          event.animationName === 'book-page-turn'
                        ) {
                          finishPageTurn()
                        }
                      }}
                    >
                      <div className="book-turn-face book-turn-face-front">
                        <div className="book-turn-front">
                          <SentenceLine
                            sentence={current}
                            answer={current.missing}
                          />
                        </div>
                      </div>
                      <div
                        className="book-turn-face book-turn-face-back"
                        aria-hidden="true"
                      />
                    </div>
                  ) : current ? (
                    <form
                      className="book-answer-form"
                      onSubmit={(event) => {
                        event.preventDefault()
                        checkAnswer()
                      }}
                    >
                      <SentenceLine
                        sentence={current}
                        ariaLabel={`Satz: ${current.before} fehlendes Wort ${current.after}`}
                        inputValue={answer}
                        onInputChange={(value) => {
                          setAnswer(value)
                          setFeedback(null)
                          if (
                            current &&
                            value.trim().toLocaleLowerCase('de') ===
                              current.missing.toLocaleLowerCase('de')
                          ) {
                            checkAnswer(value)
                          }
                        }}
                      />
                    </form>
                  ) : (
                    <p className="broken-sentence">
                      Noch keine Sätze vorhanden.
                    </p>
                  )}
                </div>
              </div>
              <div className="book-gutter" aria-hidden="true" />
            </div>
          </div>
          {feedback === 'wrong' && (
            <p className="sentence-feedback wrong" aria-live="polite">
              Noch nicht ganz. Versuch es noch einmal!
            </p>
          )}
          {feedback === 'correct' && (
            <div className="sentence-correct-actions">
              <p className="sentence-feedback correct" aria-live="polite">
                <Coins size={17} /> Richtig! +10 Goldmünzen
              </p>
            </div>
          )}
          {!sentences.length && (
            <p className="sentence-feedback wrong">
              Füge unten mindestens einen Satz mit markiertem Wort ein.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
