import { ArrowLeft, Heart, RotateCcw, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  createRound,
  createNextRound,
  formatSolution,
  isCorrectAnswer,
  rewardForFoods,
} from '../game/logic'
import { foodEmoji, foodName, type Food, type Problem } from '../game/types'
import { CoinPill } from './CoinPill'
export function GamePage({
  coins,
  addCoins,
}: {
  coins: number
  addCoins: (amount: number) => void
}) {
  const [round, setRound] = useState(createRound)
  const [selected, setSelected] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [answerSolution, setAnswerSolution] = useState<string | null>(null)
  const [earnedCoins, setEarnedCoins] = useState(0)
  const [happy, setHappy] = useState(false)
  const [roundNumber, setRoundNumber] = useState(1)
  const [totalStars, setTotalStars] = useState(0)
  const nextRoundTimeout = useRef<number | null>(null)
  const pendingRound = useRef<ReturnType<typeof createRound> | null>(null)
  const answered = useRef(false)
  const selectedFoods = selected
    .map((id) => round.foods.find((food) => food.id === id)!)
    .filter(Boolean)
  const solution = feedback === 'correct' ? answerSolution : null
  const visibleProblem = problemParts(round.problem, selectedFoods)
  const startNext = useCallback(() => {
    nextRoundTimeout.current = null
    answered.current = false
    setRound(pendingRound.current ?? createRound())
    pendingRound.current = null
    setSelected([])
    setFeedback(null)
    setAnswerSolution(null)
    setEarnedCoins(0)
    setHappy(false)
    setRoundNumber((value) => value + 1)
  }, [])
  useEffect(
    () => () => {
      if (nextRoundTimeout.current !== null)
        window.clearTimeout(nextRoundTimeout.current)
    },
    [],
  )
  const chooseFood = (id: number) => {
    if (feedback === 'correct') return
    if (answered.current) return
    const maxSelection = round.problem.kind === 'pair' ? 2 : 1
    const nextSelected = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : selected.length >= maxSelection
        ? selected
        : [...selected, id]
    setSelected(nextSelected)

    if (nextSelected.length < maxSelection) {
      setFeedback(null)
      setAnswerSolution(null)
      setEarnedCoins(0)
      setHappy(false)
      return
    }

    const chosen = nextSelected
      .map((id) => round.foods.find((food) => food.id === id)!)
      .filter(Boolean)
    if (!isCorrectAnswer(round.problem, chosen)) {
      setFeedback('wrong')
      setAnswerSolution(null)
      setEarnedCoins(0)
      setHappy(false)
      setSelected([])
      return
    }
    pendingRound.current = createNextRound(round.foods, chosen)
    setAnswerSolution(formatSolution(round.problem, chosen))
    setSelected([])
    const reward = rewardForFoods(chosen, true)
    setEarnedCoins(reward)
    addCoins(reward)
    answered.current = true
    setFeedback('correct')
    setHappy(true)
    setTotalStars((value) => value + 1)
    nextRoundTimeout.current = window.setTimeout(startNext, 2400)
  }
  return (
    <main className="world-page game-page">
      <header className="topbar game-topbar">
        <Link to="/" className="back-button">
          <ArrowLeft size={18} /> <span>Spielauswahl</span>
        </Link>
        <div className="round-chip">
          RUNDE {roundNumber}
          <span>
            {'★'.repeat(Math.min(totalStars, 3))}
            {'☆'.repeat(Math.max(0, 3 - totalStars))}
          </span>
        </div>
        <CoinPill amount={coins} />
      </header>
      <section className="game-layout">
        <div className={`creature-panel panel ${happy ? 'is-happy' : ''}`}>
          <div className="creature-halo" aria-hidden="true" />
          <div
            className={`creature ${happy ? 'creature--happy' : feedback === 'wrong' ? 'creature--thinking' : ''}`}
            role="img"
            aria-label={
              happy
                ? 'Mampfi freut sich'
                : feedback === 'wrong'
                  ? 'Mampfi denkt nach'
                  : 'Hungriges Monster Mampfi'
            }
          />
          <div className="creature-name">
            Mampfi <Heart size={15} fill="currentColor" />
          </div>
          <p>
            {happy
              ? 'Mampf, mmmh! Das war köstlich!'
              : feedback === 'wrong'
                ? 'Hmm, probier es noch einmal!'
                : 'Ich habe einen Riesenhunger!'}
          </p>
          <div className="speech-bubble">
            <span
              className="math-problem"
              aria-label={`Aufgabe: ${solution ?? visibleProblem.join(' ')}`}
            >
              {solution ? (
                <span className="solved-problem">{solution}</span>
              ) : (
                visibleProblem.map((part, index) =>
                  part === '□' ? (
                    <span className="math-blank" key={index}>
                      ?
                    </span>
                  ) : (
                    <span key={index}>{part}</span>
                  ),
                )
              )}
            </span>
            <span className="speech-hint">
              {solution ? 'So lautet die Lösung!' : 'Welches Futter passt?'}
            </span>
          </div>
          {feedback === 'correct' && (
            <div className="reward-pop">
              <Sparkles size={18} /> Gut gemacht!
            </div>
          )}
        </div>
        <div className="food-panel panel">
          <div className="food-heading">
            <div>
              <p className="eyebrow">WÄHLE DEIN FUTTER</p>
              <h2>Was soll Mampfi essen?</h2>
            </div>
          </div>
          <p className="selection-hint">
            {round.problem.kind === 'pair'
              ? selected.length === 1
                ? 'Tippe die zweite Zutat an – dann wird geprüft.'
                : 'Tippe zwei verschiedene Zutaten an.'
              : 'Tippe eine Zutat an – sie wird sofort geprüft.'}
          </p>
          <div className="food-grid" role="group" aria-label="Futterauswahl">
            {round.foods.map((food) => (
              <FoodButton
                key={food.id}
                food={food}
                selected={selected.includes(food.id)}
                disabled={feedback === 'correct'}
                onClick={() => chooseFood(food.id)}
              />
            ))}
          </div>
          <div className="game-controls">
            <div className="gold-hint">
              <span>✦</span> Goldfutter bringt <strong>+10 Münzen</strong>
            </div>
            <button
              className="reset-button"
              disabled={feedback === 'correct'}
              onClick={() => {
                setSelected([])
                setFeedback(null)
                setAnswerSolution(null)
                setEarnedCoins(0)
                setHappy(false)
              }}
              aria-label="Auswahl zurücksetzen"
            >
              <RotateCcw size={18} />
            </button>
          </div>
          <div className={`feedback-line ${feedback ?? ''}`} aria-live="polite">
            {feedback === 'wrong'
              ? 'Fast! Denk noch einmal nach und versuch es erneut.'
              : feedback === 'correct'
                ? `Lecker! +${earnedCoins} Goldmünzen`
                : ''}
          </div>
        </div>
      </section>
      <div className="game-footnote">
        <span>✧</span> Du kannst es immer wieder versuchen <span>✧</span>
      </div>
    </main>
  )
}
function problemParts(problem: Problem, selectedFoods: Food[]): string[] {
  let selectedIndex = 0
  const missingValue = () =>
    String(selectedFoods[selectedIndex++]?.value ?? '□')
  if (problem.kind === 'pair')
    return [
      missingValue(),
      problem.operation === 'addition' ? '+' : '−',
      missingValue(),
      '=',
      String(problem.target),
    ]
  return [
    problem.missing === 'left' ? missingValue() : String(problem.fixed),
    problem.operation === 'addition' ? '+' : '−',
    problem.missing === 'right' ? missingValue() : String(problem.fixed),
    '=',
    String(problem.target),
  ]
}
function FoodButton({
  food,
  selected,
  disabled,
  onClick,
}: {
  food: Food
  selected: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`food-tile ${selected ? 'selected' : ''}`}
      aria-pressed={selected}
      aria-label={`${foodName[food.kind]}, ${food.value}${food.isGold ? ', Goldfutter' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {food.isGold && (
        <span className="gold-mark" aria-label="Goldfutter">
          ✦
        </span>
      )}
      <span className="food-emoji" aria-hidden="true">
        {foodEmoji[food.kind]}
      </span>
      <span className="food-value">{food.value}</span>
    </button>
  )
}
