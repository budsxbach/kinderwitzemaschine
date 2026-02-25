# Kinderwitzemaschine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Einen vollständigen Node.js MCP-Server für die Kinderwitzemaschine ChatGPT App bauen, der auf Railway.app deployt werden kann und alle OpenAI-Einreichungsanforderungen erfüllt.

**Architecture:** Ein Express.js Server mit einem MCP-Endpunkt unter `/mcp`, der drei read-only Tools bereitstellt (zufallswitz, witz_nach_kategorie, witz_suchen). Alle Witze sind in einer statischen `jokes.json` Datei gespeichert. Eine statische Datenschutz-HTML-Seite unter `/datenschutz` erfüllt die OpenAI-Datenschutzanforderung.

**Tech Stack:** Node.js (ESM), Express 4, @modelcontextprotocol/sdk, @modelcontextprotocol/ext-apps, Zod

---

### Task 1: Projekt-Grundstruktur und package.json erstellen

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `Procfile`

**Step 1: package.json schreiben**

```json
{
  "name": "kinderwitzemaschine",
  "version": "1.0.0",
  "description": "Kinderwitze fuer ChatGPT - Deutsche Witze fuer Kinder",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.20.2",
    "@modelcontextprotocol/ext-apps": "^1.0.1",
    "express": "^4.18.2",
    "zod": "^3.25.76"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Step 2: .gitignore schreiben**

```
node_modules/
.env
*.log
.DS_Store
```

**Step 3: Procfile für Railway schreiben**

```
web: node server.js
```

---

### Task 2: Witze-Datenbank erstellen (jokes.json)

**Files:**
- Create: `jokes.json`

**Step 1: jokes.json mit 200+ Witzen schreiben**

Das JSON-Array enthält Objekte mit diesem Schema:
```json
{
  "id": "001",
  "kategorie": "Tiere",
  "alter_min": 4,
  "alter_max": 12,
  "frage": "Fragetext",
  "antwort": "Antworttext"
}
```

Kategorien: "Tiere", "Schule", "Essen", "Familie", "Sport", "Fantasie"
Mindestens 30 Witze pro Kategorie, 200+ gesamt.

Beispiele:
- Tiere: Elefant, Hund, Katze, Kuh, Frosch, Vogel, Fisch, Bär...
- Schule: Lehrer, Hausaufgaben, Noten, Pause...
- Essen: Kuchen, Banane, Spaghetti...
- Familie: Mama, Papa, Oma, Opa...
- Sport: Fußball, Schwimmen...
- Fantasie: Drachen, Hexen, Roboter...

**Step 2: Qualitätsprüfung**
- Alle Witze altersgerecht (4-12 Jahre)
- Keine beleidigenden, religiösen, politischen Inhalte
- Keine Gewalt, kein Alkohol, keine Sexualität
- Familienfreundlich (OpenAI-Anforderung: "appropriate for all audiences")

---

### Task 3: MCP-Server Hauptdatei schreiben

**Files:**
- Create: `server.js`

**Step 1: server.js implementieren**

```javascript
import express from "express";
import { readFileSync } from "fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

// Witze laden
const jokes = JSON.parse(readFileSync("./jokes.json", "utf-8"));

