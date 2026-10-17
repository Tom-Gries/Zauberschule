import { ArrowRight, BookOpen, LockKeyhole, Sparkles, Star } from 'lucide-react'
import { Link } from 'react-router'
import { CoinPill } from './CoinPill'
export function HomePage({ coins }: { coins: number }) {
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
          <article className="game-card locked-card">
            <div className="locked-art">
              <BookOpen size={58} />
              <span>3 × 4</span>
            </div>
            <div className="game-card-copy">
              <div className="card-kicker">ZAHLEN & MUSTER</div>
              <h3>Finde die Zahlen</h3>
              <p>Entdecke verborgene Zahlenpaare in der Schatztruhe.</p>
              <div className="locked-label">
                <LockKeyhole size={15} /> Bald verfügbar
              </div>
            </div>
          </article>
          <article className="game-card locked-card">
            <div className="locked-art potion-art">
              <span>🧪</span>
              <span>12 ÷ 3</span>
            </div>
            <div className="game-card-copy">
              <div className="card-kicker">ZAUBERRECHNEN</div>
              <h3>Der Zaubertrank</h3>
              <p>Mische die richtigen Zutaten für deinen Zaubertrank.</p>
              <div className="locked-label">
                <LockKeyhole size={15} /> Bald verfügbar
              </div>
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
