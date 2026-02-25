# Kinderwitzemaschine — Test Report

**Date:** 2026-02-25
**Server:** https://kinderwitzemaschine.duckdns.org
**MCP Endpoint:** https://kinderwitzemaschine.duckdns.org/mcp
**Version:** 1.0.0
**Total Jokes in Database:** 215
**Test Method:** Direct MCP JSON-RPC 2.0 calls via curl

---

## 1. Infrastructure Tests

| Test | Method | Expected | Result |
|---|---|---|---|
| Health Check | GET `/` | JSON with status "ok" | ✅ `{"status":"ok","name":"Kinderwitzemaschine","version":"1.0.0","jokes_count":215}` |
| HTTPS Certificate | GET `/` | HTTP 200 with valid TLS | ✅ HTTP/1.1 200 OK via nginx/1.24.0 |
| Privacy Policy Page | GET `/datenschutz` | HTTP 200, text/html | ✅ HTTP Status: 200, Content-Type: text/html; charset=UTF-8 |
| MCP Tool Discovery | POST `/mcp` `tools/list` | Returns 3 tools with annotations | ✅ 3 tools returned, all with correct annotations |

---

## 2. Tool: get_random_joke (5 consecutive calls)

All calls returned a valid joke with category. Different jokes on each call confirms randomization.

| Call | Category | Joke (first line) | Result |
|---|---|---|---|
| 1 | Tiere | Warum trinkt ein Pferd so viel Wasser? | ✅ |
| 2 | Tiere | Warum ist der Elefant so vergesslich? | ✅ |
| 3 | Tiere | Warum schläft der Hase auf dem Feld? | ✅ |
| 4 | Familie | Was sagt Oma beim Abendessen immer? | ✅ |
| 5 | Familie | Warum kocht Mama das beste Essen? | ✅ |

---

## 3. Tool: get_joke_by_category (all 6 categories)

| Category | Joke Returned | Result |
|---|---|---|
| Tiere (Animals) | Warum haben Katzen weiche Pfoten? | ✅ |
| Schule (School) | Warum bringt der Schüler eine Leiter in die Schule? | ✅ |
| Essen (Food) | Was sagt die Pommes zur Ketchupflasche? | ✅ |
| Familie (Family) | Was macht die Familie am liebsten im Urlaub? | ✅ |
| Sport (Sports) | Was macht ein Bogenschütze im Regen? | ✅ |
| Fantasie (Fantasy) | Warum hat die Meerjungfrau keine Schuhe? | ✅ |

---

## 4. Tool: search_jokes — German Keywords

| Keyword | Matches Found | Sample Joke | Result |
|---|---|---|---|
| Elefant | 2 | Warum können Elefanten nicht Fahrrad fahren? | ✅ |
| Hund | 4 | Was ist ein Hund ohne Beine? — Eine Wurst! | ✅ |
| Katze | 3 | Warum hat die Hexe so viele Katzen? | ✅ |
| Pizza | 1 | Was ist der Unterschied zwischen einem Schüler und einer Pizza? | ✅ |
| Drachen | 1 | Warum reitet der Ritter auf einem Pferd? | ✅ |
| Lehrer | 5 | Was ist der Lieblingsplatz eines Schülers? | ✅ |
| Schwimmen | 5 | Warum ist Schwimmen so gesund? | ✅ |
| Schnee | 2 | Was sagt der Zwerg zum Schneewittchen? | ✅ |
| Einhorn | 2 | Was sagt ein Einhorn zu einem Pferd? | ✅ |

---

## 5. Tool: search_jokes — English Keywords (Auto-Translation)

The search tool automatically translates common English keywords to German.

| English Keyword | Translated To | Matches Found | Result |
|---|---|---|---|
| elephant | Elefant | 2 | ✅ |
| cat | Katze | 3 | ✅ |
| dog | Hund | 4 | ✅ |
| dragon | Drachen | 1 | ✅ |
| teacher | Lehrer | 5 | ✅ |
| pizza | Pizza (same) | 1 | ✅ |
| school | Schule | 38 | ✅ |
| food | Essen | 37 | ✅ |
| family | Familie | 35 | ✅ |
| sports | Sport | 37 | ✅ |
| animals | Tiere | 40 | ✅ |
| donkey | Esel | 0 (no donkey jokes in DB) | ✅ Fallback |

