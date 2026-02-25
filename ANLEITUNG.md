# Kinderwitzemaschine — Deine Anleitung

Alles ist fertig gebaut. Du musst nur noch diese Schritte durchführen.
**Nimm dir Zeit — es gibt keine Eile.**

---

## SCHRITT 1: GitHub-Repository erstellen (5 Minuten)

1. Gehe auf **github.com** und logge dich ein
2. Klicke oben rechts auf das **"+"** Symbol → **"New repository"**
3. Name: `kinderwitzemaschine`
4. Sichtbarkeit: **Private** (empfohlen)
5. **WICHTIG:** Hake NICHTS an (kein README, kein .gitignore)
6. Klicke **"Create repository"**
7. GitHub zeigt dir jetzt eine Seite mit Befehlen — lass sie offen

---

## SCHRITT 2: Code auf GitHub hochladen (5 Minuten)

Öffne die **Eingabeaufforderung** (CMD) auf deinem Computer:
- Drücke **Windows-Taste + R**, tippe `cmd`, drücke Enter

Kopiere diese Befehle **einen nach dem anderen** rein und drücke jeweils Enter:

```
cd "C:\Users\baich\Desktop\Kinderwitzemaschine"
```
```
git init
```
```
git add .
```
```
git commit -m "Kinderwitzemaschine v1.0"
```
```
git branch -M main
```

Jetzt kommt dein GitHub-Benutzername rein (ersetze DEIN-USERNAME):
```
git remote add origin https://github.com/DEIN-USERNAME/kinderwitzemaschine.git
```
```
git push -u origin main
```

→ GitHub fragt nach deinem Passwort: Gib es ein (oder nutze einen Personal Access Token)

---

## SCHRITT 3: App auf Hostinger VPS deployen (30 Minuten)

> **Hinweis:** Railway war kostenlos, hat aber Kontingent-Limits. Der VPS läuft dauerhaft.

### Teil A: Kostenlose Domain holen (5 Min)

1. Gehe auf **https://www.duckdns.org**
2. Klicke **"sign in"** → mit Google einloggen
3. Unter **"sub domain"** eingeben: `kinderwitzemaschine` (oder einen freien Namen)
4. Klicke **"add domain"**
5. Unter **"current ip"**: deine VPS-IP-Adresse eingeben
6. Klicke **"update ip"**
7. Notiere dir deine Domain: `kinderwitzemaschine.duckdns.org`

### Teil B: VPS einrichten (20 Min)

SSH in deinen Hostinger-VPS einloggen (über Hpanel → VPS → Terminal), dann:

**Einziger Befehl — alles automatisch:**
```bash
curl -fsSL https://raw.githubusercontent.com/budsxbach/kinderwitzemaschine/main/vps/install.sh | bash -s -- kinderwitzemaschine.duckdns.org
```
→ Ersetzt `kinderwitzemaschine.duckdns.org` durch deine eigene DuckDNS-Domain
→ Das Script installiert alles und startet die App

### Teil C: HTTPS aktivieren (5 Min)

Nach dem Script, diesen Befehl ausführen:
```bash
sudo certbot --nginx -d kinderwitzemaschine.duckdns.org
```
→ Deine E-Mail eingeben (z.B. system.reset.all@gmail.com)
→ Mit `A` AGBs bestätigen
→ Fertig — HTTPS ist aktiviert ✅

---

## SCHRITT 4: Testen (2 Minuten)

Öffne deinen Browser und gehe zu:
```
https://kinderwitzemaschine.duckdns.org/
```
Du solltest sehen:
```json
{"status":"ok","name":"Kinderwitzemaschine","version":"1.0.0","jokes_count":215}
```

Und teste die Datenschutzseite:
```
https://kinderwitzemaschine.duckdns.org/datenschutz
```
→ Die schöne Datenschutzseite soll erscheinen.

---

## SCHRITT 5: OpenAI Developer-Konto einrichten (15 Minuten)

1. Gehe auf **platform.openai.com**
2. Falls noch kein Konto: **"Sign up"** mit deiner E-Mail
3. Einloggen
4. Gehe zu **Settings** (Zahnrad oben rechts)
5. Klicke auf **"Verification"**
6. Klicke **"Verify Identity"**
7. Folge dem Prozess: Name eingeben + Ausweis-Foto (Personalausweis oder Reisepass)
8. Warte auf Bestätigung (meist sofort oder wenige Minuten)

---

## SCHRITT 6: App einreichen (20 Minuten)

1. Gehe auf **platform.openai.com/apps-manage**
2. Klicke **"Submit new app"** (oder ähnlicher Button)
3. Fülle das Formular aus — alle Texte findest du in:
   **`docs/submission/einreichung.md`** (öffne mit Editor/Notepad)
4. **Ersetze überall "DEINE-URL" durch: `kinderwitzemaschine.duckdns.org`**
5. Logo hochladen: **`Logo.png`** aus deinem Desktop-Ordner
6. Screenshots: Mache 3-5 Fotos/Screenshots vom Browser mit deiner App
7. Klicke **"Submit"**

---

## Nach der Einreichung

- OpenAI prüft die App (aktuell 1-4 Wochen)
- Du bekommst eine E-Mail mit dem Ergebnis
- Bei Ablehnung: Lies die Begründung, frage mich und wir passen es an
- Bei Akzeptanz: Herzlichen Glückwunsch — deine App ist live!

---

## Deine Datei-Übersicht

```
Kinderwitzemaschine/
├── ANLEITUNG.md          ← Diese Datei
├── server.js             ← Der Haupt-Code (nicht anfassen)
├── jokes.json            ← 215 Kinderwitze
├── package.json          ← Projekt-Konfiguration
├── Procfile              ← Railway-Startbefehl (nicht mehr aktiv)
├── .gitignore            ← Dateien die nicht hochgeladen werden
├── Logo.png              ← Dein App-Logo
├── Logo.svg              ← Dein App-Logo (Vektorformat)
├── public/
│   └── datenschutz.html  ← Datenschutzseite
├── vps/
│   ├── install.sh        ← VPS-Setup automatisch
│   └── nginx.conf        ← Webserver-Konfiguration
└── docs/
    └── submission/
        └── einreichung.md ← Alle Texte für OpenAI-Formular
```

---

## Hilfe benötigt?

Schreibe mir in Claude Code einfach was nicht funktioniert — ich helfe dir.
