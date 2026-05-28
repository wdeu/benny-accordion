# 🎵 Bass System Spectral Analysis
## Castagnari Benny C/G – Heim Tuning

---

## 1. Overview

The bass system of the Castagnari Benny C/G was analyzed using FFT (Fast Fourier Transform) spectral analysis of real recordings. Chord voicings in the web application are based on this analysis.

**Instrument:** Castagnari Benny C/G (Heim tuning, 3-row)  
**Recording Equipment:** RØDE Wireless Micro RX + iPhone 16 Pro  
**Analysis Method:** FFT via scipy (Python), 48 kHz WAV  
**Analysis Window:** Middle 50% of each note (skip attack/release transients)

---

## 2. Heim G/C System – Musical Context

### Origins
The Heim G/C layout is derived from Jean-Michel Corgeron's layout, differing in only one note: a pressed A in the third row (Helferreihe). This single difference significantly strengthens the Aeolian mode on A.

### Key Characteristics

| Tonart | Pull-Reichweite | Stärke |
|--------|-----------------|--------|
| **G** | 3 Oktaven vollständig | ⭐⭐⭐ Stärkste |
| **D** | 3 Oktaven vollständig | ⭐⭐⭐ Stark (D > F) |
| **C** | 2 Oktaven vollständig | ⭐⭐ Stark |
| **F** | 2 Oktaven vollständig | ⭐⭐ Gut |

### Modal Strengths

| Modus | Reihe | Stärke | Anmerkung |
|-------|-------|--------|-----------|
| G-Dur / G-Dorisch | G-Reihe | ⭐⭐⭐ | Voll auf Pull |
| D-Dur / D-Dorisch | G-Reihe | ⭐⭐⭐ | Bourrées ideal |
| C-Moll / C-Mixolydisch | C-Reihe | ⭐⭐⭐ | Stark |
| **A-Äolisch** | Helferreihe | ⭐⭐⭐ | **Heim-Spezialstärke** |
| D-Äolisch | G + Helfer | ⭐⭐⭐ | Für Bourrées d'Avignon etc. |

**Chromatik:** Über 2 Oktaven vollständig chromatisch; chromatische Skalen erfordern Balgumkehr.

### Corgeron vs. Heim
```
Corgeron G/C:  3. Reihe = Standard-Belegung
Heim G/C:      3. Reihe = ein gedrücktes A (statt X)
                          → stärkt A-Äolisch erheblich
                          → ideal für modale osteuropäische Melodien
```

---

## 3. Recording Details

### Session 1: Full Bass Range (all 24 buttons)
```
File:      Bass_Benny_PUSH__C-c-G-g-Ab-ab_F-f-E-e-Eb-eb__PULL__G-g-D-d-B-b_F-f-A-a-Bb-bb.m4a
Duration:  58.18 seconds
Format:    AAC, 48 kHz, stereo
Sequence:  PUSH: C c G g Ab ab F f E e Eb eb
           PULL: G g D d B b F f A a Bb bb
```

### Session 2: Individual Chord Recordings (PUSH)
```
Bass_Benny_PUSH_chord_c.mp3
Bass_Benny_PUSH_chord_g.m4a
Bass_Benny_PUSH_chord_ab.m4a
Bass_Benny_PUSH_chord_f.m4a
Bass_Benny_PUSH_chord_e.m4a
Bass_Benny_PUSH_chord_eb.m4a
```

### Session 3: Individual Chord Recordings (PULL)
```
Bass_Benny_PULL_chord_g.m4a
Bass_Benny_PULL_chord_d.m4a
Bass_Benny_PULL_chord_b.m4a
Bass_Benny_PULL_chord_f.m4a
Bass_Benny_PULL_chord_a.m4a
Bass_Benny_PULL_chord_bb.m4a
```

---

## 4. Key Discovery: Uppercase vs. Lowercase Buttons

