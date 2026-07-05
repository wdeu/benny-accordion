# 🚀 Deployment-Checkliste

## ✅ Vor dem Deployment

- [ ] Alle Dateien vorhanden:
  - `benny-accordion.html`
  - `assets/` Ordner mit allen Icons
  - `assets/manifest.json`
  
- [ ] Lokal getestet:
  - Favicon sichtbar im Browser-Tab
  - PWA-Installation funktioniert (Chrome/Edge)
  - Alle Features funktionieren

---

## 📦 GitHub Pages Deployment

### 1. Repository vorbereiten
```bash
cd benny-accordion
git add .
git commit -m "Add PWA icons and manifest"
git push origin main
```

### 2. Ordnerstruktur auf GitHub
```
/
├── index.html              (= benny-accordion.html umbenannt)
├── README.md
├── INSTALLATION.md
└── assets/
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-512.png
    ├── manifest.json
    └── README.md
```

### 3. GitHub Pages aktivieren
1. Repository → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` → Folder: `/root`
4. Save
5. Warte 1-2 Minuten

### 4. Testen
- URL: `https://DEINNAME.github.io/benny-accordion`
- Check: Favicon im Tab
- Check: PWA-Installation (Chrome: Adressleiste → Install-Icon)

---

## 🏠 IONOS Server Deployment

### Option A: Via FTP (FileZilla/Cyberduck)

```bash
# Lokale Struktur:
/benny-accordion/
├── benny-accordion.html
└── assets/

# Hochladen nach:
/htdocs/akkordeon/
├── index.html              (= benny-accordion.html)
└── assets/
```

### Option B: Via Git (empfohlen)

```bash
# 1. IONOS als Remote hinzufügen
git remote add ionos ssh://user@deine-domain.de/~/benny-accordion.git

# 2. Pushen
git push ionos main

# 3. Post-Receive Hook auf IONOS Server:
# ~/benny-accordion.git/hooks/post-receive
#!/bin/bash
GIT_WORK_TREE=/var/www/html/akkordeon git checkout -f
```

### Option C: Via rsync (schnell)

```bash
rsync -avz --delete \
  benny-accordion.html assets/ \
  user@deine-domain.de:/var/www/html/akkordeon/
```

---

## 🧪 Nach Deployment testen

### Favicon
- [ ] Browser-Tab zeigt Benny-Icon
- [ ] Verschiedene Browser testen (Chrome, Safari, Firefox)

### iOS (Safari)
- [ ] "Zum Home-Bildschirm" → Icon sichtbar
- [ ] App startet ohne Safari-UI
- [ ] Side-by-Side im Landscape

### Android (Chrome)
- [ ] "Zum Startbildschirm hinzufügen"
- [ ] PWA installiert sich
- [ ] Icon im App-Drawer

### Desktop PWA
- [ ] Chrome: Adressleiste → Install-Icon
- [ ] Edge: "App installieren"
- [ ] App läuft im eigenen Fenster

---

## 🔄 Updates deployen

### GitHub Pages
```bash
git add .
git commit -m "Update XYZ"
git push origin main
# → Auto-Deploy nach 1-2 Min
```

### IONOS (mit Git Hook)
```bash
git push ionos main
# → Auto-Deploy via post-receive Hook
```

### IONOS (manuell)
```bash
# Via FTP: Alte Dateien löschen, neue hochladen
# ODER via rsync (siehe oben)
```

---

## 📊 Monitoring

### GitHub Pages Status
- Settings → Pages → "Your site is live at..."
- Check: Letzte Deployment-Zeit

### IONOS Logs
```bash
ssh user@deine-domain.de
tail -f /var/log/apache2/access.log
# Oder nginx:
tail -f /var/log/nginx/access.log
```

---

## 🐛 Troubleshooting

### Icons werden nicht angezeigt
1. **Check Browser-Konsole:** F12 → Console → Fehler?
2. **Check Pfade:** `assets/favicon-32x32.png` erreichbar?
3. **Cache leeren:** Strg+Shift+R (Hard Reload)

### PWA installiert sich nicht
1. **HTTPS erforderlich:** HTTP funktioniert nicht (außer localhost)
2. **manifest.json Check:** Öffne direkt im Browser
3. **Service Worker:** Nicht implementiert = basic PWA only

### GitHub Pages 404
1. **Warte 2-3 Minuten** nach Push
2. **Check Settings → Pages:** Status = "Your site is ready"
3. **Check Ordnerstruktur:** `index.html` im Root?

---

## ✅ Deployment erfolgreich!

**GitHub Pages URL:** `https://DEINNAME.github.io/benny-accordion`  
**IONOS URL:** `https://deine-domain.de/akkordeon/`

🎉 Die App ist live und installierbar!
