# Portfolio – Helin Coskun

## So bringst du die Seite mit GitHub Pages online

1. Erstelle auf GitHub ein neues Repository, z. B. `portfolio` (öffentlich).
2. Lade `index.html`, `style.css`, `script.js` und den Ordner `assets/` in das Repository hoch (per Drag & Drop im Browser über "Add file" → "Upload files", oder per Git).
3. Gehe im Repository auf **Settings** → **Pages**.
4. Wähle bei "Source" den Branch `main` und Ordner `/ (root)`, dann **Save**.
5. Nach ein bis zwei Minuten ist die Seite unter `https://<dein-github-name>.github.io/portfolio/` erreichbar.

## Foto & Arbeiten einfügen

- Foto: Bilddatei in `assets/` legen (z. B. `foto.jpg`), dann in `index.html` im Bereich `<div class="photo-frame" id="profile-photo">` den Platzhaltertext durch `<img src="assets/foto.jpg" alt="Helin Coskun">` ersetzen.
- Arbeiten: Für jede Arbeit den Platzhaltertext in `.work-thumb` durch `<img src="assets/dein-bild.jpg" alt="Projektname">` ersetzen und Titel/Beschreibung in der jeweiligen `<article class="work-card">` anpassen.

Schick mir gern deine Bilder direkt im Chat — ich baue sie dann ein und du musst nur noch die fertigen Dateien hochladen.
