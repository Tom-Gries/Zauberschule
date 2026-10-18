import { ArrowRight, Coins, LockKeyhole, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router'
import { CoinPill } from './CoinPill'
export function HomePage({
  coins,
  wizardUnlocked,
  onUnlockWizard,
  sentenceUnlocked,
  onUnlockSentence,
}: {
  coins: number
  wizardUnlocked: boolean
  onUnlockWizard: () => void
  sentenceUnlocked: boolean
  onUnlockSentence: () => void
}) {
  return (
    <main className="world-page home-page">
      <header className="topbar">
        <Link to="/" className="brand-mark" aria-label="Zur Startseite">
          ✦
        </Link>
        <div className="brand-name">
          <span>Luisas</span>
          <strong>Zauber-Lern-Schmiede</strong>
        </div>
        <CoinPill amount={coins} />
      </header>
      <section className="welcome-panel panel">
        <p className="eyebrow">
          <Sparkles size={15} /> WILLKOMMEN IN DER AKADEMIE
        </p>
        <h1>
          Dein nächstes
          <br />
          <em>Abenteuer</em> wartet!
        </h1>
        <p className="intro-copy">
          Lerne spielend neue Zauber und hilf deinen magischen Freunden.
        </p>
        <div className="welcome-stars" aria-hidden="true">
          ✦ <span>✧</span> ✦
        </div>
      </section>
      <section className="games-section" aria-labelledby="games-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DEINE LERNWELT</p>
            <h2 id="games-title">Meine Zauberspiele</h2>
          </div>
          <div className="progress-chip">
            <Star size={16} fill="currentColor" /> Erste Abenteuer
          </div>
        </div>
        <div className="game-grid">
          <article className="game-card featured-card">
            <div className="card-art monster-art" aria-hidden="true">
              <div className="monster-orb" />
              <span className="art-sparkle sparkle-one">✦</span>
              <span className="art-sparkle sparkle-two">✧</span>
              <span className="snack snack-apple">🍎</span>
              <span className="snack snack-cheese">🧀</span>
            </div>
            <div className="game-card-copy">
              <div className="card-kicker">MATHE · PLUS & MINUS</div>
              <h3>Füttere das Monster</h3>
              <p>Finde das richtige Futter und mach Mampfi glücklich!</p>
              <div className="card-bottom">
                <span className="difficulty">
                  <Star size={14} fill="currentColor" /> Dein erstes Spiel
                </span>
                <Link className="play-button" to="/spiele/monster-fuettern">
                  Spielen <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </article>
          <article className="game-card featured-card sentence-card">
            <div className="card-art sentence-art" aria-hidden="true">
              <span className="sentence-book">📖</span>
              <span className="sentence-glow">✦</span>
            </div>
            <div className="game-card-copy">
              <div className="card-kicker">LESEN · WÖRTER FINDEN</div>
              <h3>Das verzauberte Satzbuch</h3>
              <p>
                {sentenceUnlocked
                  ? 'Finde das fehlende Wort und sammle Gold für den Zauberer.'
                  : 'Finde das fehlende Wort. Einmalig für 250 Goldmünzen freischalten.'}
              </p>
              <div className="card-bottom">
                {sentenceUnlocked ? (
                  <>
                    <span className="difficulty">
                      <Star size={14} fill="currentColor" /> Deine Sätze
                    </span>
                    <Link className="play-button" to="/spiele/wort-zauber">
                      Spielen <ArrowRight size={17} />
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="difficulty">
                      <LockKeyhole size={14} /> Einmaliger Kauf
                    </span>
                    <button
                      className="play-button unlock-button"
                      type="button"
                      disabled={coins < 250}
                      onClick={onUnlockSentence}
                    >
                      <Coins size={16} /> 250 G kaufen
                    </button>
                  </>
                )}
              </div>
              {!sentenceUnlocked && coins < 250 && (
                <p className="unlock-shortfall">
                  Noch {250 - coins} Goldmünzen sammeln
                </p>
              )}
            </div>
          </article>
          <article
            className={`game-card wizard-card ${wizardUnlocked ? 'featured-card' : 'locked-card'}`}
          >
            <div className="card-art wizard-card-art">
              <img
                src="/images/wizard-dream-day.png"
                alt="Der Zauberer schläft und träumt von einer Burg"
              />
              {!wizardUnlocked && (
                <span className="wizard-price-tag">
                  <Coins size={15} /> 100 G
                </span>
              )}
            </div>
            <div className="game-card-copy">
              <div className="card-kicker">ZEIT LERNEN · UHR LESEN</div>
              <h3>Den müden Zauberer wecken</h3>
              <p>
                {wizardUnlocked
                  ? 'Lies die Traumzeit und stelle die Gegenuhr ein.'
                  : 'Lies die Traumzeit und stelle die Gegenuhr ein. Einmalig für 100 Goldmünzen freischalten.'}
              </p>
              <div className="card-bottom">
                {wizardUnlocked ? (
                  <>
                    <span className="difficulty">
                      <Star size={14} fill="currentColor" /> Freigeschaltet
                    </span>
                    <Link className="play-button" to="/spiele/mueden-zauberer">
                      Spielen <ArrowRight size={17} />
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="difficulty">
                      <LockKeyhole size={14} /> Einmaliger Kauf
                    </span>
                    <button
                      className="play-button unlock-button"
                      type="button"
                      disabled={coins < 100}
                      onClick={onUnlockWizard}
                    >
                      <Coins size={16} /> 100 G kaufen
                    </button>
                  </>
                )}
              </div>
              {!wizardUnlocked && coins < 100 && (
                <p className="unlock-shortfall">
                  Noch {100 - coins} Goldmünzen sammeln
                </p>
              )}
            </div>
          </article>
        </div>
      </section>
      <footer className="home-footer">
        ✧ Jeder Zauber beginnt mit einer neugierigen Frage ✧
      </footer>
    </main>
  )
}
