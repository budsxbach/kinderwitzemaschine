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

// Domain-Verifizierung fuer OpenAI (Token liegt in .well-known/)
app.use("/.well-known", express.static(join(__dirname, ".well-known"), { dotfiles: "allow" }));

// Witze laden (einmalig beim Start)
const jokes = JSON.parse(readFileSync(join(__dirname, "jokes.json"), "utf-8"));

// Hilfsfunktion: Witz formatieren
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
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
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
        "Returns a German children's joke from a broad category. " +
        "Available categories: Tiere (Animals), Schule (School), Essen (Food), " +
        "Familie (Family), Sport (Sports), Fantasie (Fantasy). " +
        "Use this ONLY when the user asks for a general topic like 'animals' or 'school' " +
        "WITHOUT naming a specific subject. " +
        "If the user names something specific like 'elephant', 'donkey', or 'pizza', use search_jokes instead.",
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      inputSchema: z.object({
        category: z
          .enum(["Tiere", "Schule", "Essen", "Familie", "Sport", "Fantasie"])
          .describe(
            "The joke category. Options: " +
            "Tiere (Animals), Schule (School), Essen (Food), " +
            "Familie (Family), Sport (Sports), Fantasie (Fantasy)"
          ),
      }),
    },
    ({ category }) => {
      const gefiltert = jokes.filter((j) => j.kategorie === category);
      const witz = gefiltert[Math.floor(Math.random() * gefiltert.length)];
      return {
        content: [
          {
            type: "text",
            text: `🎉 A joke from the category "${category}":\n\n${formatJoke(witz)}`,
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
        "Searches German children's jokes by a specific keyword in German or English. " +
        "ALWAYS use this tool when the user mentions a specific subject like 'elephant', 'donkey', " +
        "'pizza', 'dragon', 'teacher', or any particular thing. " +
        "If no match is found, automatically returns a random joke as a friendly fallback.",
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
      inputSchema: z.object({
        keyword: z
          .string()
          .min(2)
          .max(50)
          .describe(
            "Search keyword in German or English, e.g. 'Elefant', 'elephant', 'Pizza', 'Drachen'"
          ),
      }),
    },
    ({ keyword }) => {
      const term = keyword.toLowerCase();
      const ergebnisse = jokes.filter(
        (j) =>
          j.frage.toLowerCase().includes(term) ||
          j.antwort.toLowerCase().includes(term) ||
          j.kategorie.toLowerCase().includes(term)
      );

      // Kein Treffer → smarter Fallback statt leere Antwort
      if (ergebnisse.length === 0) {
        const fallback = jokes[Math.floor(Math.random() * jokes.length)];
        return {
          content: [
            {
              type: "text",
              text:
                `🔍 No joke found for "${keyword}" — but here is a funny one anyway:\n\n` +
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
              `🔍 Found ${ergebnisse.length} joke(s) for "${keyword}":\n\n` +
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