---

## 6. Smart Fallback (No Match → Random Joke)

When no joke matches the keyword, the tool returns a random joke with a helpful tip.

| Keyword | Matches | Fallback Joke Returned | Tip Shown | Result |
|---|---|---|---|---|
| Frettchen | 0 | ✅ Random joke | ✅ | ✅ |
| Dinosaurier | 0 | ✅ Random joke | ✅ | ✅ |
| Astronaut | 0 | ✅ Random joke | ✅ | ✅ |
| Roboter | 0 | ✅ Random joke | ✅ | ✅ |
| Esel | 0 (no standalone match) | ✅ Random joke | ✅ | ✅ |

---

## 7. False-Positive Prevention (Word Boundary Matching)

The search uses word-boundary regex (`\b`) to prevent substring false positives.

| Keyword | Previously Matched | Now Matches | Correct? |
|---|---|---|---|
| Esel | "di**esel**ben" (wrong!) | Nothing (no real donkey jokes) | ✅ Fixed |
| Rad | "Fah**rrad**" (would be wrong) | "im Rad" (standalone word) | ✅ Correct |

---

## 8. Case-Insensitive Search

| Keyword Variant | Matches Found | Result |
|---|---|---|
| elefant (lowercase) | 2 | ✅ |
| ELEFANT (uppercase) | 2 | ✅ |
| ElEfAnT (mixed) | 2 | ✅ |
| pizza (lowercase) | 1 | ✅ |
| PIZZA (uppercase) | 1 | ✅ |

---

## 9. Error Handling

| Error Scenario | Expected Behavior | Actual Response | Result |
|---|---|---|---|
| Invalid category value | Validation error with valid options | ✅ `invalid_enum_value` with options list | ✅ |
| Keyword too short (1 char) | Validation error | ✅ `too_small, minimum: 2` | ✅ |
| Empty keyword | Validation error | ✅ `too_small, minimum: 2` | ✅ |
| Nonexistent tool name | Tool not found error | ✅ `Tool fake_tool not found` | ✅ |
| Missing required arguments | Required field error | ✅ `Required` with field path | ✅ |

---

## 10. Tool Annotations Verification

All tools correctly declare their impact hints as verified via `tools/list`:

| Tool | readOnlyHint | destructiveHint | openWorldHint | Correct? |
|---|---|---|---|---|
| get_random_joke | true | false | false | ✅ |
| get_joke_by_category | true | false | false | ✅ |
| search_jokes | true | false | false | ✅ |

---

## 11. Response Format Verification

All tool responses follow the MCP content format:

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "🎉 Here is a German children's joke!\n\n❓ [Question]\n\n😄 [Answer]\n\n📂 Category: [Name]"
      }
    ]
  }
}
```

- No PII, telemetry, session IDs, or internal identifiers in responses ✅
- No timestamps, trace IDs, or logging metadata ✅
- Only joke content and category name returned ✅

---

## Summary

| Category | Tests Run | Passed | Failed |
|---|---|---|---|
| Infrastructure | 4 | 4 | 0 |
| get_random_joke | 5 | 5 | 0 |
| get_joke_by_category | 6 | 6 | 0 |
| Search (German) | 9 | 9 | 0 |
| Search (English) | 12 | 12 | 0 |
| Smart Fallback | 5 | 5 | 0 |
| False-Positive Prevention | 2 | 2 | 0 |
| Case-Insensitive | 5 | 5 | 0 |
| Error Handling | 5 | 5 | 0 |
| Annotations | 3 | 3 | 0 |
| **TOTAL** | **56** | **56** | **0** |

**Result: ALL 56 TESTS PASSED ✅**

---

*Note: Some German special characters (ß, ö, ü) may appear garbled in raw curl output due to terminal encoding. In ChatGPT's native interface, all characters display correctly as verified during manual testing.*
