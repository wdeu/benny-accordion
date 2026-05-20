# 🪗 Castagnari Benny Accordion - Installation & Nutzung (v5.3)

## ✨ Was ist das?

Eine **interaktive Web-App** zur Visualisierung deines **Castagnari Benny C/G (3-reihig, Heim)** – perfekt zum Lernen von Akkorden, modalen Skalen und Bellows-Technik.

### 🆕 Neue Features (v5.3)

- ✅ **iPad ONE Screen Layout:** 3-Spalten (Bass | Diskant | Jam-Box), alles sichtbar!
- ✅ **Tempo-Slider:** 0.2s - 1.0s pro Ton (endlich nicht mehr zu schnell!)
- ✅ **Loop-Modus:** Endless Arpeggio zum Mitspielen
- ✅ **Modal-Highlighting:** Nur Skala-Töne leuchten, Rest ausgeblendet
- ✅ **Stop-Button:** Sofortiges Beenden der Wiedergabe
- ✅ **Kompakte UI:** Optimiert für Tablet Landscape

---

## 🚀 Quick Start

### Option 1: Online (Einfachste Methode) ⭐
Besuche **[wdeu.github.io/benny-accordion](https://wdeu.github.io/benny-accordion)**

### Option 2: iPhone/iPad Home Screen
1. Öffne in Safari: [wdeu.github.io/benny-accordion](https://wdeu.github.io/benny-accordion)
2. Tippe Share-Button (Quadrat mit Pfeil)
3. Scrolle zu "Zum Home-Bildschirm"
4. Tippe "Hinzufügen"

✅ **Fertig!** Jetzt hast du eine App auf dem Home-Screen!

### Option 3: Lokal nutzen
```bash
# Repository klonen
git clone https://github.com/wdeu/benny-accordion.git
cd benny-accordion

# Im Browser öffnen
open index.html
```

**Voraussetzungen:** Moderner Browser (Chrome, Firefox, Safari, Edge)  
**Internet:** Nicht nötig nach erstem Laden (vollständig offline-fähig)

---

## 🎓 Verwendung

### Normal-Modus

**Akkorde visualisieren:**
1. Wähle **Akkordtyp** (z.B. "Dur", "Moll", "7")
2. Wähle **Grundton** (z.B. "C", "D", "G")
3. → Buttons leuchten auf!
4. (Optional) **▶️ Play** drücken zum Hören

**Bass-Triaden (Quick Mode):**
1. Klicke eine **Bass-Taste** (z.B. `C` oder `c`)
2. **Großbuchstabe** (`C`) = Dur-Triade (C-E-G)
3. **Kleinbuchstabe** (`c`) = Moll-Triade (C-Eb-G)
4. → Diskant zeigt sofort die Triade!

**Tipp:** So lernst du die Akkordstruktur auf deinem Instrument!

---

### Modal-Jamming (NEU in v5.3!) 🎵

**Workflow für Skalen-Praxis:**

1. **Modale Skala wählen:**
   - Klicke z.B. "Dorisch", "Mixolydisch", "Phrygisch"

2. **Grundton wählen:**
   - Klicke z.B. "D", "G", "A"

3. **Tempo anpassen:**
   - Schiebe Slider auf **0.7s** (langsamer zum Mitspielen!)
   - 0.2s = schnell (Finger-Übung)
   - 0.5s = gemütlich (Standard)
   - 1.0s = sehr langsam (Lernen)

4. **Loop aktivieren:**
   - ☑️ **Loop ∞** anklicken
   - → Arpeggio wiederholt sich endlos!

5. **Play drücken:**
   - **▶️ Play** → Skala läuft hoch!
   - **Visuell:** Nur Skala-Töne mit blauem Rand
   - **Alle anderen Buttons:** Ausgeblendet (30% Opazität)

6. **Auf Benny nachspielen!** 🪗
   - Du siehst GENAU, welche Buttons du spielen musst!

7. **Stop bei Bedarf:**
   - **⏹️ Stop** → Sofortiger Abbruch

---

### iPad Landscape Modus 📱

**Perfektes ONE-Screen-Layout:**

```
┌─────────┬──────────────┬──────────┐
│ BASS    │  DISKANT     │ JAM-BOX  │
│ (sticky)│ (scrollbar)  │ (sticky!)│
│         │              │          │
│ [Pull]  │   ○○○ ○○ ○○ │ Akkord   │
│ [Push]  │   ○●○ ○● ●○ │ Skalen   │
│  ○ ○    │   ○○○ ○○ ○○ │ Grundton │
│  ● ○    │              │          │
│  ○ ○    │              │ Tempo    │
│         │              │ Loop ∞   │
│ [Pull]  │              │ Play/Stop│
│ [Push]  │              │          │
└─────────┴──────────────┴──────────┘
     ↑           ↑             ↑
  280px         flex        340px
             (füllt Rest)  (sticky!)
```

**Vorteile:**
- ✅ Alles auf EINEM Screen sichtbar!
- ✅ Kein Scrollen zur Jam-Box nötig!
- ✅ Bass + Balg immer im Blick!

---

## 🎨 Visuelles Feedback

### Legende

| Symbol | Bedeutung | Beispiel |
|--------|-----------|----------|
| ○ | Taste – nicht aktiv | Perlmutt-Button |
| ● | Taste – aktiv | Grau, Teil des Akkords |
| ◉ | Grundton | Grau + blauer Rand |
| ◎ | Skalenton (modal) | Perlmutt + blauer Rand |
| ◌ | Ausgeblendet (modal) | 30% Opazität |

### Modal-Modus (NEU!)

**Im normalen Akkordmodus:**
- Alle Akkordtöne = dunkelgrau
- Grundton = dunkelgrau + blauer Rand

**Im modalen Skalen-Modus:**
- Skala-Töne = **blauer Rand + Glow** (spielbar!)
- Nicht-Skala-Töne = **ausgeblendet** (30% Opazität)
- Grundton = extra hervorgehoben

**Beim Arpeggio:**
- Aktueller Ton = pulsiert extra!

**→ Du siehst sofort: "DAS sind die Töne zum Nachspielen!"**

---

## 🎯 Praxis-Beispiele

### Beispiel 1: Dur vs Dorisch verstehen

**Aufgabe:** Was macht G-Dorisch "dorisch"?

**Lösung:**
1. Akkordtyp: **"Dur"** → Grundton: **"G"**
   - Sehe: G, B, D, F# (G-Dur Tonleiter)
2. Wechsel zu **"Dorisch"** → **"G"**
   - Sehe: G, A, Bb, C, D, E, F
3. **Vergleiche:** F statt F# = charakteristischer Ton!

**Erkenntnis:** Dorisch = Dur mit kleiner 7!

---

### Beispiel 2: Loop-Modus für Praxis

**Aufgabe:** D-Moll Skala üben

**Workflow:**
1. Modale Skalen: **"Äolisch (Moll)"**
2. Grundton: **"D"**
3. Tempo: **0.8s** (gemütlich)
4. **☑️ Loop ∞** aktivieren
5. **▶️ Play**
6. → D-Äolisch läuft endlos: D-E-F-G-A-Bb-C-D (repeat)
7. **Auf Benny mitspielen!**
8. **⏹️ Stop** wenn fertig

---

### Beispiel 3: iPad ONE Screen Workflow

**Situation:** Unterwegs im Zug, nur iPad dabei

**Workflow:**
1. iPad Landscape halten
2. wdeu.github.io/benny-accordion öffnen
3. **Alles auf EINEM Screen!**
   - Links: Balg + Bass (immer sichtbar)
   - Mitte: Diskant (scrollbar wenn nötig)
   - Rechts: Jam-Box (sticky, immer sichtbar!)
4. Benny rausholen
5. **Dorisch** → **G** → Tempo **0.7s** → Loop ∞
6. Play → Mitspielen! 🎵

**Kein nerviges Scrollen mehr!** ✅

---

## 🌐 Online Deployment

### GitHub Pages (Empfohlen)

**Warum GitHub Pages?**
- ✅ Kostenlos
- ✅ Dauerhaft
- ✅ Eigene Domain möglich
- ✅ HTTPS included
- ✅ Weltweit erreichbar

**Setup:**

```bash
# 1. Repository erstellen auf github.com
# Name: benny-accordion
# Public: Ja

# 2. Lokal klonen
git clone https://github.com/DEINNAME/benny-accordion.git
cd benny-accordion

# 3. Dateien kopieren
cp ~/Downloads/benny-visualizer.html index.html
cp -r ~/Downloads/assets/ .

# 4. Pushen
git add .
git commit -m "Initial commit - v5.3"
git push

# 5. GitHub Pages aktivieren
# Settings → Pages → Source: main → Save

# 6. Warten (2-3 Min)
# → https://DEINNAME.github.io/benny-accordion
```

---

### Netlify Drop (Schnellste Methode)

1. Gehe zu [app.netlify.com/drop](https://app.netlify.com/drop)
2. Ziehe `benny-visualizer.html` in den Browser
3. **Fertig!** Sofort eine URL wie:
   `https://awesome-benny-123.netlify.app`

**Vorteil:** Kein Account nötig, sofort live!  
**Nachteil:** Nach 24h gelöscht (außer du registrierst dich)

---

## ⚙️ Einstellungen

### Bellows-Stil umschalten

**2 Darstellungen verfügbar:**

1. **Trapezoid-Modus** (Standard):
   - Große V-förmige Buttons
   - Visuell prominent
   
2. **Minimal-Modus**:
   - Kompakte Segmented Control
   - Spart Platz

**Umschalten:** ⚙️-Button neben "Balgrichtung" klicken

**Einstellung bleibt gespeichert** (LocalStorage)

---

### Audio-Einstellungen

**Klang:**
- **Akkordeon-like** (Empfohlen): Warmer Triangle-Wave
- **Rein**: Purer Sinus
- **Hell**: Sawtooth-Wave
- **Weich**: Sanfter Sinus mit längeren Hüllkurven

**Tempo:**
- Nur für Arpeggio (Skalen-Modus)
- 0.2s - 1.0s pro Ton
- Default: 0.5s

**Auto-Play:**
- ☑️ = Spielt sofort beim Akkord/Skala wählen
- ☐ = Manuell mit ▶️ Play

**Loop:**
- ☑️ = Arpeggio wiederholt endlos
- ☐ = Einmal abspielen

---

## ❓ FAQ

### Allgemein

**Q: Funktioniert offline?**  
A: Ja! Nach erstem Laden komplett offline nutzbar.

**Q: Brauche ich Internet?**  
A: Nur für erstes Laden. Danach: Nein!

**Q: Welche Browser?**  
A: Alle modernen (Chrome, Firefox, Safari, Edge).

**Q: Auf welchen Geräten?**  
A: Desktop, Laptop, Tablet, Smartphone (iOS, Android, Windows, Mac, Linux).

---

### Modal-Modus

**Q: Warum leuchten manche Töne nicht?**  
A: Sie sind nicht Teil der gewählten Skala! Das ist Absicht – du siehst nur die "richtigen" Töne!

**Q: Kann ich zwischen Push/Pull wechseln?**  
A: Ja! Balg-Buttons klicken → andere Töne werden verfügbar.

**Q: Tempo zu schnell?**  
A: Slider auf 0.7s oder 1.0s stellen! 0.5s ist Standard, aber für Anfänger oft zu schnell.

**Q: Loop stoppt nicht?**  
A: **⏹️ Stop** drücken! Der Button ist rechts neben Play.

---

### iPad/Tablet

**Q: Jam-Box ist abgeschnitten?**  
A: Das ist in v5.3 gefixt! Jam-Box ist jetzt sticky rechts. Falls du noch v5.2 hast: Hard Refresh (Cmd+Shift+R)

**Q: Auf iPad ist alles zu klein?**  
A: Landscape-Modus nutzen! Dort ist das Layout optimiert.

**Q: Kann die App offline arbeiten?**  
A: Ja! Zum Home-Screen hinzufügen → funktioniert wie native App.

---

## 🛠️ Troubleshooting

### Kein Ton?

**Checklist:**
1. Browser-Lautstärke hoch?
2. System-Lautstärke hoch?
3. Auto-Play aktiviert? (☑️)
4. ▶️ Play gedrückt?
5. Chord/Scale ausgewählt?

**iOS Safari:** Erstes Mal Play manuell drücken (Sicherheit)!

---

### Layout kaputt?

**Lösung:**
1. Hard Refresh: **Cmd+Shift+R** (Mac) / **Ctrl+Shift+R** (Windows)
2. Cache leeren in Browser-Einstellungen
3. Neuer Browser-Tab

---

### GitHub Pages zeigt alte Version?

**Lösung:**
1. Warte 2-3 Minuten nach Push
2. Hard Refresh: **Cmd+Shift+R**
3. Checke: Ist `index.html` aktualisiert?

```bash
# Check in Repo
git log --oneline -5

# Sollte zeigen: "Release v5.3" oder ähnlich
```

---

## 📄 Changelog

### v5.3 (May 20, 2026)
- ✅ iPad ONE Screen Layout (3-column grid)
- ✅ Tempo-Slider (0.2s - 1.0s)
- ✅ Loop-Toggle für endlose Wiederholung
- ✅ Modal-Highlighting (Skala-Töne hervorgehoben)
- ✅ Stop-Button
- ✅ Kompakte Jam-Box (sticky)
- ✅ Icon Set v2 (dunkel, 4×3 Grid)

### v5.2 (May 18, 2026)
- 6 Modal-Skalen (Ionisch/Äolisch added)
- Arpeggio-Playback mit Lauflicht
- Topografie (Buttons versetzt)
- "3. Reihe" statt "Helferreihe"
- "Accordion" statt "Visualizer"

### v5.1.1 (May 17, 2026)
- Doppelte Trapezoid-Controls (oben + unten)

---

## 📧 Support

**Fragen? Feedback? Bugs?**

- **GitHub Issues:** [github.com/wdeu/benny-accordion/issues](https://github.com/wdeu/benny-accordion/issues)
- **Email:** [Deine Email]

---

## 📄 Lizenz

**Custom Non-Commercial License**

- ✅ Privat nutzen: Kostenlos
- ✅ Bildung: Kostenlos
- ✅ Code studieren: Ja
- ❌ Kommerziell: Erlaubnis nötig

Siehe [LICENSE](LICENSE) für Details.

---

**Version:** 5.3  
**Letzte Aktualisierung:** Mai 20, 2026  
**Kompatibilität:** Alle modernen Browser, iOS 14+, Android 8+

Viel Spaß beim Lernen! 🪗🎵✨
