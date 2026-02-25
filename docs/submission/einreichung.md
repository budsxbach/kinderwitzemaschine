# OpenAI App Submission — Kinderwitzemaschine

---

## Formularfelder zum Kopieren

### App Name
```
Kinderwitzemaschine
```

### Short Description (Englisch — max. 100 Zeichen)
```
German children's joke generator – fun & family-friendly jokes for the whole family
```

### Short Description (Deutsch)
```
Kinderwitze-Generator – lustige, familienfreundliche Witze für die ganze Familie
```

### Full Description (Englisch)
```
Kinderwitzemaschine brings a curated database of 215+ German children's jokes
directly into ChatGPT. Perfect for parents, grandparents, and teachers who want
to share fun, family-friendly humor with their loved ones.

Features:
• Get a random children's joke anytime
• Browse jokes by category: Animals, School, Food, Family, Sports, Fantasy
• Search jokes by keyword — smart fallback ensures you always get a joke

All content is family-friendly and suitable for the whole family. No user data is collected.
No login required. Free to use.
```

### Full Description (Deutsch)
```
Die Kinderwitzemaschine bringt über 215 kuratierte deutsche Kinderwitze direkt
in ChatGPT. Perfekt für Eltern, Großeltern und Lehrer, die Kindern lustige,
altersgerechte Witze erzählen möchten.

Funktionen:
• Zufälligen Kinderwitz abrufen
• Witze nach Kategorie: Tiere, Schule, Essen, Familie, Sport, Fantasie
• Witze nach Stichwort suchen (z.B. "Elefant", "Pizza", "Drachen")

Alle Inhalte sind familienfreundlich und für die ganze Familie geeignet.
Es werden keine Nutzerdaten gesammelt. Keine Anmeldung erforderlich. Kostenlos.
```

### MCP Server URL
```
https://kinderwitzemaschine.duckdns.org/mcp
```

### Privacy Policy URL
```
https://kinderwitzemaschine.duckdns.org/datenschutz
```

### Terms of Service URL
```
https://kinderwitzemaschine.duckdns.org/terms
```

### Company / Homepage URL
```
https://kinderwitzemaschine.duckdns.org
```

### Customer Support Contact
```
system.reset.all@gmail.com
```

### Category
```
Entertainment
```

### Tags / Keywords
```
children, kids, jokes, german, humor, family, education
```

---

## Test-Prompts für die Einreichung

Diese Prompts musst du bei OpenAI eintragen damit die Reviewer die App testen können:

### Test Prompt 1
```
Tell me a random children's joke
```
**Erwartete Antwort (Beispiel):**
```
🎉 Here is a German children's joke!

❓ Warum können Elefanten nicht Fahrrad fahren?
😄 Weil sie keinen Daumen haben, um zu klingeln!

📂 Category: Tiere
```

### Test Prompt 2
```
Give me a children's joke about animals
```
**Erwartete Antwort (Beispiel):**
```
🎉 A joke from the category "Tiere":

❓ Was macht ein Krokodil, wenn es Hunger hat?
😄 Es beißt sich durch!
```

### Test Prompt 3
```
Search for a children's joke about elephants
```
**Erwartete Antwort (Beispiel):**
```
🔍 Found 2 joke(s) for "elephants":

❓ Wie nennt man einen Elefanten, der im Schulbus sitzt?
😄 Den Klassenschwergewichtler!
```

### Test Prompt 4 (Deutsch)
```
Erzähl mir einen Witz über die Schule
```
**Erwartete Antwort (Beispiel):**
```
🎉 A joke from the category "Schule":

❓ Warum bringt der Lehrer einen Bleistift mit ins Bett?
😄 Um seine Träume aufzuschreiben!
```

---

## Checkliste vor dem Einreichen

- [x] VPS läuft ohne Fehler (`pm2 status` → online)
- [x] `https://kinderwitzemaschine.duckdns.org/` gibt `{"status":"ok"}` zurück
- [x] `https://kinderwitzemaschine.duckdns.org/datenschutz` ist erreichbar
- [x] `https://kinderwitzemaschine.duckdns.org/terms` ist erreichbar
- [x] `https://kinderwitzemaschine.duckdns.org/mcp` antwortet auf POST-Anfragen
- [x] Logo.png ist vorhanden (liegt im Projektordner)
- [x] Identität bei platform.openai.com verifiziert
- [x] Alle Test-Prompts funktionieren in ChatGPT
- [x] Screenshots gemacht (5 Stück im Screenshots/-Ordner)

---

## Screenshots — Was du fotografieren sollst

1. ChatGPT fragt nach einem Zufallswitz → Antwort mit Witz
2. ChatGPT fragt nach Tierwitz → Witz über ein Tier
3. ChatGPT sucht nach "Elefant" → Ergebnis mit Elefanten-Witz
4. Datenschutz-Seite im Browser
5. Health-Check URL im Browser (zeigt JSON)
