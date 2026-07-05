#!/usr/bin/env node
// Kurationsrunde über index.json: Dateinamen-Titel säubern, Artist aus dem
// Dateinamen ziehen (mit Akzent-tolerantem Abgleich gegen bekannte Künstler),
// Typ neu raten wo unbekannt. Standard = Dry-Run; schreiben mit --apply.
//
//   node curate-titles.mjs --out ~/Projects/repertoire [--apply]

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { guessType } from './analyze-repertoire.mjs';

const outArg = process.argv.indexOf('--out');
const OUT = path.resolve((outArg > -1 ? process.argv[outArg + 1] : '~/Projects/repertoire')
    .replace(/^~/, os.homedir()));
const APPLY = process.argv.includes('--apply');

// Künstler, deren Namen in Dateinamen (oft ohne Akzente) auftauchen
const KNOWN_ARTISTS = [
    'Jean-Michel Bencetti','Rémi Geffroy','Cyril Brotto','Marc Perrone','Norbert Pignol',
    'Gilles Chabenat','Riccardo Tesi','Patrick Bouffard','Jean Blanchard','Naragonia',
    'Blowzabella','La Machine','Trio Loubelya','Tony Murena','Louis Ferrari','Nino Rota',
    'Jacques Brel','Serge Gainsbourg','Leonard Cohen','Rolf Zuckowski','André Verchuren',
    'Consuelo Velazquez','Franz Schubert','Maurice Ravel','Sineterra','Metallica',
    'Erik Satie','Gabriel Fauré','Johann Sebastian Bach','Philip Glass','Kate Bush',
    'Édith Piaf','Georg Friedrich Händel','Ludwig van Beethoven','Edward Elgar',
    'Yann Tiersen','Georges Moustaki','Stevie Wonder','Ennio Morricone','John Williams',
];

// Segmente, die sicher KEIN Artist und KEIN Titelbestandteil sind
const JUNK = /^(midi|mid|mp3|v\d+|[a-g][b#]?(m|maj|min)?|[a-g]maj|acc(ordeon|ordon|ordion)?|diato(nique|nic)?( accordion)?|diatonic accordion|accordion|piano|easy( piano)?|lead ?sheet.*|tab(lature)?.*|solo|duo|trio|arr(angement)?|score|partition|versi?o[in]n?|final|kopie|copy|org?inal|ttb|a ?cappella|chant|with lyrics|lyrics|swing|trad\.?|mscz\d*|ausmidi|for .*|pour .*)$/i;

const deAccent = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const loose = s => deAccent(s).toLowerCase().replace(/[^a-z0-9]/g, '');
// Dateinamen haben Nicht-ASCII oft schlicht VERLOREN ("Rmi" = "Rémi"):
const lossy = s => s.replace(/[^\x00-\x7F]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const artistIndex = new Map();
for (const a of KNOWN_ARTISTS) {
    artistIndex.set(loose(a), a); artistIndex.set(lossy(a), a);
    const surname = a.split(' ').pop();                      // "Satie", "Schubert", …
    if (surname.length >= 4 && surname !== a) artistIndex.set(loose(surname), a);
}
const findArtist = seg => artistIndex.get(loose(seg)) || artistIndex.get(lossy(seg));

const tidy = s => s.replace(/_/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/^(.)/, c => c.toUpperCase());

function curate(p) {
    const change = {};
    const base = path.basename(p.source).replace(/\.(mxl|musicxml|xml|mscz)$/i, '');
    const segs = base.split(/__+|_-_|\s-\s/).map(tidy).filter(Boolean);

    // "Komponist zuerst"-Dateinamen (Erik_Satie_-_Gymnopedie): Artist = Segment 1,
    // Titel kommt dann aus Segment 2
    let titleSeg = 0;
    if (segs.length >= 2 && findArtist(segs[0]) && !JUNK.test(segs[1])) {
        titleSeg = 1;
        if (!p.artist || p.artist === '?') change.artist = findArtist(segs[0]);
    }

    // Artist: aus Dateinamen-Segmenten (bekannter Künstler oder plausibler Name)
    if (!change.artist && (!p.artist || p.artist === '?')) {
        for (let seg of segs.slice(1)) {
            const hit = findArtist(seg);
            if (hit) { change.artist = hit; break; }
            const w = seg.split(' ');                       // Junk-Wörter hinten abwerfen
            while (w.length && JUNK.test(w[w.length - 1])) w.pop();
            seg = w.join(' ');
            if (w.length >= 2 && /^[A-ZÀ-Ž][a-zà-ž.']+( [A-ZÀ-Ž][a-zà-ž.']+)+$/.test(seg)
                && !JUNK.test(seg) && !/accord|diato/i.test(seg)) {
                change.artist = seg; break;
            }
        }
    }

    // Titel: nur anfassen, wenn er wirklich noch ein Dateiname ist (Unterstriche) —
    // sonst würden gute XML-Titel durch akzentlose Dateinamen ersetzt
    if (/_/.test(p.title)) {
        let t = segs[titleSeg] || tidy(base);
        t = t.replace(/\s(for|pour)\s.*$/i, '');            // "… for Flute and Piano" weg
        // Junk-Anhängsel am Ende abschneiden ("... Am V1")
        const words = t.split(' ');
        while (words.length > 2 && JUNK.test(words[words.length - 1])) words.pop();
        t = words.join(' ');
        if (t && t !== p.title) change.title = t;
    }

    // Typ neu raten, wo unbekannt (auf Basis des ggf. gesäuberten Titels)
    if (!p.type || p.type === '?' || p.type.endsWith('?')) {
        const guessed = guessType((change.title || p.title) + ' ' + base, p.meter);
        if (guessed !== '?' && guessed !== p.type) change.type = guessed;
    }
    return change;
}

const indexPath = path.join(OUT, 'index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
let nT = 0, nA = 0, nY = 0;
for (const p of index.pieces) {
    const c = curate(p);
    if (!Object.keys(c).length) continue;
    const parts = [];
    if (c.title)  { parts.push(`Titel: "${p.title}" → "${c.title}"`); nT++; }
    if (c.artist) { parts.push(`Artist: → "${c.artist}"`); nA++; }
    if (c.type)   { parts.push(`Typ: "${p.type}" → "${c.type}"`); nY++; }
    console.log((APPLY ? '✓ ' : '· ') + p.id + '\n    ' + parts.join(' · '));
    if (APPLY) Object.assign(p, c);
}
console.log(`\n→ ${nT} Titel, ${nA} Artists, ${nY} Typen ${APPLY ? 'geändert' : 'würden geändert (Dry-Run — mit --apply schreiben)'}`);
if (APPLY) fs.writeFileSync(indexPath, JSON.stringify(index, null, 1));
