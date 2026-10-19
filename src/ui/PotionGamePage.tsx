import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ArrowLeft, Delete, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import {
  createPurchase,
  loadPurchases,
  potionValues,
  purchaseLimit,
  savePurchases,
} from '../game/potions'
import { CoinPill } from './CoinPill'

const colors: Record<number, string> = {
  1: 'Grün',
  5: 'Blau',
  10: 'Lila',
  20: 'Orange',
  50: 'Rot',
  100: 'Gold',
}
const customers = [
  { image: 'potion-customer', name: 'Elfe Fina' },
  { image: 'potion-customer-witch', name: 'Hexe Alma' },
  { image: 'potion-customer-dwarf', name: 'Zwerg Bruno' },
  { image: 'potion-customer-dragon', name: 'Drache Kimo' },
  { image: 'potion-customer-apprentice', name: 'Zauberlehrling Sami' },
]

export function PotionGamePage({
  coins,
  addCoins,
}: {
  coins: number
  addCoins: (amount: number) => void
}) {
  const [completed, setCompleted] = useState(loadPurchases)
  const [purchase, setPurchase] = useState(() => createPurchase(completed))
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'retry' | null>(null)
  const rewarded = useRef(false)
  const [phase, setPhase] = useState<'entering' | 'shopping' | 'leaving'>(
    'entering',
  )
  const solved = feedback === 'correct'
  useEffect(() => {
    if (phase !== 'entering') return
    const timer = window.setTimeout(() => setPhase('shopping'), 1300)
    return () => window.clearTimeout(timer)
  }, [phase])
  useEffect(() => {
    if (!solved) return
    const leave = window.setTimeout(() => setPhase('leaving'), 1500)
    const next = window.setTimeout(() => {
      setPurchase(createPurchase(completed))
      setAnswer('')
      setFeedback(null)
      rewarded.current = false
      setPhase('entering')
    }, 3000)
    return () => {
      window.clearTimeout(leave)
      window.clearTimeout(next)
    }
  }, [solved, completed])
  function check() {
    if (!answer || rewarded.current || phase !== 'shopping') return
    if (Number(answer) !== purchase.total) {
      setFeedback('retry')
      return
    }
    rewarded.current = true
    const next = completed + 1
    setCompleted(next)
    savePurchases(next)
    addCoins(10)
    setFeedback('correct')
  }
  function typeDigit(digit: string) {
    if (solved) return
    setAnswer((current) =>
      (current === '0' ? digit : current + digit).slice(0, 3),
    )
    setFeedback(null)
  }
  const round = solved ? completed : completed + 1
  const customer = customers[(round - 1) % customers.length]
  const limit = purchaseLimit(solved ? completed - 1 : completed)
  return (
    <main className="world-page potion-page">
      <header className="topbar game-topbar">
        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          <span>Spielauswahl</span>
        </Link>
        <CoinPill amount={coins} />
      </header>
      <section className="potion-heading">
        <p className="eyebrow">
          <Sparkles size={16} /> MENGEN ERKENNEN · BIS {limit}
        </p>
        <h1>Luisas Zaubertrankladen</h1>
        <p>
          Wie viele Zaubertränke kauft dein Kunde? Gib die Menge in die Kasse
          ein.
        </p>
      </section>
      <div className="potion-layout">
        <section
          className={`potion-shop customer-${phase}`}
          aria-label="Einkauf im Zaubertrankladen"
        >
          <div className="potion-customer">
            <CustomerPortrait key={customer.image} customer={customer} />
            <p>
              <strong className="potion-customer-name">{customer.name}</strong>
              {solved
                ? 'Danke, Luisa! Genau richtig!'
                : 'Diese Zaubertränke möchte ich kaufen!'}
            </p>
          </div>
          <div className="potion-counter" aria-hidden={phase !== 'shopping'}>
            <h2>Der Einkaufskorb</h2>
            <FittedBasket>
              <PurchasePacks packs={purchase.packs} />
            </FittedBasket>
          </div>
        </section>
        <section className="potion-register panel" aria-label="Kasse">
          <p className="eyebrow">DIE ZAUBERKASSE</p>
          <h2>Wie viele sind es?</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              check()
            }}
          >
            <label htmlFor="potion-answer">Anzahl der Zaubertränke</label>
            <input
              id="potion-answer"
              className="potion-display"
              inputMode="numeric"
              autoComplete="off"
              placeholder="?"
              value={answer}
              disabled={solved}
              onChange={(event) => {
                setAnswer(event.target.value.replace(/\D/g, '').slice(0, 3))
                setFeedback(null)
              }}
            />
            <div className="potion-keypad">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  type="button"
                  key={digit}
                  disabled={solved}
                  onClick={() => typeDigit(digit)}
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                disabled={solved}
                onClick={() => {
                  setAnswer('')
                  setFeedback(null)
                }}
              >
                C
              </button>
              <button
                type="button"
                disabled={solved}
                onClick={() => typeDigit('0')}
              >
                0
              </button>
              <button
                type="button"
                disabled={solved}
                aria-label="Letzte Ziffer löschen"
                onClick={() => {
                  setAnswer((current) => current.slice(0, -1))
                  setFeedback(null)
                }}
              >
                <Delete size={22} />
              </button>
            </div>
            {!solved && (
              <button
                className="play-button potion-submit"
                disabled={!answer || phase !== 'shopping'}
                type="submit"
              >
                Einkauf prüfen ✦
              </button>
            )}
          </form>
          <div
            className={`potion-feedback ${solved ? 'success' : ''}`}
            role="status"
          >
            {solved
              ? `Richtig! ${purchase.total} Zaubertränke. +10 Goldmünzen!`
              : feedback === 'retry'
                ? 'Zähle noch einmal. Denk auch an die Bündel!'
                : 'Zähle die einzelnen Tränke und die Bündel zusammen.'}
          </div>
          {solved && (
            <p className="potion-next">
              {phase === 'leaving'
                ? 'Auf Wiedersehen! Der nächste Kunde kommt gleich …'
                : 'Dein Kunde freut sich und nimmt seinen Korb mit!'}
            </p>
          )}
        </section>
      </div>
      <details className="potion-help">
        <summary>Zählhilfe</summary>
        <section
          className="potion-legend panel"
          aria-label="So viel zählt jedes Bündel"
        >
          <h2>Deine Zählhilfe</h2>
          <div>
            {[...potionValues].reverse().map((value) => (
              <figure key={value}>
                <PotionQuantity value={value} />
                <figcaption>
                  <strong>{value}</strong> · {colors[value]}
                </figcaption>
              </figure>
            ))}
          </div>
          <p>
            Nach jeweils 10 richtigen Käufen wächst dein Zahlenraum: 10 → 20 →
            50 → 100 → 200. Danach übst du bis 200 weiter.
          </p>
        </section>
      </details>
    </main>
  )
}

