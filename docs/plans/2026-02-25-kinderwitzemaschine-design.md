# Design: Kinderwitzemaschine — ChatGPT App

**Datum:** 2026-02-25
**Ziel:** Eine ChatGPT App (via OpenAI Apps SDK / MCP) einreichen und akzeptieren lassen.

---

## Zusammenfassung

Die Kinderwitzemaschine ist ein Node.js MCP-Server, der deutschen Kinderwitzen dient.
ChatGPT ruft über das Model Context Protocol (MCP) Witze aus einer statischen JSON-Datenbank ab.
Keine externe API, keine Nutzerdaten — dadurch maximale Chance auf Akzeptanz.

---

## Architektur

```
[ChatGPT] <--MCP--> [Node.js MCP Server auf Railway.app] <-- [jokes.json]
                    [/datenschutz - Privacy Policy HTML]
```

### Stack
- **Sprache:** Node.js (ESM)
- **MCP SDK:** `@modelcontextprotocol/sdk` + `@modelcontextprotocol/ext-apps`
- **Framework:** Express.js
- **Hosting:** Railway.app (kostenlos, GitHub-Integration)
- **Datenbank:** Statisches JSON-File (keine externe DB nötig)

---

## MCP Tools (Befehle für ChatGPT)

| Tool-Name | Beschreibung | Annotations |
|-----------|-------------|-------------|
| `zufallswitz` | Gibt einen zufälligen Kinderwitz zurück | readOnly |
| `witz_nach_kategorie` | Gibt Witze nach Kategorie | readOnly |
| `witz_suchen` | Sucht Witze nach Stichwort | readOnly |

Alle Tools sind `readOnlyHint: true` (keine Daten werden erstellt/verändert).

---

## Datenschema (jokes.json)

```json
{
  "id": "001",
  "kategorie": "Tiere",
  "alter_min": 4,
  "alter_max": 12,
  "frage": "Warum können Elefanten nicht Fahrrad fahren?",
  "antwort": "Weil sie keinen Daumen haben, um zu klingeln!"
}
```

### Kategorien
- Tiere
- Schule
- Essen
- Familie
- Sport
- Fantasie

### Umfang
- 200+ Witze initial

---

## Datenschutz (OpenAI-Pflicht)

Statische HTML-Seite auf `/datenschutz`:
- Klar: "Wir sammeln keine personenbezogenen Daten"
- Vollständig im Sinne der OpenAI-Anforderungen

---

## Dateistruktur

```
kinderwitzemaschine/
├── package.json
├── server.js          ← MCP-Server Hauptdatei
├── jokes.json         ← Alle Witze
├── public/
│   └── datenschutz.html
├── Procfile           ← Railway deployment
└── .gitignore
```

---

## Monetarisierung (Stufenplan)

| Phase | Bedingung | Maßnahme |
|-------|-----------|----------|
| Free | Jetzt | Alle 200+ Witze kostenlos |
| Physisch | Jetzt erlaubt | Amazon-Link zu Kinderwitzebuch in App-Beschreibung |
| Digital | Wenn OpenAI erlaubt | Premium-Abo: 500+ Witze, Tageswitz, Eltern-Tipps |

---

## OpenAI Submission Checkliste

- [ ] App Name: "Kinderwitzemaschine"
- [ ] Logo: vorhanden (Logo.png / Logo.svg)
- [ ] Beschreibung: deutsch + englisch
- [ ] Privacy Policy URL: `https://<railway-url>/datenschutz`
- [ ] MCP URL: `https://<railway-url>/mcp`
- [ ] Tool-Annotationen: alle korrekt gesetzt
- [ ] Identitätsverifikation: platform.openai.com
- [ ] Test-Prompts: vorbereitet
- [ ] Screenshots: nach Deployment erstellen

---

## Was der Nutzer tun muss (6 Schritte)

1. Konto auf railway.app erstellen (kostenlos, mit GitHub)
2. GitHub-Repo erstellen und Code pushen
3. Railway-Deployment starten (1 Klick)
4. Konto auf platform.openai.com verifizieren
5. Identität verifizieren (Ausweis-Foto)
6. App-Formular ausfüllen und einreichen
