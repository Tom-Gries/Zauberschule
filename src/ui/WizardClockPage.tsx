import { ArrowLeft } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { Link } from 'react-router'
import { CoinPill } from './CoinPill'

type ClockTime = { hour: number; minute: number }
type Mode = 'digital-to-analog' | 'analog-to-digital'
const MOBILE_SCENE_WIDTH = 1024
const randomTime = (): ClockTime => ({
  hour: Math.floor(Math.random() * 24),
  minute: Math.floor(Math.random() * 12) * 5,
})
const formatTime = ({ hour, minute }: ClockTime) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
const sameTime = (answer: ClockTime, dream: ClockTime, analogAnswer: boolean) =>
  (analogAnswer
    ? answer.hour % 12 === dream.hour % 12
    : answer.hour === dream.hour) && answer.minute === dream.minute

export function WizardClockPage({
  coins,
  addCoins,
}: {
  coins: number
  addCoins: (amount: number) => void
}) {
  const [round, setRound] = useState(1)
  const [time, setTime] = useState<ClockTime>(randomTime)
  const [answer, setAnswer] = useState<ClockTime>({ hour: 12, minute: 0 })
  const [feedback, setFeedback] = useState<'correct' | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [reward, setReward] = useState(0)
  const sceneFrameRef = useRef<HTMLDivElement>(null)
  const mobileSceneFrameRef = useRef<HTMLDivElement>(null)
  const [sceneScale, setSceneScale] = useState(1)
  const [mobileSceneScale, setMobileSceneScale] = useState(1)
  const mode: Mode = round % 2 === 1 ? 'digital-to-analog' : 'analog-to-digital'
  const solved = feedback === 'correct'
  const isNight = time.hour < 6 || time.hour >= 18

  useLayoutEffect(() => {
    const frame = sceneFrameRef.current
    if (!frame) return
    const resize = () => {
      const nextScale = Math.min(1, frame.clientWidth / 1536)
      setSceneScale((current) => (current === nextScale ? current : nextScale))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const frame = mobileSceneFrameRef.current
    if (!frame) return
    const resize = () => {
      const nextScale = Math.max(
        frame.clientWidth / MOBILE_SCENE_WIDTH,
        frame.clientHeight / 1536,
      )
      setMobileSceneScale((current) => (current === nextScale ? current : nextScale))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  const updateAnswer = (next: ClockTime) => {
    if (solved) return
    setAnswer(next)
    setFeedback(null)
    setHasInteracted(true)
  }
  const adjust = (part: keyof ClockTime, delta: number) => {
    if (solved) return
    updateAnswer({
      ...answer,
      [part]:
        part === 'hour'
          ? (answer.hour + delta + 24) % 24
          : (answer.minute + delta * 5 + 60) % 60,
    })
  }
  const checkAnswer = useCallback(() => {
    if (solved) return
    setHasInteracted(false)
    if (!sameTime(answer, time, mode === 'digital-to-analog')) return
    const coinsWon = Math.random() < 0.35 ? 10 : 0
    setReward(coinsWon)
    if (coinsWon) addCoins(coinsWon)
    setFeedback('correct')
  }, [addCoins, answer, mode, solved, time])

  useEffect(() => {
    if (!hasInteracted || solved) return
    const timeout = window.setTimeout(checkAnswer, 1000)
    return () => window.clearTimeout(timeout)
  }, [answer, checkAnswer, hasInteracted, solved])

  const nextRound = () => {
    setRound((current) => current + 1)
    setTime(randomTime())
    setAnswer({ hour: 12, minute: 0 })
    setFeedback(null)
    setHasInteracted(false)
    setReward(0)
  }

  return (
    <main className="world-page game-page wizard-page">
      <header className="topbar game-topbar">
        <Link to="/" className="back-button">
          <ArrowLeft size={18} /> <span>Spielauswahl</span>
        </Link>
        <div className="round-chip">
          RUNDE {round}
          <span>✦</span>
        </div>
        <CoinPill amount={coins} />
      </header>
      <div className="wizard-mobile-frame" ref={mobileSceneFrameRef}>
        <section
          className={`wizard-mobile-scene ${solved ? 'is-awake' : ''}`}
          style={{ transform: `translate(-50%, -50%) scale(${mobileSceneScale})` }}
          aria-label="Der Zauberer träumt und seine Uhr steht auf dem Tisch"
        >
          <img
            className="wizard-mobile-art"
            src={
              solved
                ? reward
                  ? '/images/wizard-mobile-awake-gold.png'
                  : '/images/wizard-mobile-awake.png'
                : isNight
                  ? '/images/wizard-mobile-dream-night.png'
                  : '/images/wizard-mobile-dream-day.png'
            }
            alt={solved ? (reward ? 'Der Zauberer ist aufgewacht und hält Gold.' : 'Der Zauberer ist aufgewacht.') : 'Der Zauberer schläft und träumt in seiner Bibliothek.'}
          />
          {!solved && (
            <div className={`wizard-mobile-dream ${mode === 'digital-to-analog' ? 'is-digital' : 'is-analog'}`} aria-label="Uhrzeit im Traum">
              {mode === 'digital-to-analog' ? (
                <DigitalShell className="mobile-dream-digital-shell">
                  <DigitalClock className="dream-digital" time={time} />
                </DigitalShell>
              ) : (
                <AnalogClockShell time={time} />
              )}
            </div>
          )}
          {!solved && (
            <section className={`wizard-mobile-answer ${mode === 'analog-to-digital' ? 'is-digital' : 'is-analog'}`} aria-label="Stelle die Uhrzeit ein">
              {mode === 'analog-to-digital' && (
                <img className="mobile-alarm-art" src="/images/blank-digital-alarm.png" alt="" aria-hidden="true" />
              )}
              {mode === 'digital-to-analog' ? (
                <div className="mobile-answer-analog-clock">
                  <AnalogClockShell time={answer} onChange={updateAnswer} />
                </div>
              ) : (
                <>
                  <div className="mobile-digital-controls mobile-controls-up">
                    <button type="button" onClick={() => adjust('hour', 1)} aria-label="Stunden erhöhen">+</button>
                    <button type="button" onClick={() => adjust('minute', 1)} aria-label="Minuten erhöhen">+</button>
                  </div>
                  <DigitalClock className="mobile-answer-digital" time={answer} />
                  <div className="mobile-digital-controls mobile-controls-down">
                    <button type="button" onClick={() => adjust('hour', -1)} aria-label="Stunden verringern">−</button>
                    <button type="button" onClick={() => adjust('minute', -1)} aria-label="Minuten verringern">−</button>
                  </div>
                </>
              )}
            </section>
          )}
          {solved && (
            <div className="wizard-mobile-awake">
              <button className="play-button" onClick={nextRound} type="button">
                Weiter <ArrowLeft className="next-arrow" size={20} />
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="wizard-scene-frame" ref={sceneFrameRef}>
        <section
          className="wizard-scene"
          style={{ transform: `scale(${sceneScale})` }}
          aria-label="Der Zauberer träumt von einer Uhr"
        >
          <img
            className="wizard-scene-image"
            src={
              solved
                ? reward
                  ? '/images/wizard-awake-gold.png'
                  : '/images/wizard-awake.png'
                : isNight
                  ? '/images/wizard-dream-night.png'
                  : '/images/wizard-dream-day.png'
            }
            alt={
              solved
                ? reward
                  ? 'Der Zauberer ist aufgewacht und hält einen Goldklumpen.'
                  : 'Der Zauberer ist aufgewacht.'
                : `Ein Zauberer schläft und träumt von einer Uhr am ${isNight ? 'Nachthimmel' : 'Tag'}`
            }
          />
          {!solved && (
            <>
              {mode === 'analog-to-digital' && (
                <div className="alarm-shell-position" aria-hidden="true">
                  <img src="/images/blank-digital-alarm.png" alt="" />
                </div>
              )}
              <div
                className={`dream-clock-position ${mode === 'digital-to-analog' ? 'dream-digital-position' : 'dream-analog-position'}`}
              >
                {mode === 'analog-to-digital' ? (
                  <AnalogClockShell time={time} />
                ) : (
                  <DigitalShell className="dream-digital-shell">
                    <DigitalClock className="dream-digital" time={time} />
                  </DigitalShell>
                )}
              </div>
              <div
                className={`alarm-screen-position ${mode === 'digital-to-analog' ? 'answer-analog' : 'answer-digital'}`}
              >
                {mode === 'digital-to-analog' ? (
                  <AnalogClockShell time={answer} onChange={updateAnswer} />
                ) : (
                  <DigitalClock className="alarm-digital" time={answer} />
                )}
              </div>
              {mode === 'analog-to-digital' && (
                <div className="alarm-hotspots" aria-label="Weckuhr einstellen">
                  <Hotspot
                    className="alarm-hour-up"
                    label="Stunden erhöhen"
                    onClick={() => adjust('hour', 1)}
                    sign="+"
                  />
                  <Hotspot
                    className="alarm-minute-up"
                    label="Minuten erhöhen"
                    onClick={() => adjust('minute', 1)}
                    sign="+"
                  />
                  <Hotspot
                    className="alarm-hour-down"
                    label="Stunden verringern"
                    onClick={() => adjust('hour', -1)}
                    sign="−"
                  />
                  <Hotspot
                    className="alarm-minute-down"
                    label="Minuten verringern"
                    onClick={() => adjust('minute', -1)}
                    sign="−"
                  />
                </div>
              )}
            </>
          )}
          <div
            className={`wizard-game-feedback ${solved ? 'is-awake' : ''}`}
            aria-live="polite"
          >
            {solved ? (
              <button className="play-button clock-submit" onClick={nextRound}>
                Weiter <ArrowLeft className="next-arrow" size={22} />
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}

function AnalogClockShell({
  time,
  onChange,
}: {
  time: ClockTime
  onChange?: (time: ClockTime) => void
}) {
  return (
    <div className="analog-clock-shell">
      <img src="/images/blank-analog-clock.png" alt="" aria-hidden="true" />
      <div className="analog-clock-face">
        <AnalogClock time={time} onChange={onChange} />
      </div>
    </div>
  )
}

function DigitalShell({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  return (
    <div className={`digital-shell ${className}`}>
      <img src="/images/blank-digital-alarm.png" alt="" aria-hidden="true" />
      <div className="digital-shell-display">{children}</div>
    </div>
  )
}

function DigitalClock({
  time,
  className,
}: {
  time: ClockTime
  className: string
}) {
  return (
    <div
      className={`digital-clock ${className}`}
      role="img"
      aria-label={`Digitaluhr ${formatTime(time)}`}
    >
      {formatTime(time)
        .split('')
        .map((char, index) =>
          char === ':' ? (
            <span
              className="digital-colon"
              key={`colon-${index}`}
              aria-hidden="true"
            />
          ) : (
            <SevenSegmentDigit digit={Number(char)} key={`${char}-${index}`} />
          ),
        )}
    </div>
  )
}

const digitSegments: Record<number, string[]> = {
  0: ['a', 'b', 'c', 'd', 'e', 'f'],
  1: ['b', 'c'],
  2: ['a', 'b', 'g', 'e', 'd'],
  3: ['a', 'b', 'g', 'c', 'd'],
  4: ['f', 'g', 'b', 'c'],
  5: ['a', 'f', 'g', 'c', 'd'],
  6: ['a', 'f', 'g', 'e', 'c', 'd'],
  7: ['a', 'b', 'c'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'f', 'g', 'b', 'c', 'd'],
}

function SevenSegmentDigit({ digit }: { digit: number }) {
  const polygons: Record<string, string> = {
    a: '8,3 32,3 28,7 12,7',
    b: '34,7 37,11 37,26 34,29 30,26 30,11',
    c: '34,35 37,38 37,53 34,57 30,53 30,38',
    d: '12,57 28,57 32,61 8,61',
    e: '6,35 10,38 10,53 6,57 3,53 3,38',
    f: '6,7 10,11 10,26 6,29 3,26 3,11',
    g: '11,30 29,30 32,33 29,36 11,36 8,33',
  }
  return (
    <svg className="seven-segment-digit" viewBox="0 0 40 64" aria-hidden="true">
      {Object.entries(polygons).map(([segment, points]) => (
        <polygon
          key={segment}
          points={points}
          className={
            digitSegments[digit].includes(segment)
              ? 'segment-on'
              : 'segment-off'
          }
        />
      ))}
    </svg>
  )
}

function Hotspot({
  className,
  label,
  sign,
  onClick,
}: {
  className: string
  label: string
  sign: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`alarm-hotspot ${className}`}
      aria-label={label}
      onClick={onClick}
    >
      <span aria-hidden="true">{sign}</span>
    </button>
  )
}

function AnalogClock({
  time,
  onChange,
}: {
  time: ClockTime
  onChange?: (time: ClockTime) => void
}) {
  const minuteAngle = time.minute * 6
  const hourAngle = ((time.hour % 12) + time.minute / 60) * 30
  const dragHand = (
    event: PointerEvent<HTMLButtonElement>,
    hand: 'hour' | 'minute',
  ) => {
    if (!onChange) return
    const face = event.currentTarget.parentElement
    if (!face) return
    const bounds = face.getBoundingClientRect()
    const dx = event.clientX - (bounds.left + bounds.width / 2)
    const dy = event.clientY - (bounds.top + bounds.height / 2)
    const degrees = (Math.atan2(dx, -dy) * 180) / Math.PI
    const clockwise = (degrees + 360) % 360
    if (hand === 'minute') {
      const minute = (Math.round(clockwise / 30) * 5) % 60
      onChange({ ...time, minute })
    } else {
      const hour = Math.round(clockwise / 30) % 12 || 12
      onChange({ ...time, hour })
    }
  }
  return (
    <div
      className="analog-clock"
      role={onChange ? 'group' : 'img'}
      aria-label={`Zeigeruhr ${formatTime(time)}`}
    >
      {Array.from({ length: 12 }, (_, index) => {
        const angle = index * 30
        return (
          <span
            key={index}
            className="clock-tick"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-39cqw) rotate(${-angle}deg)`,
            }}
          >
            {index === 0 ? 12 : index}
          </span>
        )
      })}
      {onChange ? (
        <>
          <button
            type="button"
            className="clock-hand hour-hand draggable-hand"
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
            aria-label={`Stundenzeiger, ${time.hour} Uhr. Ziehen zum Einstellen.`}
            onPointerDown={(event) =>
              event.currentTarget.setPointerCapture(event.pointerId)
            }
            onPointerMove={(event) => {
              if (event.buttons === 1) dragHand(event, 'hour')
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
                event.preventDefault()
                onChange({ ...time, hour: (time.hour % 12) + 1 })
              } else if (
                event.key === 'ArrowDown' ||
                event.key === 'ArrowLeft'
              ) {
                event.preventDefault()
                onChange({ ...time, hour: ((time.hour + 10) % 12) + 1 })
              }
            }}
          />
          <button
            type="button"
            className="clock-hand minute-hand draggable-hand"
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
            aria-label={`Minutenzeiger, ${String(time.minute).padStart(2, '0')} Minuten. Ziehen zum Einstellen.`}
            onPointerDown={(event) =>
              event.currentTarget.setPointerCapture(event.pointerId)
            }
            onPointerMove={(event) => {
              if (event.buttons === 1) dragHand(event, 'minute')
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
                event.preventDefault()
                onChange({ ...time, minute: (time.minute + 5) % 60 })
              } else if (
                event.key === 'ArrowDown' ||
                event.key === 'ArrowLeft'
              ) {
                event.preventDefault()
                onChange({ ...time, minute: (time.minute + 55) % 60 })
              }
            }}
          />
        </>
      ) : (
        <>
          <span
            className="clock-hand hour-hand"
            style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }}
          />
          <span
            className="clock-hand minute-hand"
            style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }}
          />
        </>
      )}
      <span className="clock-center" />
    </div>
  )
}
