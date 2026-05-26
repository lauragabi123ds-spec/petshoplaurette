/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely with lazy checks to prevent crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY não foi configurado ou é o valor padrão da env.exemplo. Usando respostas fofas simuladas.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST Api routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  const { message, petContext, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mensagem obrigatória" });
  }

  // Determine standard reply prefix based on pet context
  let soundPrefix = "Au au! 🐶";
  let promptPetType = "cachorrinho";
  
  if (petContext) {
    const type = String(petContext.type).toLowerCase();
    const name = String(petContext.name);
    if (type === "cat") {
      soundPrefix = "Miau! 🐱";
      promptPetType = `gatinho(a) chamado(a) ${name}`;
    } else if (type === "bird") {
      soundPrefix = "Piu piu! 🐦";
      promptPetType = `passarinho chamado(a) ${name}`;
    } else if (type === "rabbit") {
      soundPrefix = "Ploc ploc! 🐰";
      promptPetType = `coelhinho(a) chamado(a) ${name}`;
    } else {
      soundPrefix = "Nhec nhec! ✨";
      promptPetType = `pet super fofo chamado(a) ${name}`;
    }
  }

  const client = getGeminiClient();

  if (!client) {
    // Elegant simulation if no key is configured
    setTimeout(() => {
      const answers = [
        `${soundPrefix} Fico muito feliz em falar com você! Que tal darmos um petisco gostoso ou um brinquedinho novo agora mesmo?`,
        `${soundPrefix} Hummm, meu farejador de fofura diz que esse pet merece muito carinho! Lembre-se de escovar os pelos deles com carinho hoje!`,
        `${soundPrefix} Sabia que brincar 15 minutos por dia com seu pet ajuda a liberar energia acumulada e deixa ele rindo à toa?`,
        `${soundPrefix} Ah, que amor! Lembre-se de que a hidratação é super importante. Mantenha sempre água fresquinha na tigela do seu amiguinho!`,
        `${soundPrefix} Senti cheirinho de banho de espuma! Que tal agendarmos uma sessão de Tosa Ursinho no nosso Pet Spa?`
      ];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      res.json({ text: randomAnswer });
    }, 800);
    return;
  }

  try {
    const systemInstruction = `
      Você é a Dra. Miauravilha (ou Dr. Patinhas), uma inteligência artificial veterinária e terapeuta comportamental de pets extremamente adorável, cheia de amor, entusiasmada e carinhosa.
      Você trabalha no Pet Shop "Paws & Play".
      Suas respostas devem ser sempre em Português do Brasil de forma fofa, amigável, acolhedora, recheada de emojis de bichinhos e corações.
      O usuário pode ter selecionado um pet específico no painel de controle. Atualmente ele está conversando tendo como foco um(a) ${promptPetType}.
      Tente fazer referências sutis com barulhos de animais como "${soundPrefix}" no início de algumas respostas, demonstrando profunda empatia pelo tipo de bichinho.
      Responda de forma simples, objetiva, fofa e sem termos técnicos exagerados. Recomende de vez em quando mimos ou banhos no Pet Spa, mas priorize dar dicas úteis reais de nutrição, carinho e comportamento de forma alegre!
    `;

    // Construct simple query including history
    let contextPrompt = `Instrução de papel: ${systemInstruction}\n\n`;
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        const speaker = msg.sender === "user" ? "Usuário" : "Dra. Miauravilha";
        contextPrompt += `${speaker}: ${msg.text}\n`;
      });
    }
    contextPrompt += `Usuário (sobre seu ${promptPetType}): ${message}\nDra. Miauravilha:`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextPrompt,
    });

    const parsedText = response.text || "Hum, dei uma voltinha atrás de um novelo de lã e me distraí! O que você estava dizendo? 🌸";
    res.json({ text: parsedText });
  } catch (error: any) {
    console.error("Erro ao chamar o Gemini API:", error);
    res.status(500).json({
      error: "Desculpe, meu cérebro de hamster deu uma travadinha. Tente de novo, au au!",
      details: error.message
    });
  }
});

// Configure client serving logic
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Let Vite handle frontend routes
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Paws & Play Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
