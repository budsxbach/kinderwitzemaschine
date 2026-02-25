import express from "express";
import { readFileSync } from "fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// Statische Dateien aus /public bedienen
app.use("/public", express.static(join(__dirname, "public")));

// Witze laden (einmalig beim Start)
const jokes = JSON.parse(readFileSync(join(__dirname, "jokes.json"), "utf-8"));

// Hilfsfunktion: Zufälligen Witz formatieren
function formatJoke(witz) {
  return `❓ ${witz.frage}\n\n😄 ${witz.antwort}`;
}

// MCP-Endpunkt — jede Anfrage bekommt eine neue Server-Instanz (stateless)
app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  const server = new McpServer({
    name: "kinderwitzemaschine",
    version: "1.0.0",
  });

  // Tool 1: Random joke
  server.registerTool(
    "get_random_joke",
    {
      title: "Get a Random Children's Joke",
      description:
        "Returns a random German children's joke from the Kinderwitzemaschine database. " +
        "Use this when the user asks for any joke without specifying a topic or category. " +
        "All jokes are family-friendly and suitable for the whole family.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    () => {
      const witz = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        content: [
          {
            type: "text",
            text: `🎉 Here is a German children's joke!\n\n${formatJoke(witz)}\n\n📂 Category: ${witz.kategorie}`,
          },
        ],
      };
    }
  );

  // Tool 2: Joke by category
  server.registerTool(
    "get_joke_by_category",
    {
      title: "Get a Children's Joke by Category",
      description:
        "Returns a German children's joke from a specific category. " +
        "Available categories: Tiere (Animals), Schule (School), Essen (Food), " +
        "Familie (Family), Sport (Sports), Fantasie (Fantasy). " +
        "Use this when the user asks for jokes about a specific topic.",
      annotations: { readOnlyHint: true, openWorldHint: false },
      inputSchema: z.object({
        kategorie: z
          .enum(["Tiere", "Schule", "Essen", "Familie", "Sport", "Fantasie"])
          .describe(
            "The joke category. Options: " +
            "Tiere (Animals), Schule (School), Essen (Food), " +
            "Familie (Family), Sport (Sports), Fantasie (Fantasy)"
          ),
      }),
    },
    ({ kategorie }) => {
      const gefiltert = jokes.filter((j) => j.kategorie === kategorie);
      const witz = gefiltert[Math.floor(Math.random() * gefiltert.length)];
      return {
        content: [
          {
            type: "text",
            text: `🎉 A joke from the category "${kategorie}":\n\n${formatJoke(witz)}`,
          },
        ],
      };
    }
  );

  // Tool 3: Search jokes by keyword — with smart fallback
  server.registerTool(
    "search_jokes",
    {
      title: "Search Children's Jokes by Keyword",
      description:
        "Searches German children's jokes by keyword in German or English. " +
        "If no exact match is found, automatically returns a random joke as a friendly fallback " +
        "so the user always gets entertained. " +
        "Examples: 'elephant', 'Elefant', 'pizza', 'dragon', 'Schule', 'school'.",
      annotations: { readOnlyHint: true, openWorldHint: false },
      inputSchema: z.object({
        stichwort: z
          .string()
          .min(2)
          .max(50)
          .describe(
            "Search keyword in German or English, e.g. 'Elefant', 'elephant', 'Pizza', 'Drachen'"
          ),
      }),
    },
    ({ stichwort }) => {
      const keyword = stichwort.toLowerCase();
      const ergebnisse = jokes.filter(
        (j) =>
          j.frage.toLowerCase().includes(keyword) ||
          j.antwort.toLowerCase().includes(keyword) ||
          j.kategorie.toLowerCase().includes(keyword)
      );

      // Kein Treffer → smarter Fallback statt leere Antwort
      if (ergebnisse.length === 0) {
        const fallback = jokes[Math.floor(Math.random() * jokes.length)];
        return {
          content: [
            {
              type: "text",
              text:
                `🔍 No joke found for "${stichwort}" — but here is a funny one anyway:\n\n` +
                `${formatJoke(fallback)}\n\n` +
                `💡 Tip: Try categories like Animals, School, Food, Family, Sports or Fantasy!`,
            },
          ],
        };
      }

      const witz = ergebnisse[Math.floor(Math.random() * ergebnisse.length)];
      return {
        content: [
          {
            type: "text",
            text:
              `🔍 Found ${ergebnisse.length} joke(s) for "${stichwort}":\n\n` +
              `${formatJoke(witz)}`,
          },
        ],
      };
    }
  );

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    name: "Kinderwitzemaschine",
    version: "1.0.0",
    jokes_count: jokes.length,
    categories: ["Tiere", "Schule", "Essen", "Familie", "Sport", "Fantasie"],
  });
});

// Datenschutz-Seite
app.get("/datenschutz", (req, res) => {
  res.sendFile(join(__dirname, "public", "datenschutz.html"));
});

// Verhindert dass unbehandelte Fehler den Server crashen
process.on("unhandledRejection", (reason) => {
  console.error("Unbehandelter Fehler:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Unerwarteter Fehler:", error.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kinderwitzemaschine läuft auf Port ${PORT}`);
  console.log(`${jokes.length} Witze geladen.`);
});