### Notation Convention (International Standard, since v5.7.0)
```
UPPERCASE (C, G, Ab...) = chord (chord)
lowercase (c, g, ab...) = single note (single note)
```
This follows international music notation where uppercase = chord/major, lowercase = single note.

### Lowercase (Single note: c, d, e...)
Play the root note in **2 octaves** (L + M voices):
```
c → C2 (65 Hz) + C3 (131 Hz)
```

### Uppercase (chord / chord: C, D, E...)
Play the root in **3 octaves** + **fifth** in specific register:
```
C → C2 (65 Hz) + C3 (131 Hz) + C4 (262 Hz) + G4 (392 Hz)
    Voice L      + Voice M      + Voice H      + Fifth (high)
```

---

## 5. Chord Voicing Analysis

### PUSH Direction – Results

| Chord | Root | Fifth (measured) | Fifth Hz | Voicing |
|-------|------|-------------------|----------|---------|
| **c** | C | G4 | 394 Hz | ☀️ Brilliant |
| **g** | G | D4 | 294 Hz | ☀️ Brilliant |
| **ab** | Ab | Eb4 | 312 Hz | ☀️ Brilliant |
| **f** | F | C4 | 262 Hz | ☀️ Brilliant |
| **e** | E | **B3** | **248 Hz** | 🌙 Mellow |
| **eb** | Eb | **Bb3** | **233 Hz** | 🌙 Mellow |

### PULL Direction – Results

| Chord | Root | Fifth (measured) | Fifth Hz | Voicing |
|-------|------|-------------------|----------|---------|
| **g** | G | D4 | 294 Hz | ☀️ Brilliant |
| **d** | D | **A3** | **220 Hz** | 🌙 Mellow |
| **b** | B | F#4 | 371 Hz | ☀️ Brilliant |
| **f** | F | C4 | 262 Hz | ☀️ Brilliant |
| **a** | A | E4 | 331 Hz | ☀️ Brilliant |
| **bb** | Bb | F4 | 350 Hz | ☀️ Brilliant |

### Summary

```
🌙 MELLOW chords (fifth at octave 3, ~220-248 Hz):
   e (PUSH)  → B3  (247 Hz)
   eb (PUSH) → Bb3 (233 Hz)
   d (PULL)  → A3  (220 Hz)

☀️ BRILLIANT chords (fifth at octave 4, ~262-394 Hz):
   All others
```

---

## 6. Musical Interpretation

### Castagnari's Reed Design Philosophy

The three **mellow** chords (e, eb, d) are NOT random — they cluster around adjacent semitones:

```
D  (294 Hz root) → A3  fifth → 🌙 MELLOW
Eb (311 Hz root) → Bb3 fifth → 🌙 MELLOW  
E  (330 Hz root) → B3  fifth → 🌙 MELLOW
```

