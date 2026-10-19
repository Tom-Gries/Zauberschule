# Zaubertrankladen – Bildprompts

## Weitere Kunden

Mit dem eingebauten image_gen-Werkzeug erzeugte Bilder in `public/images/`: `potion-customer-witch.png`, `potion-customer-dwarf.png`, `potion-customer-dragon.png`, `potion-customer-apprentice.png`.

Gemeinsamer Prompt (jeweils mit dem unten genannten Subject):

> Use case: illustration-story. Asset type: full body customer sprite for children's magic potion shop counting game. [Subject] Full body standing facing viewer, all feet and hat inside frame, cheerful kind expression. Polished hand-painted storybook illustration, soft dimensional shading, warm magical lighting, crisp silhouette. Isolated centered character with generous padding on genuinely transparent background, no backdrop glow, no text or watermark.

- **witch:** A friendly elderly witch with silver curly hair, round glasses, violet pointed hat and lavender dress, holding a wicker shopping basket.
- **dwarf:** A cheerful stocky dwarf with a large ginger beard, moss green cap, blue coat and leather boots, holding a wicker shopping basket.
- **dragon:** A cute friendly small mint green dragon with tiny golden horns, round belly, small wings, holding a wicker shopping basket with its front paws.
- **apprentice:** A smiling young dark-skinned wizard apprentice with short dark curly hair, deep blue pointed hat and star embroidered robe, holding a wicker shopping basket.

Erzeugt mit dem eingebauten image_gen-Werkzeug. Finale Bilder: `public/images/potion-1.png`, `potion-5.png`, `potion-10.png`, `potion-20.png`, `potion-100.png`, `potion-customer.png`, `potion-shop.png`.

Gemeinsamer Prompt für alle Assets:

> Use case: illustration-story. Asset type: children's counting game [name]. [subject] Polished hand-painted storybook game illustration, soft dimensional shading, warm magical lighting, crisp readable silhouette. Isolated centered object, generous clear padding, transparent background. No text, no numerals, no watermark.

Subjects:

- **potion-1:** One single small round emerald GREEN potion bottle with cork, represents 1 potion.
- **potion-5:** One BLUE potion carrier holding exactly five blue small bottles in one straight row, represents a pack of 5.
- **potion-10:** One PURPLE wooden potion crate with neat bottle tops in two rows of five, represents a pack of 10.
- **potion-20:** One ORANGE potion shipping chest with four neat rows of five bottle tops, represents a pack of 20.
- **potion-100:** One GOLDEN ornate large potion supply chest with golden bottle tops and a star seal, represents a pack of 100.
- **potion-50:** One ornate RED wooden potion supply chest, open, filled with ruby RED potion bottles, golden trim and red crystal seal, represents one bundle of 50 potions. Polished hand-painted storybook game illustration, soft dimensional shading, warm magical lighting, crisp readable silhouette. Isolated centered whole chest with generous padding on truly transparent background. No text, no numerals, no watermark, no colored background glow.
- **potion-customer:** One friendly little forest elf customer, curly auburn hair, pointed ears, teal cloak, holding an empty shopping basket, full body, facing viewer, warm cheerful smile.
- **potion-shop:** Wide landscape interior of a cozy magical potion shop, wooden shelves with softly glowing bottles, arched window, warm golden lanterns, violet and teal palette, empty wooden counter across bottom quarter, central area uncluttered. No characters. Opaque full scene background.

Für den Laden ersetzt „Wide composition.“ die Freisteller-Anweisung; sein Hintergrund ist deckend. Die Mengenbeschriftung wird im Spiel als scharfer HTML-Text ergänzt. Kasse, Korb und Animation werden mit HTML/CSS dargestellt.

## Geordnete Mengenbilder im Spiel

Die Spielansicht setzt jede Flasche einzeln in ein festes Raster aus dem generierten grünen Einzeltrank. Die Farben werden per CSS angepasst. Dadurch enthält jedes Mengenbild exakt die geforderte Anzahl: 5 = eine Fünferreihe, 10 = zwei Fünferreihen, 20 = vier Fünferreihen, 50 = fünf Zehnerreihen, 100 = zehn Zehnerreihen. Zehnerreihen haben eine Trennlinie nach der fünften Flasche. Gleiche Bündel stehen im Korb zusammen; einzelne Tränke in Fünferreihen. Die zusätzlich generierten Kisten bleiben als Bilddateien erhalten.

Korrekturprompt für die orange Kiste:

> Correct this educational counting game asset: there are currently only fifteen bottles. Show EXACTLY TWENTY orange potion bottles, in FOUR clearly visible rows with FIVE bottles each. Higher top-down viewpoint so all 20 corks are plainly visible and countable. Preserve orange wooden crate, orange liquid, gold trim, storybook style. Entire object isolated on truly transparent background, no colored backdrop or glow outside object. No text.

Korrekturprompt für die goldene Kiste:

> Edit this children's counting game asset: Keep the ornate large gold supply chest and its exact silhouette and composition. Change ALL potion liquid to GOLDEN yellow, no blue, green, pink or purple liquids. It represents one 100-potion bundle; add a large clean ivory badge on front with the exact clearly legible numeral '100' in dark brown. Entire chest isolated on truly transparent background. No background glow.

## Finale Hunderter-Kiste

Finaler Bildprompt:

> Use case: scientific-educational. Edit target: gold potion chest for children's quantity recognition game. Replace the disorganized chest contents and perspective entirely. Create a SQUARE shallow golden wooden sorting tray viewed EXACTLY STRAIGHT DOWN, orthographic flat overhead view, NO lid, NO perspective foreshortening, NO front wall hiding contents. Tray contains EXACTLY ONE HUNDRED identical small golden yellow potion bottles arranged in EXACTLY TEN horizontal rows and TEN vertical columns, all 100 individually visible with clear equal spacing. Use rigid perfectly aligned 10 by 10 square grid. Each of the four 5 by 5 quadrants separated by a slightly thicker wooden divider. Each cell contains exactly one small round golden glass potion bottle seen from above with cork and golden halo of glass. Beautiful warm children's storybook painting, simple gold wooden rim, subtle carved stars ONLY on rim. No bottles outside grid, no random objects, no overlapping bottles. No numeral badge, no text. Transparent background outside square tray. Count accuracy and 10x10 geometric alignment are paramount.

`public/images/potion-100-ordered.png` (auch unter `potion-100.png`): geprüftes 10×10-Raster mit vier durch Holzleisten getrennten 5×5-Feldern, exakt 100 goldenen Flaschen. Mit dem eingebauten image_gen-Werkzeug erzeugt. Dieses Bild wird jetzt direkt in Einkauf und Zählhilfe verwendet.