// MCP-Endpunkt
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  const server = new McpServer({
    name: "kinderwitzemaschine",
    version: "1.0.0",
  });

  // Tool 1: Zufälliger Witz
  server.registerTool(
    "zufallswitz",
    {
      title: "Zufälliger Kinderwitz",
      description: "Gibt einen zufälligen Kinderwitz zurück. Perfekt wenn kein bestimmtes Thema gewünscht wird.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    () => {
      const idx = Math.floor(Math.random() * jokes.length);
      const witz = jokes[idx];
      return {
        content: [{
          type: "text",
          text: `Kategorie: ${witz.kategorie}\n\n❓ ${witz.frage}\n\n😄 ${witz.antwort}`,
        }],
      };
    }
  );

  // Tool 2: Witz nach Kategorie
  server.registerTool(
    "witz_nach_kategorie",
    {
      title: "Witz nach Kategorie",
      description: "Gibt einen Kinderwitz aus einer bestimmten Kategorie zurück. Verfügbare Kategorien: Tiere, Schule, Essen, Familie, Sport, Fantasie",
      annotations: { readOnlyHint: true, openWorldHint: false },
      inputSchema: z.object({
        kategorie: z.enum(["Tiere", "Schule", "Essen", "Familie", "Sport", "Fantasie"])
          .describe("Die Kategorie des gewünschten Witzes"),
      }),
    },
    ({ kategorie }) => {
      const gefiltert = jokes.filter(j => j.kategorie === kategorie);
      if (gefiltert.length === 0) {
        return { content: [{ type: "text", text: `Keine Witze in der Kategorie "${kategorie}" gefunden.` }] };
      }
      const witz = gefiltert[Math.floor(Math.random() * gefiltert.length)];
      return {
        content: [{
          type: "text",
          text: `Kategorie: ${witz.kategorie}\n\n❓ ${witz.frage}\n\n😄 ${witz.antwort}`,
        }],
      };
    }
  );

  // Tool 3: Witz suchen
  server.registerTool(
    "witz_suchen",
    {
      title: "Witz suchen",
      description: "Sucht Kinderwitze nach einem Stichwort (z.B. 'Elefant', 'Schule', 'Pizza')",
      annotations: { readOnlyHint: true, openWorldHint: false },
      inputSchema: z.object({
        stichwort: z.string().min(2).max(50)
          .describe("Das Stichwort für die Suche"),
      }),
    },
    ({ stichwort }) => {
      const keyword = stichwort.toLowerCase();
      const ergebnisse = jokes.filter(j =>
        j.frage.toLowerCase().includes(keyword) ||
        j.antwort.toLowerCase().includes(keyword) ||
        j.kategorie.toLowerCase().includes(keyword)
      );
      if (ergebnisse.length === 0) {
        return { content: [{ type: "text", text: `Keine Witze mit dem Stichwort "${stichwort}" gefunden. Versuche ein anderes Wort!` }] };
      }
      const witz = ergebnisse[Math.floor(Math.random() * ergebnisse.length)];
      return {
        content: [{
          type: "text",
          text: `Gefunden für "${stichwort}" (${ergebnisse.length} Treffer):\n\n❓ ${witz.frage}\n\n😄 ${witz.antwort}`,
        }],
      };
    }
  );

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Health Check (für Railway)
app.get("/", (req, res) => {
  res.json({ status: "ok", name: "Kinderwitzemaschine", version: "1.0.0" });
});

