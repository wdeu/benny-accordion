# Changelog

All notable changes to this project are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); versioning follows [Semantic Versioning](https://semver.org/).

---

## [5.19.0] - 2026-07-06

### ⇄ Added — Schwester-App-Toggle + Live-Folgen (Benny ⇄ Soufflet)
- Neuer, fest platzierter Button unten links: **„⇄ 📜 Zu Soufflet"** — wechselt zur Schwester-App und lädt dort **dasselbe Repertoire-Stück** (via neuem `?piece=<id>`-Deeplink, den beide Apps verstehen). Wiederholtes Umschalten nutzt denselben Tab wieder (`window.name`).
- **Live-Folgen:** Sind beide Apps auf derselben Origin geöffnet (wdeu.github.io, lokaler Server), zieht die Schwester beim Laden eines Repertoire-Stücks **automatisch nach** — ohne Klick, ohne Reload (localStorage-Events, Key `diato.nowPlaying`). Auf den IONOS-Subdomains (verschiedene Origins) greift stattdessen der Toggle-Klick.
- Manuell per 📂 geladene Dateien werden bewusst **nicht** übergeben (keine Repertoire-Identität) — der Toggle öffnet die Schwester im letzten Zustand, mit Hinweis in der Statuszeile.
- **Fix:** Der 📜-Link im Repertoire-Modal baute eine absolute `?score=`-URL des aktuellen Hosts — von benny.wdeu.de aus scheiterte deren Abruf in Soufflet an CORS. Jetzt `?piece=<id>`, die Schwester löst selbst auf.
- Bekannte Grenze: einen **unabhängig geöffneten** Schwester-Tab findet der Namens-Lookup nicht (erster Toggle-Klick öffnet dann einen neuen Tab) — Live-Folgen hält den unabhängigen Tab trotzdem synchron.

## [5.18.0] - 2026-07-05

### 🎼 Changed — Gavotte en Bois als Default-Stück
- Die Händel-Sarabande weicht **„Gavotte en Bois" (J.-M. Bencetti, Gavote de Grenoble)** — akkordeontypischer und mit 0% erzwungenen Balgwechseln ein echtes Schaufenster für den C/G Benny.
- Events per Pipeline-Modulen direkt aus `repertoire/files/Gavotte_en_Bois_….mxl` generiert (identischer Resolver-Pfad wie beim Datei-Laden). „Encore Un Peu" wäre nach Score noch leichter gewesen, scheidet aber aus: die Melodiestimme der Datei pausiert 49 Takte.

## [5.17.0] - 2026-07-05

### 🎶 Added — "Meine Stücke": analysiertes Repertoire im Modal
- Neuer Tab **Meine Stücke** im Repertoire-Modal: lädt `repertoire/index.json` (lokal `../repertoire/`, auf Pages die gesyncte publish-Auswahl) und listet die eigenen, von der Pipeline analysierten Stücke — gruppiert nach Übestatus (Kann ich / In Arbeit / Neu), innerhalb sortiert nach Schwierigkeit.
- **1-Klick-Laden**: Zeile anklicken → Stück landet direkt im Play-Along (Watch/Wait/Flow); 📜 öffnet dasselbe Stück mit D.E.S.-Tablatur in Soufflet.
- **Übestatus** pro Stück direkt im Modal umschaltbar, persistiert in `localStorage` (`benny.uebestatus`).
- Ohne `index.json` (404, `file://`) verhält sich das Modal exakt wie bisher (nur Referenzliste).

### 🛠 Added — Analyse-Pipeline (`tools/`)
- `tools/analyze-repertoire.mjs`: scannt `~/Projects/partituren`, konvertiert `.mscz` per MuseScore-4-CLI, berechnet **dieselbe Balg-Belastung wie der 📂-Load-Analyzer** (Logik nach `tools/lib/benny-core.mjs` extrahiert, Parität verifiziert) plus `unplayablePct`, Schwierigkeits-Tier und Metadaten → `~/Projects/repertoire/index.json`. `--sync` veröffentlicht nur Stücke mit `publish: true`.

## [5.15.0] - 2026-06-05

### 🎯 Added — Benny-fit indicator on load
- Every loaded piece now shows how well it suits a C/G Benny, measured by the share of notes whose melody forces the bellows opposite to the harmony: 🟢 sehr gut (≤5%), 🟡 gut spielbar (≤15%), 🟠 fordernd (≤30%), 🔴 chromatisch / außerhalb der Komfortzone (>30%).
- Honest about the diatonic instrument's limits — a chromatic tune (e.g. the Godfather Waltz in Dm) reads 🟠, reflecting real push/pull conflicts rather than a file or import error.
- Shown across all load paths (MusicXML, MIDI, default demo).

## [5.14.3] - 2026-06-05

### 🎵 Changed — Smarter bass on import
- For loaded pieces, the **chord symbol now drives the bass** (the root a player actually presses), read from the downbeat event itself so a mid-measure harmony change no longer lags.
- The lowest-accompaniment-note heuristic is now only a **fallback** for scores without chord symbols.
- Fixes a class of bug where a low melody passing tone could be mistaken for the bass.

## [5.14.0] - 2026-06-01

### 🎼 Added — Sarabande as the default piece
- The app now opens with **Handel's Sarabande** pre-loaded (melody + per-measure bass), so a first glance shows melody, bass and bellows behaviour without loading a file.
- Replaces the melody-only hand-written Bourrée demo (which had no bass).
- Subsequent patches (5.14.1–5.14.3) refined the embedded Sarabande's cadential bass to a clean descending F→E→A.

## [5.13.0] - 2026-06-01

### 🌍 Changed — Heim info fully localized
- The **Heim G/C system panel** (origin, key strengths, modal strengths, notation, chromatic note) now switches with the language selector under the title (EN / DE / FR / IT).
- i18n strings carrying inline markup are now applied as HTML, so emphasis survives translation.
- Fixed the embedded Benny photo path (now `assets/hero-benny.jpg`).

## [5.12.0] - 2026-06-01

### 🪂 Added — Raw MIDI import (parachute)
- **`.mid` / `.midi` import** for the many files that were never prepared in a notation editor.
- **Per-measure chord estimation** from a pitch-class tally (root + third + fifth scoring) feeds the same bellows resolver. Melody = top note, bass = lowest simultaneous note.
- Known limitation: assumes 4/4; MusicXML with real chord symbols remains the accurate path.

### ❌ Removed
- The "require bellows gesture (Kür)" toggle. The bellows now always switches automatically with the loud change signal.

## [5.11.0] - 2026-06-01

### 🎤 Added — Listen mode (real instrument)
- **🎤 Listen toggle inside Wait** — the play-head advances when the microphone hears the correct melody pitch on the real Benny, so both hands stay on the instrument.
- Autocorrelation pitch detector (RMS-gated, parabolic interpolation), validated across the Benny treble range.
- **Off by default**, one-time microphone permission, automatic fallback to tapping if denied or unavailable.
- Audio is analysed locally; nothing leaves the device.

## [5.10.0] - 2026-06-01

### 🎵 Added — Bass for loaded pieces
- **Plan A:** bass from a real notated staff (lowest accompaniment note, across all parts/staves).
- **Plan B:** bass distilled from chord symbols when no bass staff exists.
- The bass button lights (and sounds in Watch) with the melody note, in the shared bellows direction.
- Melody is now restricted to staff 1, so a piano left hand no longer pollutes the lead line.

## [5.9.0] - 2026-05-31

### 🎼 Added — Play-Along song mode + MusicXML import
- **Play-head with Watch / Wait / Flow** — a practice continuum from "plays itself" to "you keep up at tempo".
- **Resolver** maps pitch + chord to button + bellows direction (from `BUTTON_OCTAVES`).
- **Automatic bellows switching** with an unmissable signal (blue frame + flicker).
- **Wait mode** holds for the correct button; no penalty for a wrong one.
- **MusicXML import** (`.mxl` / `.xml`): library-free ZIP unzip via `DecompressionStream` + DOMParser.
- **Tempo slider** 40–200 bpm.

### 🐛 Fixed
- Missing `#fitToggleBtn` (null error that broke Play-Along in v5.8.x).
- Compact song panel in Play-Along so bass + treble fit side by side on iPhone portrait.
- Removed the redundant upper bellows-direction switch to save space.

## [5.3.0] - 2026-05-20

### Added — iPad one-screen layout
- **3-column grid** (Bass | Treble | Jam-Box), all visible without scrolling.
- **Tempo slider** and **Loop ∞** for the arpeggio, plus a **Stop** button.
- **Modal highlighting** — only scale tones light up.
- Icon set v2.

## [5.0.0] - 2026-05-16

### 🎵 Added — Audio engine
- **Web Audio API** — chords audible without MIDI hardware.
- **4 tone types:** Accordion-like (warm), Pure (sine), Bright (sawtooth), Mellow (long decay).
- **Duration control** (1–5 s) and an **auto-play** toggle.

### 🎼 Added — Extended chords
- **13 chord types** (up from 6): triads (major, minor, dim, aug, sus2, sus4), sevenths (7, maj7, m7, dim7, m7b5), sixths (6, m6).
- **4 modal scales:** Dorian, Mixolydian, Phrygian, Lydian.

### ⚠️ Added — Benny availability check
- Warns which notes are unavailable on the Benny C/G; audio plays the full chord while the visualisation shows only playable tones.

### 🎹 Added — Bass integration
- Bass shortcuts in chord mode: uppercase root → major, lowercase → minor.

### ❌ Removed
- Normal mode and the piece dropdown (returned later as the dedicated song mode).

## [4.0.0] - 2026-02

### Added — iOS design refresh
- Greyscale palette, pearl buttons, side-by-side bass/treble layout, auto-rotation, PWA icons.

### Removed
- MIDI hardware support (too niche); the "clear all" button (made redundant by auto-clear).

## [3.0.0] - 2025-11

### Added
- Chord mode (major/minor/7/maj7/dim/aug), modal scales, and a normal mode with several bourrées and polkas.

## [2.0.0] - 2025-09

### Added
- Push/Pull visualisation, player's perspective, responsive design.

## [1.0.0] - 2025-08

### Added
- Initial version: button layout for the Castagnari Benny C/G, Heim tuning.
