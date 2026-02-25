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

// MCP-Endpunkt — jede Anfrage bekommt eine neue Server-Instanz (stateless)
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
      description:
        "Gibt einen zufälligen deutschen Kinderwitz zurück. Perfekt wenn kein bestimmtes Thema gewünscht wird. Für Kinder von 4–12 Jahren.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    () => {
      const witz = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        content: [
          {
            type: "text",
            text: `Kategorie: ${witz.kategorie}\n\n❓ ${witz.frage}\n\n😄 ${witz.antwort}`,
          },
        ],
      };
    }
  );

  // Tool 2: Witz nach Kategorie
  server.registerTool(
    "witz_nach_kategorie",
    {
      title: "Kinderwitz nach Kategorie",
      description:
        "Gibt einen deutschen Kinderwitz aus einer bestimmten Kategorie zurück. Verfügbare Kategorien: Tiere, Schule, Essen, Familie, Sport, Fantasie",
      annotations: { readOnlyHint: true, openWorldHint: false },
      inputSchema: z.object({
        kategorie: z
          .enum(["Tiere", "Schule", "Essen", "Familie", "Sport", "Fantasie"])
          .describe(
            "Die gewünschte Kategorie. Erlaubt: Tiere, Schule, Essen, Familie, Sport, Fantasie"
          ),
      }),
    },
    ({ kategorie }) => {
      const gefiltert = jokes.filter((j) => j.kategorie === kategorie);
      if (gefiltert.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Keine Witze in der Kategorie "${kategorie}" gefunden.`,
            },
          ],
        };
      }
      const witz = gefiltert[Math.floor(Math.random() * gefiltert.length)];
      return {
        content: [
          {
            type: "text",
            text: `Kategorie: ${witz.kategorie}\n\n❓ ${witz.frage}\n\n😄 ${witz.antwort}`,
          },
        ],
      };
    }
  );

  // Tool 3: Witz nach Stichwort suchen
  server.registerTool(
    "witz_suchen",
    {
      title: "Kinderwitz nach Stichwort suchen",
      description:
        "Sucht deutsche Kinderwitze nach einem Stichwort (z.B. 'Elefant', 'Hausaufgaben', 'Pizza', 'Drachen')",
      annotations: { readOnlyHint: true, openWorldHint: false },
      inputSchema: z.object({
        stichwort: z
          .string()
          .min(2)
          .max(50)
          .describe("Das Stichwort für die Suche, z.B. 'Elefant' oder 'Schule'"),
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
      if (ergebnisse.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Keine Witze mit dem Stichwort "${stichwort}" gefunden. Versuche ein anderes Wort!`,
            },
          ],
        };
      }
      const witz = ergebnisse[Math.floor(Math.random() * ergebnisse.length)];
      return {
        content: [
          {
            type: "text",
            text: `Gefunden für "${stichwort}" (${ergebnisse.length} Treffer):\n\n❓ ${witz.frage}\n\n😄 ${witz.antwort}`,
          },
        ],
      };
    }
  );

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Health Check — für Railway und OpenAI-Reviewer
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    name: "Kinderwitzemaschine",
    version: "1.0.0",
    jokes_count: jokes.length,
    categories: ["Tiere", "Schule", "Essen", "Familie", "Sport", "Fantasie"],
  });
});

// Datenschutz-Seite — Pflicht für OpenAI App Submission
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
