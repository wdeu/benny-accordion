# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

---

## [5.0.0] - 2026-05-16

### 🎵 Added - Audio Engine
- **Web Audio API Integration** – Akkorde hörbar machen ohne MIDI-Hardware
- **4 Klang-Typen:**
  - Akkordeon-like (warm mit Obertönen)
  - Rein (Sinus, clean)
  - Hell (brillante Obertöne)
  - Weich ausklingend (langer Decay)
- **Duration-Control** – 1-5 Sekunden einstellbare Wiedergabedauer
- **Auto-Play Toggle** – Optional automatisch abspielen bei Akkordwechsel

### 🎼 Added - Erweiterte Akkorde
- **13 Akkordtypen** (vorher 6):
  - Dreiklänge: Dur, Moll, dim, aug, sus2, sus4
  - Septakkorde: 7, maj7, m7, dim7, m7b5
  - Sixte: 6, m6
- **4 Modale Skalen:** Dorisch, Mixolydisch, Phrygisch, Lydisch (unverändert)

### ⚠️ Added - Benny-Verfügbarkeits-Check
- **Warnung-System** – Zeigt an, welche Töne auf dem Benny C/G nicht verfügbar sind
- **Pädagogischer Wert** – Audio spielt vollständigen Akkord, Visualisierung zeigt nur verfügbare Töne
- **Lerneffekt** – User versteht, welche Akkorde gut auf Benny funktionieren

### 🎹 Added - Bass-Integration
- **Bass-Shortcuts im Akkordmodus:**
  - Klick "D" (Großbuchstabe) → D-Dur
  - Klick "d" (Kleinbuchstabe) → d-Moll
- **Schneller Workflow** – Ein Klick statt zwei (Typ + Grundton)

### 📜 Added - Attribution
- **MIT License Credit** – Audio-Konzept inspiriert von Harmonic Extension
- **Code-Kommentare** – Klare Quellenangabe im JavaScript
- **README Credits-Sektion** – Öffentliche Anerkennung von @chandlervdw

### ❌ Removed - Normal-Modus
- **Normal-Modus komplett entfernt** – Fokus auf Akkord-Lernen mit Audio
- **Stück-Dropdown entfernt** – Wird später als separates Feature wiederkommen
- **Grund:** Feedback dass Normal-Modus beim Lernen nicht hilft

### 🔧 Changed - UI Optimierung
- **Audio-Controls** direkt im Akkord-Panel integriert
- **Play-Button** prominent platziert (blau, iOS-Style)
- **Kompakteres Layout** – mehr Platz für Keyboard-Visualisierung

### 🐛 Fixed
- Balgrichtung-Wechsel aktualisiert jetzt korrekt die Labels
- CSS-Klassen für inactive/active/root States optimiert

---

## [4.0.0] - 2026-02

### Added - iOS Design Refresh
- **Grautöne-Dominanz** – iOS Human Interface Guidelines
- **Perlmutt-Buttons** – Sichtbar auf hellen & dunklen Displays
- **Side-by-Side Layout** – Bass links, Diskant rechts (Desktop/Tablet)
- **Auto-Rotation** – iPhone Landscape → automatisch Side-by-Side
- **PWA Icons** – Benny.png als Favicon & Home-Screen Icon

### Changed
- **Grundton-Buttons** – Jetzt direkt im Akkord-Panel (kein Scrollen)
- **Workflow optimiert** – Alle Controls auf einen Blick
- **Bass-Triaden** – Groß-/Kleinbuchstabe Logik im Normal-Modus

### Removed
- **MIDI Support** – Zu nische, kaum Hardware vorhanden
- **"Alle löschen" Button** – Überflüssig durch Auto-Clear

---

## [3.0.0] - 2025-11

### Added
- Akkordmodus mit Dur/Moll/7/maj7/dim/aug
- Modale Skalen (Dorisch, Mixolydisch, Phrygisch, Lydisch)
- Normal-Modus mit 5 Bourrées/Polkas

---

## [2.0.0] - 2025-09

### Added
- Push/Pull Visualisierung
- Spieler-Perspektive (Helfer links, G rechts)
- Responsive Design

---

## [1.0.0] - 2025-08

### Added
- Initiale Version
- Button-Layout für Castagnari Benny C/G
- Heim-Belegung (nicht Standard!)

---

**Format:** Basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/)  
**Versionierung:** [Semantic Versioning](https://semver.org/lang/de/)