// Datenschutz-Seite (Pflicht für OpenAI-Einreichung)
app.get("/datenschutz", (req, res) => {
  res.sendFile("datenschutz.html", { root: "./public" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kinderwitzemaschine läuft auf Port ${PORT}`);
});
```

---

### Task 4: Datenschutz-Seite erstellen

**Files:**
- Create: `public/datenschutz.html`

**Step 1: Datenschutz-HTML schreiben**

Vollständige HTML-Seite auf Deutsch und Englisch mit:
- Anbietername / Kontakt
- Klare Aussage: Keine personenbezogenen Daten werden gesammelt
- Keine Cookies, keine Tracker
- Kontakt-E-Mail (Platzhalter: kontakt@kinderwitzemaschine.de)
- Übereinstimmung mit OpenAI-Anforderungen:
  - categories of personal data collected → "keine"
  - purposes of use → "Bereitstellung von Kinderwitze-Inhalten"
  - categories of recipients → "keine"
  - controls offered to users → "nicht erforderlich, da keine Daten"

---

### Task 5: GitHub Repository einrichten

**Step 1: Lokales Git initialisieren**
```bash
cd "C:/Users/baich/Desktop/Kinderwitzemaschine"
git init
git add .
git commit -m "feat: initial Kinderwitzemaschine MCP server"
```

**Step 2: GitHub Repository erstellen**
- Auf github.com einloggen
- "New repository" klicken
- Name: `kinderwitzemaschine`
- Private oder Public (empfohlen: Private für jetzt)
- OHNE README erstellen

**Step 3: Code hochladen**
```bash
git remote add origin https://github.com/DEIN-USERNAME/kinderwitzemaschine.git
git branch -M main
git push -u origin main
```

---

### Task 6: Railway.app Deployment

**Step 1: Railway-Konto erstellen**
- Auf railway.app gehen
- "Login with GitHub" klicken

**Step 2: Neues Projekt aus GitHub**
- "New Project" → "Deploy from GitHub repo"
- `kinderwitzemaschine` auswählen
- Railway erkennt Node.js automatisch
- Deploy-Knopf drücken

**Step 3: PORT-Variable prüfen**
- Railway setzt PORT automatisch
- Unser server.js liest `process.env.PORT || 3000` ✓

**Step 4: Deployment-URL notieren**
- Railway gibt eine URL wie `kinderwitzemaschine-production.up.railway.app`
- Das ist die MCP-URL: `https://DEINE-URL.railway.app/mcp`
- Das ist die Datenschutz-URL: `https://DEINE-URL.railway.app/datenschutz`

---

### Task 7: OpenAI-Einreichungsunterlagen vorbereiten

**Files:**
- Create: `docs/submission/einreichung.md`

**Inhalte für das OpenAI-Formular:**

```
App Name: Kinderwitzemaschine

Kurzbeschreibung (Englisch, max. 100 Zeichen):
"German children's joke generator – fun & family-friendly jokes for kids aged 4–12"

Kurzbeschreibung (Deutsch):
"Kinderwitze-Generator – lustige, altersgerechte Witze für Kinder von 4–12 Jahren"

Detailbeschreibung:
"Kinderwitzemaschine brings a curated database of 200+ German children's jokes
directly into ChatGPT. Request a random joke, browse by category (Animals, School,
Food, Family, Sports, Fantasy), or search by keyword. All content is age-appropriate
for children aged 4–12. No user data is collected."

MCP URL: https://DEINE-URL.railway.app/mcp

Privacy Policy URL: https://DEINE-URL.railway.app/datenschutz

Kategorie: Entertainment / Kids & Family

Test-Prompts (für OpenAI-Reviewer):
1. "Tell me a random children's joke"
2. "Give me an animal joke for kids"
3. "Search for a joke about elephants"
4. "Erzähl mir einen Witz über die Schule"

Erwartete Antworten für Reviewer:
→ Structured joke response with emoji, Frage + Antwort format
```

---

### Task 8: Finale Einreichung bei OpenAI

**Step 1: Developer-Konto vorbereiten**
- Auf platform.openai.com einloggen (oder Konto erstellen - kostenlos)
- Settings → Verification → Individual verification abschließen
- Ausweis-Foto hochladen (Reisepass oder Personalausweis)

**Step 2: App einreichen**
- Auf platform.openai.com/apps-manage gehen
- "Submit new app" klicken
- Formular mit den Texten aus `docs/submission/einreichung.md` ausfüllen
- Logo hochladen (Logo.png aus dem Projektordner)
- Screenshots hinzufügen (3-5 Screenshots vom funktionierenden App-Interface)
- Einreichen

**Step 3: Warten**
- OpenAI prüft Apps aktuell in 1-4 Wochen
- Bei Ablehnung: E-Mail beachten, Feedback umsetzen, erneut einreichen

---

## Abschlusscheckliste vor Einreichung

- [ ] Server läuft auf Railway ohne Fehler
- [ ] `/mcp` Endpoint antwortet korrekt
- [ ] `/datenschutz` Seite ist erreichbar
- [ ] `/` Health Check gibt `{"status":"ok"}` zurück
- [ ] Alle 3 Test-Prompts funktionieren
- [ ] Logo hochgeladen
- [ ] Identität bei OpenAI verifiziert
- [ ] Alle Formularfelder ausgefüllt
