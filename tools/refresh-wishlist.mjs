#!/usr/bin/env node
// Regeneriert repertoire/_wunschliste.md: welche JMiB-Referenz-Stücke aus
// REP_DATA (../index.html) fehlen noch im Repertoire-Index? Teilstring-Abgleich,
// weil aus MusicXML gelesene Titel oft kürzer sind als der Referenz-Titel
// (z.B. "Noirs Moutons" vs. "Noirs-Moutons (Branle de Noirmoutier)").
//
//   node refresh-wishlist.mjs [--out ~/Projects/repertoire]
//
// Nutzt import.meta.url statt process.cwd() für den Pfad zu ../index.html —
// funktioniert deshalb unabhängig davon, aus welchem Verzeichnis heraus
// aufgerufen wird (genau das Problem, das --src/-out-Tippfehler früher hatten).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const outIdx = args.indexOf('--out');
const OUT = path.resolve((outIdx > -1 ? args[outIdx + 1] : '~/Projects/repertoire')
    .replace(/^~/, os.homedir()));

const htmlPath = fileURLToPath(new URL('../index.html', import.meta.url));
const html = fs.readFileSync(htmlPath, 'utf8');
const rep = JSON.parse(html.match(/const REP_DATA=(\[\[.*?\]\]);/s)[1]);
const idx = JSON.parse(fs.readFileSync(path.join(OUT, 'index.json'), 'utf8'));

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const haveList = idx.pieces.map(p => norm(p.title));
const matches = r => { const n = norm(r[0]); return haveList.some(h => h.includes(n) || n.includes(h)); };

const jmib = rep.filter(r => r[3] === 'J.-M. Bencetti');
const want = jmib.filter(r => !matches(r));
const got = jmib.filter(r => matches(r));

let md = '# Wunschliste: JMiB-Stücke (Jean-Michel Bencetti)\n\n';
md += 'Quelle: https://musescore.com/jmib (manuell herunterladen, Login nötig — Format "MusicXML" wählen)\n';
md += 'Alternativ: https://www.partitions-accordeon.com/user/partitions/29600\n';
md += 'Heruntergeladene .mxl nach ~/Projects/partituren/ legen, dann Pipeline-Lauf — sie werden automatisch erfasst.\n\n';
md += '## Noch fehlend (' + want.length + ')\n\n';
md += want.length
    ? want.map(r => '- [ ] ' + r[0] + ' (' + r[1] + ', Referenz-Eignung ' + r[2] + ')').join('\n') + '\n'
    : '*(keine — alle Referenz-Stücke von JMiB sind im Repertoire)*\n';
md += '\n## Schon im Repertoire (' + got.length + ')\n\n';
md += got.map(r => '- [x] ' + r[0]).join('\n') + '\n';

fs.writeFileSync(path.join(OUT, '_wunschliste.md'), md);
console.log(`→ Wunschliste aktualisiert: ${want.length} fehlend, ${got.length} vorhanden`);
