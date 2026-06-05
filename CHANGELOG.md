# Changelog

All notable changes to this project are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/); versioning follows [Semantic Versioning](https://semver.org/).

---

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