function Pack({ value }: { value: number }) {
  return (
    <div className={`potion-pack pack-${value}`}>
      <PotionQuantity value={value} />
      <span>{value}</span>
    </div>
  )
}

function PurchasePacks({ packs }: { packs: number[] }) {
  const fives = packs.filter((value) => value === 5)
  const larger = packs.filter((value) => value > 5)
  if (fives.length >= 2) {
    const split = Math.ceil(fives.length / 2)
    const row = [...fives.slice(0, split), ...larger, ...fives.slice(split)]
    return (
      <div
        className="potion-balanced-packs"
        style={{
          gridTemplateColumns: `repeat(${Math.min(5, row.length)}, minmax(0, 1fr))`,
        }}
      >
        {row.map((value, i) => (
          <Pack value={value} key={i} />
        ))}
        {packs.includes(1) && (
          <div className="potion-pack-group group-1 potion-balanced-singles">
            {packs
              .filter((value) => value === 1)
              .map((value, i) => (
                <Pack value={value} key={i} />
              ))}
          </div>
        )}
      </div>
    )
  }
  return (
    <>
      {potionValues
        .filter((value) => packs.includes(value))
        .map((value) => (
          <div className={`potion-pack-group group-${value}`} key={value}>
            {packs
              .filter((pack) => pack === value)
              .map((_, i) => (
                <Pack value={value} key={i} />
              ))}
          </div>
        ))}
    </>
  )
}

function FittedBasket({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const contentsRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const contents = contentsRef.current
    if (!viewport || !contents || typeof ResizeObserver === 'undefined') return
    const fit = () => {
      const next = Math.min(
        1,
        viewport.clientHeight / Math.max(1, contents.scrollHeight),
      )
      setScale((current) => (current === next ? current : next))
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(viewport)
    observer.observe(contents)
    return () => observer.disconnect()
  }, [])
  return (
    <div className="potion-basket-viewport" ref={viewportRef}>
      <div
        className="potion-packs"
        ref={contentsRef}
        style={{ transform: `translateX(-50%) scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  )
}

function CustomerPortrait({
  customer,
}: {
  customer: (typeof customers)[number]
}) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={
        failed ? '/images/potion-customer.png' : `/images/${customer.image}.png`
      }
      alt={`${customer.name} kauft Zaubertränke`}
      onError={failed ? undefined : () => setFailed(true)}
    />
  )
}

function PotionQuantity({ value }: { value: number }) {
  if (value === 100) {
    return (
      <img
        className="potion-hundred-crate"
        src="/images/potion-100-ordered.png"
        alt="Gold: 100 Zaubertränke"
      />
    )
  }
  const columns = value >= 50 ? 10 : value === 1 ? 1 : 5
  return (
    <div
      className={`potion-quantity quantity-${value}`}
      role="img"
      aria-label={`${colors[value]}: ${value} ${value === 1 ? 'Zaubertrank' : 'Zaubertränke'}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: value }, (_, i) => (
        <div
          className={columns === 10 && i % 10 === 4 ? 'five-divider' : ''}
          key={i}
        >
          <img src="/images/potion-1.png" alt="" />
        </div>
      ))}
    </div>
  )
}
