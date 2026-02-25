# OpenAI App Submission — Kinderwitzemaschine

> WICHTIG: Ersetze DEINE-URL durch deine echte Railway-URL bevor du einreichst.

---

## Formularfelder zum Kopieren

### App Name
```
Kinderwitzemaschine
```

### Short Description (Englisch — max. 100 Zeichen)
```
German children's joke generator – fun & family-friendly jokes for kids aged 4–12
```

### Short Description (Deutsch)
```
Kinderwitze-Generator – lustige, altersgerechte Witze für Kinder von 4–12 Jahren
```

### Full Description (Englisch)
```
Kinderwitzemaschine brings a curated database of 215+ German children's jokes
directly into ChatGPT. Perfect for parents, grandparents, and teachers who want
to share fun, age-appropriate humor with children.

Features:
• Get a random children's joke anytime
• Browse jokes by category: Animals, School, Food, Family, Sports, Fantasy
• Search jokes by keyword (e.g. "elephant", "pizza", "dragon")

All content is age-appropriate for children aged 4–12. No user data is collected.
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

Alle Inhalte sind altersgerecht für Kinder von 4–12 Jahren.
Es werden keine Nutzerdaten gesammelt. Keine Anmeldung erforderlich. Kostenlos.
```

### MCP Server URL
```
https://DEINE-URL.railway.app/mcp
```

### Privacy Policy URL
```
https://DEINE-URL.railway.app/datenschutz
```

### Customer Support Contact
```
kontakt@kinderwitzemaschine.de
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
**Erwartete Antwort:** Ein zufälliger Witz aus der Datenbank im Format:
"Kategorie: [Name] | ❓ [Frage] | 😄 [Antwort]"

### Test Prompt 2
```
Give me a children's joke about animals
```
**Erwartete Antwort:** Ein Witz aus der Kategorie "Tiere"

### Test Prompt 3
```
Search for a children's joke about elephants
```
**Erwartete Antwort:** Witz mit "Elefant" in Frage oder Antwort

### Test Prompt 4 (Deutsch)
```
Erzähl mir einen Witz über die Schule
```
**Erwartete Antwort:** Ein Witz aus der Kategorie "Schule"

---

## Checkliste vor dem Einreichen

- [ ] Railway-Deployment läuft ohne Fehler
- [ ] `https://DEINE-URL.railway.app/` gibt `{"status":"ok"}` zurück
- [ ] `https://DEINE-URL.railway.app/datenschutz` ist erreichbar
- [ ] `https://DEINE-URL.railway.app/mcp` antwortet auf POST-Anfragen
- [ ] Logo.png ist vorhanden (liegt im Projektordner)
- [ ] Identität bei platform.openai.com verifiziert
- [ ] Alle Test-Prompts funktionieren in ChatGPT
- [ ] Screenshots gemacht (3-5 Stück)

---

## Screenshots — Was du fotografieren sollst

1. ChatGPT fragt nach einem Zufallswitz → Antwort mit Witz
2. ChatGPT fragt nach Tierwitz → Witz über ein Tier
3. ChatGPT sucht nach "Elefant" → Ergebnis mit Elefanten-Witz
4. Datenschutz-Seite im Browser
5. Health-Check URL im Browser (zeigt JSON)
