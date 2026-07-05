// MusicXML → event list, ported from importMusicXML in ../index.html
// (same melody/chord/bass extraction so the fit metric matches the app exactly).
// Takes a DOM Document (linkedom in Node, native DOMParser in the browser).
// Additionally extracts key and meter from the first measure — the app ignores
// these, the repertoire manifest wants them.

import { SEMITONE_TO_NOTE, STEP_SEMI } from './benny-core.mjs';

const MAJOR_KEYS = ['Cb','Gb','Db','Ab','Eb','Bb','F','C','G','D','A','E','B','F#','C#'];
const MINOR_KEYS = ['Abm','Ebm','Bbm','Fm','Cm','Gm','Dm','Am','Em','Bm','F#m','C#m','G#m','D#m','A#m'];

export function musicXmlToEvents(doc, fileName = '') {
    if (doc.querySelector('parsererror')) throw new Error('XML nicht lesbar');
    const parts = [...doc.querySelectorAll('part')];
    if (!parts.length) throw new Error('keine <part> in der Partitur');

    const title = (doc.querySelector('work-title')?.textContent
                || doc.querySelector('movement-title')?.textContent
                || fileName.replace(/\.(mxl|xml|musicxml)$/i, '')).trim();
    const composer = (doc.querySelector('identification creator[type="composer"]')?.textContent
                   || doc.querySelector('identification creator')?.textContent || '').trim();

    const isTabPart = p => p.querySelector('staff-details > staff-lines')?.textContent === '1';
    const partMeasures = parts.map(p => [...p.querySelectorAll('measure')]);

    // melody part = first part with pitched staff-1 notes that isn't a 1-line tab staff
    let melodyIdx = 0;
    for (let p = 0; p < parts.length; p++) {
        if (parts[p].querySelector('note > pitch') && !isTabPart(parts[p])) { melodyIdx = p; break; }
    }

    let divisions = 1, tempo = null, curChord = '?';
    const events = [];
    const measureFirstIdx = [];   // index in events[] of each measure's first element
    const nMeas = partMeasures[melodyIdx].length;

    // key + meter from the first measure that declares them
    let key = null, meter = null;
    for (const meas of partMeasures[melodyIdx]) {
        if (key === null) {
            const f = meas.querySelector('attributes > key > fifths');
            if (f) {
                const fifths = Math.max(-7, Math.min(7, +f.textContent || 0));
                const mode = meas.querySelector('attributes > key > mode')?.textContent || 'major';
                key = (mode === 'minor' ? MINOR_KEYS : MAJOR_KEYS)[fifths + 7];
            }
        }
        if (meter === null) {
            const b = meas.querySelector('attributes > time > beats');
            const bt = meas.querySelector('attributes > time > beat-type');
            if (b && bt) meter = b.textContent + '/' + bt.textContent;
        }
        if (key !== null && meter !== null) break;
    }

    // ── melody (staff 1 of the melody part) ──
    partMeasures[melodyIdx].forEach((meas, mi) => {
        const dv = meas.querySelector('attributes > divisions');
        if (dv) divisions = +dv.textContent || divisions;
        const snd = meas.querySelector('sound[tempo]');
        if (snd && !tempo) tempo = +snd.getAttribute('tempo');
        measureFirstIdx[mi] = events.length;

        [...meas.childNodes].forEach(node => {
            if (node.nodeType !== 1) return;
            if (node.tagName === 'harmony') {
                const rs = node.querySelector('root-step')?.textContent;
                const ra = node.querySelector('root-alter')?.textContent;
                if (rs) curChord = rs + (ra ? (+ra < 0 ? 'b' : '#') : '');
            } else if (node.tagName === 'note') {
                if (node.querySelector('staff')?.textContent === '2') return;  // melody = staff 1
                const dur = +(node.querySelector('duration')?.textContent || 0);
                const beats = dur / divisions;
                if (node.querySelector('rest')) { if (beats > 0) events.push({ rest:true, beats }); return; }
                if (node.querySelector('chord')) return;        // top line of a chord stack
                const step = node.querySelector('pitch > step')?.textContent;
                if (!step) return;
                const oct = +node.querySelector('pitch > octave').textContent;
                const alt = +(node.querySelector('pitch > alter')?.textContent || 0);
                const midi = (oct + 1) * 12 + STEP_SEMI[step] + alt;
                const name = SEMITONE_TO_NOTE[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
                events.push({ name, chord: curChord, beats });
            }
        });
    });

    // ── per-measure bass root: prefer the chord symbol at the downbeat,
    //    fall back to the lowest accompaniment note (same as the app) ──
    let bassFromChords = false, bassFromStaff = false;
    for (let mi = 0; mi < nMeas; mi++) {
        const end = (mi + 1 < nMeas) ? measureFirstIdx[mi + 1] : events.length;
        let firstEv = null;
        for (let i = measureFirstIdx[mi]; i < end; i++) {
            if (!events[i].rest) { firstEv = events[i]; break; }
        }
        if (!firstEv) continue;

        let root = null;
        if (firstEv.chord && firstEv.chord !== '?') {
            root = firstEv.chord;
            bassFromChords = true;
        } else {
            let lowMidi = Infinity, lowName = null;
            for (let p = 0; p < parts.length; p++) {
                const meas = partMeasures[p][mi];
                if (!meas || isTabPart(parts[p])) continue;
                [...meas.querySelectorAll('note')].forEach(node => {
                    const staff = node.querySelector('staff')?.textContent;
                    const isAccomp = (staff === '2') || (p !== melodyIdx);
                    if (!isAccomp || node.querySelector('rest') || !node.querySelector('pitch')) return;
                    const step = node.querySelector('pitch > step').textContent;
                    const oct = +node.querySelector('pitch > octave').textContent;
                    const alt = +(node.querySelector('pitch > alter')?.textContent || 0);
                    const midi = (oct + 1) * 12 + STEP_SEMI[step] + alt;
                    if (midi < lowMidi) { lowMidi = midi; lowName = SEMITONE_TO_NOTE[((midi % 12) + 12) % 12]; }
                });
            }
            if (lowName) { root = lowName; bassFromStaff = true; }
        }
        if (root != null) firstEv.bassRoot = root;
    }

    const bassSource = bassFromChords ? 'Akkorde' : (bassFromStaff ? 'Notenzeile' : '—');

    const melodic = events.filter(e => !e.rest).length;
    if (!melodic) throw new Error('keine spielbaren Noten gefunden');
    let bpm = tempo ? Math.round(tempo) : 80;
    bpm = Math.max(40, Math.min(200, bpm));

    return { title, composer, bpm, events, measures: nMeas, bassSource, key, meter,
             hasChordSymbols: bassFromChords };
}
