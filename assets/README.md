# 🎨 Assets

Icons, hero images and PWA metadata for the Benny Accordion app.

## Files

### App icon (button-grid)
- `icon.svg` — the app icon: a 4×3 grid of pearl buttons with blue accents, on a dark rounded tile. This is the identity of the app and the favicon. It is **not** a generic piano-accordion symbol — the Benny is a button box, a distinct niche.
- `icon-192.png`, `icon-512.png` — raster exports of `icon.svg` for PWA / home-screen use.
- `favicon-16x16.png`, `favicon-32x32.png` — browser-tab favicons.
- `apple-touch-icon.png` (180×180) — iOS home-screen icon.

### Hero images (README)
- `hero-benny.jpg` — the Castagnari Benny C/G instrument.
- `hero-app.jpg` — the app in the player's-eye layout (👂 it listens along).
- `hero-playersview.jpg` — a player's view of the buttons (🎶 same buttons, same hands).

### Manifest
- `manifest.json` — PWA metadata (name, colours, icons).

## Regenerating the icon rasters

The icon is defined in `icon.svg`. To regenerate the PNGs from it:

```bash
# with rsvg-convert or ImageMagick (SVG → PNG):
rsvg-convert -w 512 -h 512 icon.svg -o icon-512.png
rsvg-convert -w 192 -h 192 icon.svg -o icon-192.png
rsvg-convert -w 180 -h 180 icon.svg -o apple-touch-icon.png
rsvg-convert -w 32  -h 32  icon.svg -o favicon-32x32.png
rsvg-convert -w 16  -h 16  icon.svg -o favicon-16x16.png
```

## Licence

Hero photo of the instrument © the project author. The icon is original artwork for this project.