These are precisely the chords most used in **Moll and modal Bal-Folk music**:
- **d** → D-Moll accompaniment (Bourrée d'Avignon, etc.)
- **eb** → C-Moll, Eb-Dur contexts
- **e** → E-Moll, A-Moll contexts

Castagnari has optimized the reed voicing for the **actual musical context** of these chords in French traditional music and modal playing, consistent with the Heim layout's specialization in modal/minor music.

### Connection to Heim System
The mellow voicing of **d** (PULL) directly supports the Heim layout's strength in **D-Äolisch** — one of the system's signature modes for Bourrées and other Bal-Folk repertoire.

---

## 7. Treble (Diskant) Sound Analysis

### Recording Details
```
File:     Benny_Audio.mp3 (59 seconds, 320 kbps)
+ C-Bass__C-Diskant_Benny.m4a (pitch calibration)
Equipment: RØDE Wireless Micro RX + iPhone 16 Pro
```

### Spectral Characteristics
```
Fundamental: 699.3 Hz (F5)

Harmonic Structure:
  1:  699 Hz    0.0 dB   Fundamental
  2: 1395 Hz  -14.8 dB   Weak (reed characteristic)
  3: 2093 Hz  -11.7 dB   ⭐ Strong odd harmonic
  4: 2793 Hz  -20.5 dB   Weak
  5: 3491 Hz  -17.7 dB   ⭐ Strong odd harmonic
  6: 4190 Hz  -29.4 dB   Very weak
  7: 4888 Hz  -15.8 dB   ⭐ Strong odd harmonic
  8: 5586 Hz  -34.1 dB   Very weak
  9: 6287 Hz  -35.7 dB   Very weak
 10: 6984 Hz  -39.7 dB   Very weak

Key Metrics:
  Even/Odd Harmonic Ratio: 0.22 (odd 4.5× stronger)
  Spectral Centroid: 3470 Hz (very bright)
  Inharmonicity: 3.6 Hz average
```

### Pitch Calibration
```
C4 Piano (reference):      261.63 Hz
C Pull-4 (G-row treble):   262.0 Hz  ✅ Perfect match
C Push-6 (C-row treble):   262.0 Hz  ✅ Perfect match
C-Bass button:             ~65 Hz    (C2, weak fundamental)
                           + 131 Hz  (C3, dominant)
```

---

## 8. Implementation in App

### Treble Synthesis ("Benny Original")
```javascript
// Harmonic amplitudes from real FFT analysis
const real = new Float32Array([
    0, 1.000, 0.182, 0.259, 0.094, 0.129,
    0.034, 0.162, 0.020, 0.016, 0.010
]);
oscillator.setPeriodicWave(audioContext.createPeriodicWave(real, imag));
oscillator.detune.value = 3 + Math.random() * 4;  // Inharmonicity
```

### Bass Synthesis
```javascript
// lowercase (c, g, ab...): single note – root in 2 octaves
[noteToFrequency(root, 2), noteToFrequency(root, 3)]

// UPPERCASE (C, G, Ab...): chord – root in 3 octaves + voicing-specific fifth
// International notation: UPPERCASE = chord, lowercase = single note
const mellowNotes = ['E', 'Eb', 'D'];  // Spectral-verified mellow chords
const fifthOctave = mellowNotes.includes(root) ? 3 : 4;
[
    noteToFrequency(root, 2),
    noteToFrequency(root, 3),
    noteToFrequency(root, 4),
    noteToFrequency(fifth, fifthOctave)
]
```

---

## 9. Version History

| Version | Change |
|---------|--------|
| v5.5 | Benny Original treble sound (FFT-based) |
| v5.6 | Bass octave coupling (L + M voices) |
| v5.6.1 | Correct bass uppercase/lowercase logic |
| v5.6.2 | Authentic bass frequencies (3 octaves + high fifth) |
| v5.6.9 | Bullet-proof stopAll() |
| v5.6.14 | Differentiated chord voicings (mellow/brilliant) |
| v5.6.15 | Spectral verification: only e, eb mellow |
| v5.6.16 | PULL analysis: d also mellow |
| v5.6.17 | Heim system info panel + scale recommendations |
| v5.7.0  | Label convention: Uppercase=Chord, lowercase=Single note (international standard) |
| v5.8.0  | Treble button playback with complete octave mapping |
| v5.8.4  | UI anglified, i18n structure (EN/DE/IT) |

---

## 10. Further Analysis Opportunities

- [ ] PULL chords b, g validated — further PUSH chords (ab, a, bb) could be individually recorded
- [ ] Bass system optimization: shift focus toward G/C as in treble layout
- [ ] Bassregister (Terz-Abschaltung) effect on voicing analysis
- [ ] Comparison with other Castagnari models (Tommy, Sandy)
- [ ] Analysis of Corgeron vs. Heim layout differences in practice

---

**Analysis:** Werner Deuermeier + Claude (Anthropic)  
**Last Updated:** May 2026  
**Instrument:** Castagnari Benny C/G – Heim Standard
