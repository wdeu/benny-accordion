// MXL = ZIP(DEFLATE). Node port of unzipMxl in ../index.html — same central-
// directory walk, zlib.inflateRawSync instead of DecompressionStream.

import { inflateRawSync } from 'node:zlib';

export function unzipMxl(buffer) {
    const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    // find End-Of-Central-Directory (signature 0x06054b50), scan from the end
    let eocd = -1;
    for (let i = u8.length - 22; i >= 0; i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
    if (eocd < 0) throw new Error('kein gültiges MXL (ZIP) gefunden');
    const cdOffset = dv.getUint32(eocd + 16, true);
    const nEntries = dv.getUint16(eocd + 10, true);
    const entries = {};
    let p = cdOffset;
    for (let n = 0; n < nEntries; n++) {
        if (dv.getUint32(p, true) !== 0x02014b50) break;
        const method = dv.getUint16(p + 10, true);
        const compSize = dv.getUint32(p + 20, true);
        const nameLen = dv.getUint16(p + 28, true);
        const extraLen = dv.getUint16(p + 30, true);
        const commentLen = dv.getUint16(p + 32, true);
        const lho = dv.getUint32(p + 42, true);
        const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nameLen));
        const lNameLen = dv.getUint16(lho + 26, true);
        const lExtraLen = dv.getUint16(lho + 28, true);
        const dataStart = lho + 30 + lNameLen + lExtraLen;
        entries[name] = { method, dataStart, compSize };
        p += 46 + nameLen + extraLen + commentLen;
    }
    const inflate = (ent) => {
        const slice = u8.subarray(ent.dataStart, ent.dataStart + ent.compSize);
        if (ent.method === 0) return new TextDecoder().decode(slice);  // stored
        return inflateRawSync(slice).toString('utf8');
    };
    // pick the root score file via META-INF/container.xml, else first non-META .xml
    let scorePath = null;
    if (entries['META-INF/container.xml']) {
        const cont = inflate(entries['META-INF/container.xml']);
        const m = cont.match(/full-path="([^"]+)"/);
        if (m) scorePath = m[1];
    }
    if (!scorePath || !entries[scorePath])
        scorePath = Object.keys(entries).find(k => !k.startsWith('META-INF') && k.endsWith('.xml'));
    if (!scorePath) throw new Error('keine score.xml im MXL');
    return inflate(entries[scorePath]);
}

// Read an .mxl / .musicxml / .xml file from disk into XML text.
export function readScoreXml(buf, fileName) {
    if (/\.mxl$/i.test(fileName)) return unzipMxl(buf);
    return new TextDecoder().decode(buf);
}
