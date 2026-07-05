# 🎨 Assets

Dieser Ordner enthält alle Icons und Metadaten für die Benny Accordion Web-App.

## 📁 Dateien

### Favicons (Browser-Tabs)
- `favicon-16x16.png` – Kleines Favicon (ältere Browser)
- `favicon-32x32.png` – Standard Favicon (moderne Browser)

### iOS / Apple
- `apple-touch-icon.png` (180×180) – Home-Screen Icon auf iPhone/iPad

### PWA Icons (Progressive Web App)
- `icon-192.png` (192×192) – Android Home-Screen, kleine Geräte
- `icon-512.png` (512×512) – Android Splash-Screen, große Geräte

### Manifest
- `manifest.json` – PWA-Metadaten (Name, Farben, Icons)

## 🖼️ Quelle

Alle Icons wurden generiert aus **Benny.png** (Castagnari Benny Akkordeon).

## 🚀 Deployment

### GitHub Pages
```bash
# Ordnerstruktur:
/
├── benny-accordion.html
└── assets/
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-512.png
    └── manifest.json
```

### IONOS Server
```bash
# Via FTP/SFTP hochladen:
/htdocs/
├── benny-accordion.html
└── assets/
    └── [alle Dateien]
```

## ✅ Testen

### Favicon
1. Öffne `benny-accordion.html` im Browser
2. Schaue auf den Tab → Benny-Icon sollte sichtbar sein

### iOS Home-Screen
1. Öffne auf iPhone in Safari
2. "Teilen" → "Zum Home-Bildschirm"
3. → Benny-Icon wird angezeigt

### PWA (Android)
1. Öffne auf Android in Chrome
2. "Zum Startbildschirm hinzufügen"
3. → Benny-Icon wird angezeigt

## 🔄 Icons neu generieren

Wenn du das Benny.png änderst:

```bash
# Mit ImageMagick:
convert Benny.png -resize 32x32 favicon-32x32.png
convert Benny.png -resize 16x16 favicon-16x16.png
convert Benny.png -resize 180x180 apple-touch-icon.png
convert Benny.png -resize 192x192 icon-192.png
convert Benny.png -resize 512x512 icon-512.png
```

## 📝 Lizenz

Benny.png © Castagnari – verwendet mit Genehmigung für dieses Projekt.
