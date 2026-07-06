#!/usr/bin/env node
// Diato-Repertoire-Pipeline: scannt MusicXML-Quellen, berechnet Benny-Fit
// (Balg-Belastung) + Schwierigkeit, kopiert nach <out>/files/ und pflegt
// <out>/index.json (merge — kuratierte Felder bleiben erhalten).
//
//   node analyze-repertoire.mjs --src ~/Projects/partituren --out ~/Projects/repertoire \
//        [--convert] [--fetch-jmib] [--force] [--only "Bourr*"] [--prune] \
//        [--sync ~/Projects/benny-accordion/repertoire]
//
// --prune ist standardmäßig AUS: Index-Einträge, deren Quelldatei unter --src
// nicht mehr existiert (z.B. weil --src zur Duplikat-Verringerung geleert wurde),
// bleiben ohne --prune erhalten. Nur mit --prune werden sie aus dem Index entfernt.
//
// Publish-Kuration ohne JSON-Editieren (Muster matcht id, Titel oder Artist):
//   node analyze-repertoire.mjs --out ~/Projects/repertoire --publish "Il Pleut" \
//        [--sync ~/Projects/benny-accordion/repertoire]
//   node analyze-repertoire.mjs --out ~/Projects/repertoire --unpublish "*"
//   node analyze-repertoire.mjs --out ~/Projects/repertoire --list

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { DOMParser } from 'linkedom';
import { readScoreXml } from './lib/mxl.mjs';
import { musicXmlToEvents } from './lib/musicxml-events.mjs';
import { analyzeEvents, SONG_INV } from './lib/benny-core.mjs';

const MSCORE = '/Applications/MuseScore 4.app/Contents/MacOS/mscore';
const JMIB_BASE = 'http://jmi.ovh/DiatonicTab/';

// ── Schwierigkeits-Tuning (Punkte; Tier-Grenzen s.u.) ───────────────────────
// score = forcedPct + 2·unplayablePct + Dichte-Malus + Reihenwechsel-Malus
const DENSITY_FREE = 4;      // Noten/Sekunde, die noch keinen Malus geben
const DENSITY_WEIGHT = 5;    // Punkte pro Note/Sek. darüber
const CROSS_WEIGHT = 10;     // Punkte bei 100% Reihenwechseln (linear)
const TIER_EASY = 10, TIER_MEDIUM = 25;   // <10 leicht, <25 mittel, sonst schwer

export const TYPE_PATTERNS = [
    [/bourr.e.*3|3.*temps.*bourr/i, 'Bourrée 3t'],
    [/bourr/i, 'Bourrée 2t'],
    [/mazur/i, 'Mazurka'],
    [/scottish|schottisch/i, 'Scottish'],
    [/valse|waltz|walzer/i, 'Walzer'],
    [/polka/i, 'Polka'],
    [/cercle|chapelloise/i, 'Cercle/Chapelloise'],
    [/an ?dro|andro/i, 'An Dro'],
    [/hanter/i, 'Hanter Dro'],
    [/gavott?e/i, 'Gavotte'],
    [/rond(eau|e| de)/i, 'Rondeau'],
    [/branle/i, 'Branle'],
    [/tango/i, 'Tango'],
    [/musette/i, 'Musette'],
    [/marche?/i, 'Marsch'],
    [/menuet/i, 'Menuett'],
    [/jig|gigue/i, 'Jig'],
    [/reel/i, 'Reel'],
];

function args() {
    const a = process.argv.slice(2), o = { convert:false, fetchJmib:false, force:false,
        src:null, out:null, only:null, sync:null, publish:null, unpublish:null, list:false, prune:false };
    for (let i = 0; i < a.length; i++) {
        if (a[i] === '--convert') o.convert = true;
        else if (a[i] === '--fetch-jmib') o.fetchJmib = true;
        else if (a[i] === '--force') o.force = true;
        else if (a[i] === '--list') o.list = true;
        else if (a[i] === '--prune') o.prune = true;
        else if (a[i] === '--src') o.src = a[++i];
        else if (a[i] === '--out') o.out = a[++i];
        else if (a[i] === '--only') o.only = a[++i];
        else if (a[i] === '--sync') o.sync = a[++i];
        else if (a[i] === '--publish') o.publish = a[++i];
        else if (a[i] === '--unpublish') o.unpublish = a[++i];
        else { console.error('Unbekanntes Argument: ' + a[i]); process.exit(1); }
    }
    o.publishMode = !!(o.publish || o.unpublish || o.list);
    if (!o.out || (!o.src && !o.publishMode)) {
        console.error(o.publishMode ? '--out ist Pflicht' : '--src und --out sind Pflicht');
        process.exit(1);
    }
    for (const k of ['src','out','sync']) if (o[k]) o[k] = path.resolve(o[k].replace(/^~/, os.homedir()));
    return o;
}

const globToRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');

const walk = (dir, ext) => {
    const hits = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.name.startsWith('.')) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) hits.push(...walk(p, ext));
        else if (ext.test(e.name)) hits.push(p);
    }
    return hits;
};

const slugify = name => name.normalize('NFC')
    .replace(/\.(mxl|musicxml|xml)$/i, '')
    .replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_.\-]/gu, '')
    .replace(/_+/g, '_').replace(/^_|_$/g, '') || 'stueck';

const sha1 = buf => crypto.createHash('sha1').update(buf).digest('hex');

export function guessType(title, meter) {
    for (const [re, t] of TYPE_PATTERNS) if (re.test(title)) return t;
    if (meter === '3/8') return 'Bourrée 3t?';
    return '?';
}

// Benny-Tonumfang aus der Knopfbelegung (tiefster/höchster erreichbarer Ton)
const BENNY_RANGE = (() => {
    const midis = Object.keys(SONG_INV).map(n => {
        const m = n.match(/^([A-G][#b]?)(\d)$/);
        const semi = { C:0,'C#':1,D:2,Eb:3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,Bb:10,B:11 }[m[1]];
        return (parseInt(m[2]) + 1) * 12 + semi;
    });
    return { min: Math.min(...midis), max: Math.max(...midis) };
})();

function difficulty(a, mx) {
    const totalBeats = mx.events.reduce((s, e) => s + (e.beats || 0), 0);
    const seconds = totalBeats * 60 / (mx.bpm || 80);
    const notesPerSec = seconds > 0 ? a.melodic / seconds : 0;
    let crossings = 0;
    for (let i = 1; i < a.resolved.length; i++)
        if (a.resolved[i].row !== a.resolved[i-1].row) crossings++;
    const crossFrac = a.resolved.length > 1 ? crossings / (a.resolved.length - 1) : 0;
    const score = a.forcedPct + 2 * a.unplayablePct
        + DENSITY_WEIGHT * Math.max(0, notesPerSec - DENSITY_FREE)
        + CROSS_WEIGHT * crossFrac;
    const tier = score < TIER_EASY ? 'leicht' : score < TIER_MEDIUM ? 'mittel' : 'schwer';
    return { tier, score: Math.round(score * 10) / 10,
             notesPerSec: Math.round(notesPerSec * 100) / 100,
             rowCrossPct: Math.round(100 * crossFrac) };
}

function fetchJmib(srcDir) {
    const dir = path.join(srcDir, 'jmib');
    fs.mkdirSync(dir, { recursive: true });
    console.log('→ JMiB-Banque: hole Liste von ' + JMIB_BASE + 'partoches.php');
    const html = execFileSync('curl', ['-fsSL', JMIB_BASE + 'partoches.php'], { encoding: 'utf8' });
    const links = [...html.matchAll(/["'](?:\.\/)?(partitions\/[^"']+\.mscz)["']/gi)]
        .map(m => m[1]);
    const unique = [...new Set(links)];
    let got = 0, skipped = 0;
    for (const rel of unique) {
        const fname = decodeURIComponent(rel.split('/').pop());
        const dest = path.join(dir, fname);
        if (fs.existsSync(dest)) { skipped++; continue; }
        try {
            execFileSync('curl', ['-fsSL', '-o', dest, JMIB_BASE + rel]);
            got++;
            console.log('  ✓ ' + fname);
        } catch (e) {
            console.log('  ✗ ' + fname + ' — Download fehlgeschlagen');
        }
    }
    console.log(`→ JMiB: ${got} neu, ${skipped} schon vorhanden (${dir})`);
}

function convertMscz(srcDir) {
    const mxlBases = new Set(walk(srcDir, /\.mxl$/i).map(p => slugify(path.basename(p))));
    const convDir = path.join(srcDir, 'converted');
    fs.mkdirSync(convDir, { recursive: true });
    const jobs = [];
    for (const mscz of walk(srcDir, /\.mscz$/i)) {
        const base = slugify(path.basename(mscz).replace(/\.mscz$/i, ''));
        const dest = path.join(convDir, base + '.mxl');
        if (mxlBases.has(base) || fs.existsSync(dest)) continue;
        jobs.push({ in: mscz, out: dest });
    }
    if (!jobs.length) { console.log('→ Konvertierung: nichts zu tun'); return; }
    const jobFile = path.join(os.tmpdir(), 'benny-mscore-job.json');
    fs.writeFileSync(jobFile, JSON.stringify(jobs, null, 1));
    console.log(`→ Konvertiere ${jobs.length} .mscz → .mxl (MuseScore CLI, ein Lauf) …`);
    try {
        execFileSync(MSCORE, ['-j', jobFile], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 1000 * 60 * 30 });
    } catch (e) {
        // mscore exits non-zero if any single job failed — count what arrived
        console.log('  (MuseScore meldete Fehler bei einzelnen Dateien — weiter mit dem Rest)');
    }
    const ok = jobs.filter(j => fs.existsSync(j.out)).length;
    console.log(`→ Konvertierung: ${ok}/${jobs.length} erfolgreich (${convDir})`);
    const failed = jobs.filter(j => !fs.existsSync(j.out));
    if (failed.length) console.log('  Fehlgeschlagen: ' + failed.map(j => path.basename(j.in)).join(', '));
}

// --publish/--unpublish/--list: Flags im Index setzen, ohne neu zu analysieren
function publishMode(opt) {
    const indexPath = path.join(opt.out, 'index.json');
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    for (const [pattern, val] of [[opt.publish, true], [opt.unpublish, false]]) {
        if (!pattern) continue;
        const re = globToRe(pattern);
        const hits = index.pieces.filter(p =>
            re.test(p.id) || re.test(p.title) || re.test(p.artist) || re.test(p.source || ''));
        for (const p of hits) p.publish = val;
        console.log((val ? '→ publish: ' : '→ unpublish: ') + hits.length + ' Stück(e)'
            + (hits.length ? ' — ' + hits.map(p => p.title).join(', ') : ''));
        if (!hits.length) console.log('   (Muster matcht id, Titel oder Artist; * und ? erlaubt)');
    }
    if (opt.publish || opt.unpublish) fs.writeFileSync(indexPath, JSON.stringify(index, null, 1));
    const pub = index.pieces.filter(p => p.publish);
    console.log(`→ veröffentlicht: ${pub.length}/${index.pieces.length}`
        + (opt.list && pub.length ? '\n' + pub.map(p => '   🌐 ' + p.title + ' (' + p.artist + ')').join('\n') : ''));
    if (opt.sync) syncPublish(opt.out, opt.sync, index);
}

function main() {
    const opt = args();
    if (opt.publishMode) { publishMode(opt); return; }

    if (!fs.existsSync(opt.src)) {
        console.error('❌ Quellordner nicht gefunden: ' + opt.src);
        console.error('   (falscher Pfad, oder Ordner umbenannt/verschoben?)');
        process.exit(1);
    }

    // Netzwerk-Hänger bei jmi.ovh dürfen den lokalen Scan nie verhindern —
    // ohne dieses try/catch würde ein DNS-/Timeout-Fehler main() komplett
    // abbrechen, bevor auch nur eine lokale Datei analysiert wurde.
    if (opt.fetchJmib) {
        try { fetchJmib(opt.src); }
        catch (e) { console.log('⚠ JMiB-Abruf fehlgeschlagen (' + (e.message || e).split('\n')[0] + ') — fahre mit lokalem Scan fort'); }
    }
    if (opt.convert) convertMscz(opt.src);

    const filesDir = path.join(opt.out, 'files');
    fs.mkdirSync(filesDir, { recursive: true });
    const indexPath = path.join(opt.out, 'index.json');
    const prev = fs.existsSync(indexPath) ? JSON.parse(fs.readFileSync(indexPath, 'utf8')) : { pieces: [] };
    const prevById = new Map(prev.pieces.map(p => [p.id, p]));

    // scan: alle .mxl/.musicxml unter --src; bei gleichem Slug gewinnt partituren/mxl/
    let sources = walk(opt.src, /\.(mxl|musicxml)$/i);
    if (opt.only) {
        const re = globToRe(opt.only);
        sources = sources.filter(p => re.test(path.basename(p)));
    }
    const bySlug = new Map();
    for (const p of sources) {
        const slug = slugify(path.basename(p));
        const cur = bySlug.get(slug);
        const inMxlDir = path.dirname(p).endsWith(path.sep + 'mxl');
        if (!cur || (inMxlDir && !cur.inMxlDir)) bySlug.set(slug, { path: p, inMxlDir });
        else console.log('  (Duplikat übersprungen: ' + path.relative(opt.src, p) + ')');
    }

    const now = new Date().toISOString();
    const report = { analyzed: [], skipped: [], rejected: [] };
    const pieces = [];

    for (const [slug, { path: srcPath }] of [...bySlug.entries()].sort()) {
        const buf = fs.readFileSync(srcPath);
        const hash = sha1(buf);
        const old = prevById.get(slug);
        if (old && old.sourceSha1 === hash && !opt.force) {
            pieces.push(old);
            report.skipped.push(slug);
            continue;
        }
        try {
            const xml = readScoreXml(buf, path.basename(srcPath));
            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const mx = musicXmlToEvents(doc, path.basename(srcPath));
            const a = analyzeEvents(mx.events);
            const d = difficulty(a, mx);
            const ext = path.extname(srcPath).toLowerCase();
            const fileRel = 'files/' + slug + ext;
            fs.copyFileSync(srcPath, path.join(opt.out, fileRel));
            const computedType = guessType(mx.title + ' ' + path.basename(srcPath), mx.meter);
            const entry = {
                id: slug,
                file: fileRel,
                title: mx.title,
                // kuratierte Felder überleben Re-Analyse:
                artist: (old?.artist) || mx.composer || '?',
                type: (old && old.type && old.type !== '?') ? old.type : computedType,
                key: mx.key || '?', meter: mx.meter || '?', bpm: mx.bpm,
                measures: mx.measures, notes: a.melodic,
                bellowsLoadPct: a.forcedPct, unplayablePct: a.unplayablePct,
                fit: a.fitEmoji,
                difficulty: d.tier, difficultyScore: d.score,
                notesPerSec: d.notesPerSec, rowCrossPct: d.rowCrossPct,
                bassSource: mx.bassSource, hasChordSymbols: mx.hasChordSymbols,
                uebestatus: old?.uebestatus || 'neu',
                publish: old?.publish ?? false,
                source: path.relative(opt.src, srcPath), sourceSha1: hash,
                addedAt: old?.addedAt || now, analyzedAt: now,
            };
            pieces.push(entry);
            report.analyzed.push(slug + ' ' + a.fitEmoji + ' ' + a.forcedPct + '%'
                + (a.unplayablePct ? ' (' + a.unplayablePct + '% unspielbar)' : ''));
        } catch (e) {
            report.rejected.push(slug + ' — ' + (e.message || e));
        }
    }

    // Nicht gescannte Index-Einträge bleiben standardmäßig erhalten — auch wenn
    // --src (teilweise) geleert wurde, um Duplikate zu reduzieren: repertoire/files/
    // enthält bereits unabhängige Kopien, der Index braucht das Original danach
    // nicht mehr. Löschen wegen fehlender Quelle nur mit explizitem --prune.
    const scanned = new Set([...bySlug.keys()]);
    for (const old of prev.pieces) {
        if (scanned.has(old.id)) continue;
        const missing = opt.prune && !opt.only && !fs.existsSync(path.join(opt.src, old.source));
        if (missing) console.log('  (entfernt, Quelle fehlt: ' + old.id + ')');
        else pieces.push(old);
    }

    pieces.sort((x, y) => x.id.localeCompare(y.id));
    const index = {
        version: 1, generated: now,
        instrument: 'Castagnari Benny C/G (Heim)',
        pieces,
    };
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 1));

    console.log(`\n→ ${pieces.length} Stücke im Index (${report.analyzed.length} analysiert, `
        + `${report.skipped.length} unverändert, ${report.rejected.length} abgelehnt)`);
    if (report.analyzed.length) {
        const tiers = { leicht: 0, mittel: 0, schwer: 0 };
        for (const p of pieces) tiers[p.difficulty] = (tiers[p.difficulty] || 0) + 1;
        console.log('   Schwierigkeit gesamt: ' + Object.entries(tiers).map(([k,v]) => `${k} ${v}`).join(' · '));
    }
    if (report.rejected.length) {
        console.log('\nAbgelehnt (nicht kopiert):');
        for (const r of report.rejected) console.log('  ✗ ' + r);
    }
    fs.writeFileSync(path.join(opt.out, '_lauf-report.md'),
        `# Analyse-Lauf ${now}\n\n## Analysiert (${report.analyzed.length})\n`
        + report.analyzed.map(s => '- ' + s).join('\n')
        + `\n\n## Unverändert (${report.skipped.length})\n`
        + report.skipped.map(s => '- ' + s).join('\n')
        + `\n\n## Abgelehnt (${report.rejected.length})\n`
        + report.rejected.map(s => '- ' + s).join('\n') + '\n');

    if (opt.sync) syncPublish(opt.out, opt.sync, index);
}

// --sync: nur publish:true Stücke (gefilterte index.json + Dateien) ins App-Repo
function syncPublish(outDir, syncDir, index) {
    const pub = index.pieces.filter(p => p.publish === true);
    fs.mkdirSync(path.join(syncDir, 'files'), { recursive: true });
    const wanted = new Set(pub.map(p => p.file));
    for (const p of pub)
        fs.copyFileSync(path.join(outDir, p.file), path.join(syncDir, p.file));
    // Dateien entfernen, die nicht (mehr) freigegeben sind — nur innerhalb files/
    for (const f of fs.readdirSync(path.join(syncDir, 'files')))
        if (!wanted.has('files/' + f)) fs.unlinkSync(path.join(syncDir, 'files', f));
    fs.writeFileSync(path.join(syncDir, 'index.json'),
        JSON.stringify({ ...index, pieces: pub }, null, 1));
    console.log(`\n→ Sync: ${pub.length} freigegebene Stücke → ${syncDir}`);
    console.log('   (git add/commit/push im App-Repo nicht vergessen)');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
