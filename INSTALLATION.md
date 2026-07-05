# Castagnari Benny Accordion — Installation & Use (v5.18)

## What is this?

An interactive web app for the **Castagnari Benny C/G (3-row, Heim Standard)** — for learning the keyboard, chords, modal scales, bellows technique, and now whole pieces through a follow-the-lights Play-Along system with MusicXML and MIDI import.

### New since v5.0

- 🎵 **Song mode** — load a score and the app lights the buttons to play, switching bellows direction automatically.
- 📂 **MusicXML and MIDI import** — `.mxl`/`.xml` (chord symbols drive the bellows) and `.mid` (chord estimated from the notes).
- ▶️ **Watch / Wait / Flow** — three practice stages from "plays itself" to "you keep up at tempo".
- 🎤 **Listen mode** — at the real Benny, the app hears the correct note and advances on its own.
- 🖥️ **Fit-to-Screen** — scales the layout to phone, tablet or desktop window; on by default in Play-Along.
- 📚 **Meine Stücke** (since v5.17) — a "Meine Stücke" tab in the Repertoire dialog lists your own analysed pieces (bellows-load %, difficulty, practice status), fed by the pipeline in `tools/`. See the README for details.

---

## Quick start

### Option 1 — Online (easiest) ⭐
Visit **[wdeu.github.io/benny-accordion](https://wdeu.github.io/benny-accordion)**

### Option 2 — iPhone / iPad home screen
1. Open in Safari: [wdeu.github.io/benny-accordion](https://wdeu.github.io/benny-accordion)
2. Tap the Share button (square with arrow)
3. Scroll to "Add to Home Screen"
4. Tap "Add"

✅ You now have an app on your home screen, usable offline.

### Option 3 — Local
```bash
git clone https://github.com/wdeu/benny-accordion.git
cd benny-accordion
open index.html
```

**Requirements:** a modern browser (Chrome, Firefox, Safari, Edge). No internet needed after first load.

---

## Using song mode

1. Tap **📂 Load** and choose a `.mxl`, `.xml`/`.musicxml`, or `.mid` file.
2. The status line confirms how many notes loaded and whether the bass came from a notated staff or from chords.
3. Pick a practice stage:
   - **Watch** — the piece plays itself; notes sound, buttons glow, bellows switches with a blue-frame signal.
   - **Wait** — it stops at each note until you play the right one (tap, or play it on the real Benny with 🎤 Listen on). No penalty for a wrong button.
   - **Flow** — the clock runs at the tempo slider; the lights mark the beat and you keep up.
4. Use the **tempo slider** (40–200 bpm) to set the pace in Watch and Flow.
5. The transport row gives **⏮ restart · ▶/⏸ play-pause · ⏹ stop**.

### 🎤 Listen mode (real instrument)
In **Wait**, tick **🎤 Listen**. The app asks once for microphone permission, then advances the play-head when it hears the correct melody pitch — both hands stay on the Benny. If permission is denied or unavailable it silently reverts to tapping. Audio is analysed locally and never leaves the device.

---

## Jam-Box (chords & scales)

1. Choose a **chord type** (Major, Minor, 7, maj7, dim, aug, sus, 6, …) or a **modal scale** (Ionian → Aeolian).
2. Choose a **root** (C D E F G A Bb Ab Eb).
3. The matching buttons light up; **▶ Play** arpeggiates them. Enable **Loop ∞** to repeat, set the tempo, **⏹ Stop** to end.
4. Switch **Push/Pull** to see where the same notes live on the other bellows direction.

---

## Visual feedback

| Symbol | Meaning |
|--------|---------|
| ○ pearl | inactive button |
| ● grey | active note (chord / scale) |
| ◉ blue ring | root note |
| 🟢 green | the note to play now (song mode) |
| blue frame + flicker | bellows direction change demanded |

---

## Online deployment (GitHub Pages)

```bash
# 1. Create a public repo "benny-accordion" on github.com
# 2. Clone, add files
git clone https://github.com/YOURNAME/benny-accordion.git
cd benny-accordion
cp ~/Downloads/benny-accordion.html index.html
cp -r ~/Downloads/assets/ .
git add .
git commit -m "release v5.12.0"
git push
# 3. Settings → Pages → Source: main → Save
# 4. Live at https://YOURNAME.github.io/benny-accordion (after ~1–2 min)
```

The deploy is automated via the Raycast script `benny-deploy.sh`.

---

## FAQ

**Works offline?** Yes — after the first load, completely offline.

**Which browsers?** All modern ones (Chrome, Firefox, Safari, Edge), iOS 14+, Android 8+.

**Why don't some notes light up?** They don't exist on that bellows direction — switch Push/Pull.

**Why did MIDI direction look off on a waltz?** Raw MIDI import assumes 4/4 for its per-measure chord guess; MusicXML with real chord symbols is the accurate path.

**No sound on iOS the first time?** Tap once to start audio (a browser security rule), then it works.

**Layout looks broken after an update?** Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows).

---

## Licence

Custom non-commercial licence — free for personal and educational use; study and fork freely with attribution; commercial use by arrangement. See [LICENSE](LICENSE).

**Version:** 5.12.0 · Compatibility: modern browsers, iOS 14+, Android 8+

Have fun learning! 🎶
