# Luisas Zauber-Lern-Schmiede

Eine responsive Lernspiel-Web-App für Kinder. Die erste Version enthält die Spielauswahl und das spielbare Mathe-Spiel „Füttere das Monster“.

## Starten

```bash
pnpm install
pnpm dev
```

Die App öffnet Vite standardmäßig unter `http://localhost:5173`.

## Qualitätssicherung

```bash
pnpm test
pnpm lint
pnpm build
```

`pnpm check` führt Formatprüfung, Lint, Tests und Build nacheinander aus. GitHub Actions führt diesen Check bei Pushes und Pull Requests aus.

React, TypeScript, Vite, React Router, Vitest, Testing Library, ESLint und Prettier bilden die Entwicklungsgrundlage. Die Spiellogik ist unabhängig von der Oberfläche unter `src/game` gehalten.

Benötigt wird Node.js 22.12 oder neuer.

## Assets

Alle Originale stammen vom Nutzer. Das Hochkantmotiv erscheint mobil, das Querformatmotiv am Desktop. Mampfis drei Reaktionsposen basieren auf dem Monster aus dem gelieferten Asset-Sheet. Futter, Aufgaben und Zahlen bleiben dynamische UI-Elemente. Es werden keine externen Bild-URLs oder Schriftarten geladen.

## Spielregeln und Speicherung

Der Generator erstellt jeweils zwölf Futterstücke in einem 3×4-Feld und wählt eine Aufgabe nur aus, wenn die aktuelle Auswahl mindestens eine gültige Lösung enthält. Er sucht in einer endlichen Kandidatenliste, daher gibt es keine Zufallsschleife ohne Abbruch. Bei zwei Lücken zählt die Auswahlreihenfolge für Subtraktion. Nach einer richtigen Lösung werden nur die ausgewählten Futterstücke ersetzt. Gold-Futter belohnt mit 10 Münzen pro Stück. Der Münzstand bleibt per `localStorage` über Neuladen hinweg erhalten.
