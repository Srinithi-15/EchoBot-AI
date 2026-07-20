import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazily to avoid crashing if API key is not set immediately
  let ai: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not defined. Using mock fallback mode.");
        return null;
      }
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  }

  // API endpoint for chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const client = getGeminiClient();
      
      if (!client) {
        // Fallback simulation responses if API key is not configured yet
        const fallbacks = [
          `EchoBot AI standing by. I received your transmission: "${message}". Systems are operating in offline mode.`,
          `Synchronizing voice matrices. Regarding "${message}": My cognitive pathways recommend proceeding with optimal efficiency.`,
          `Acknowledge. Your inputs are registered. This is EchoBot AI, ready to assist with voice and text conversions.`,
          `Vocal analysis complete for: "${message}". Synthesizing holographic reply. We are fully operational.`,
          `Fascinating request! "${message}" triggers a sequence in my neuro-cores. Let us continue exploring text and voice functions.`
        ];
        const randomReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        // Let's wait a tiny bit to simulate API response latency
        await new Promise((resolve) => setTimeout(resolve, 600));
        return res.json({ reply: randomReply, isSimulated: true });
      }

      // Convert local UI history format (or incoming array) to Gemini contents format
      let contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text || turn.message || "" }]
          });
        }
      } else if (message) {
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });
      }

      // Ensure the first message is from 'user'
      while (contents.length > 0 && contents[0].role !== 'user') {
        contents.shift();
      }

      // Ensure we don't have consecutive messages from the same role
      const sanitizedContents = [];
      for (const turn of contents) {
        if (sanitizedContents.length > 0 && sanitizedContents[sanitizedContents.length - 1].role === turn.role) {
          sanitizedContents[sanitizedContents.length - 1].parts[0].text += "\n" + turn.parts[0].text;
        } else {
          sanitizedContents.push(turn);
        }
      }
      contents = sanitizedContents;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are 'EchoBot AI', a premium, intelligent voice and text communication robot. You are futuristic, friendly, helpful, and highly sophisticated. IMPORTANT RULE: If the user's input text contains grammatical errors or broken English, gracefully provide the grammatically corrected version of what they said first (e.g., 'Corrected: ...'), and then provide your helpful response. Keep your responses relatively concise (usually 1 to 3 sentences) so they can be smoothly read aloud by text-to-speech engines. Avoid lists, tables, markdown headers, code blocks, and heavy punctuation.",
          temperature: 0.7,
        }
      });

      const reply = response.text || "My verbal modules are compiling. Please try transmitting that once more.";
      res.json({ reply });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to formulate response from neuro-core." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
