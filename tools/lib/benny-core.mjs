// Benny C/G (Heim) resolver + fit metric, extracted 1:1 from ../index.html
// (SONG ENGINE block). Spelling of pitch names (Eb/G#/Bb…) is load-bearing:
// SONG_INV keys come from BUTTON_OCTAVES and must match SEMITONE_TO_NOTE.
// Keep in sync with index.html — verified by the parity check in
// analyze-repertoire.mjs --verify / Verifikation 1 of the plan.

export const SEMITONE_TO_NOTE = ['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B'];

export const STEP_SEMI = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };

// Complete button→pitch mapping for all 66 treble buttons
// Anchor: Pull G-row pos 4 = C4 (261.6 Hz)
// 3. Reihe has non-ascending order - that's Heim design, not an error!
export const BUTTON_OCTAVES = {
    'pull_G':    { 1:'E3',  2:'F#3', 3:'A3',  4:'C4',  5:'E4',  6:'F#4',
                   7:'A4',  8:'C5',  9:'E5',  10:'F#5',11:'A5', 12:'C6'  },
    'pull_C':    { 1:'G3',  2:'B3',  3:'D4',  4:'F4',  5:'A4',  6:'B4',
                   7:'D5',  8:'F5',  9:'A5',  10:'B5', 11:'D6'           },
    'pull_Heim': { 1:'Bb3', 2:'C#4', 3:'G4',  4:'G#4', 5:'Bb4', 6:'C#5',
                   7:'G5',  8:'G#5', 9:'Bb5', 10:'C#6'                   },
    'push_G':    { 1:'B2',  2:'D3',  3:'G3',  4:'B3',  5:'D4',  6:'G4',
                   7:'B4',  8:'D5',  9:'G5',  10:'B5', 11:'D6', 12:'G6'  },
    'push_C':    { 1:'E3',  2:'G3',  3:'C4',  4:'E4',  5:'G4',  6:'C5',
                   7:'E5',  8:'G5',  9:'C6',  10:'E6', 11:'G6'           },
    'push_Heim': { 1:'G#3', 2:'A3',  3:'Eb4', 4:'G#4', 5:'A4',  6:'Eb5',
                   7:'G#5', 8:'A5',  9:'Eb6', 10:'G#6'                   },
};

// Inverse map: pitch ('C5') → [{dir,row,pos}, ...]
export const SONG_INV = (() => {
    const inv = {};
    for (const key in BUTTON_OCTAVES) {
        const [d, r] = key.split('_');
        for (const pos in BUTTON_OCTAVES[key]) {
            const p = BUTTON_OCTAVES[key][pos];
            (inv[p] = inv[p] || []).push({ dir: d, row: r, pos: +pos });
        }
    }
    return inv;
})();

// Left-hand chord availability — F & G are both-direction
export const PUSH_CHORDS = new Set(['C','G','Ab','F','E','Eb']);
export const PULL_CHORDS = new Set(['G','D','B','F','A','Bb']);
export const ROW_PRIORITY = { G: 0, C: 1, Heim: 2 };   // default: cross-row, lowest first
export const songPref = { sensFa: 'pull', sensSol: 'push' };  // matches the user's strategy

export function songNormRoot(s) {
    let m = (s || '').match(/^([A-G])([#b]?)/);
    if (!m) return s;
    let root = m[1] + (m[2] || '');
    const flat = { 'Db':'C#','Gb':'F#','Cb':'B','Fb':'E' };
    if (flat[root]) root = flat[root];
    const sharp = { 'A#':'Bb','D#':'Eb','G#':'Ab' };
    if (sharp[root]) root = sharp[root];
    return root;
}

export function songChordDir(chord) {
    const r = songNormRoot(chord);
    const canPush = PUSH_CHORDS.has(r), canPull = PULL_CHORDS.has(r);
    if (canPush && canPull) { if (r==='F') return songPref.sensFa; if (r==='G') return songPref.sensSol; return 'pull'; }
    if (canPull) return 'pull';
    if (canPush) return 'push';
    return null;
}

// Resolve one event → {btnId, dir, row, pos, name, forced} or null.
// (index.html additionally resolves the bass button here; that needs the UI
// layout object and does not affect the fit metric, so it is omitted.)
export function songResolve(ev) {
    const cands = SONG_INV[ev.name];
    if (!cands) return null;
    let want = ev.dir || songChordDir(ev.chord);     // explicit dir overrides chord
    const inWant = want ? cands.filter(c => c.dir === want) : [];
    const pool = inWant.length ? inWant : cands;
    const forced = !ev.dir && want != null && inWant.length === 0;
    const pick = [...pool].sort((a,b)=>ROW_PRIORITY[a.row]-ROW_PRIORITY[b.row])[0];
    return { btnId: pick.dir+'_'+pick.row+'_'+pick.pos, dir: pick.dir, row: pick.row,
             pos: pick.pos, name: ev.name, forced,
             beats: (ev.beats != null ? ev.beats : 1), chord: ev.chord };
}

// Fit analysis over raw events (same counting as loadSongData in index.html:
// forcedPct is computed over RESOLVED notes only — notes without any button are
// silently dropped there). unplayable* additionally surfaces those dropped notes.
export function analyzeEvents(events) {
    const melodic = events.filter(ev => !ev.rest);
    const resolved = melodic.map(ev => songResolve(ev)).filter(Boolean);
    const playable = resolved.length;
    const forced = resolved.filter(r => r.forced).length;
    const forcedPct = playable ? Math.round(100 * forced / playable) : 0;
    const unplayable = melodic.length - playable;
    const unplayablePct = melodic.length ? Math.round(100 * unplayable / melodic.length) : 0;
    let fitEmoji;
    if (forcedPct <= 5)       fitEmoji = '🟢';
    else if (forcedPct <= 15) fitEmoji = '🟡';
    else if (forcedPct <= 30) fitEmoji = '🟠';
    else                      fitEmoji = '🔴';
    return { melodic: melodic.length, playable, forced, forcedPct,
             unplayable, unplayablePct, fitEmoji, resolved };
}
