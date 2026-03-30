import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🔥 GERA PROMPT PARA VEO3
function gerarPromptVeo3(cenas) {
  return `
Create a cinematic short video:

${cenas.map((c, i) => `
Scene ${i + 1}:
${c.cena}
Text overlay: "${c.texto}"
Voice over: "${c.narracao}"
`).join('\n')}

Style:
Realistic, TikTok style, handheld camera.
`;
}

// 🔥 ROTA PRINCIPAL
app.post("/gerar", async (req, res) => {
  const { produto } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "Você cria roteiros de vídeos virais para TikTok."
        },
        {
          role: "user",
          content: `Crie 3 cenas para vender: ${produto}. Responda em JSON com: cena, texto e narracao.`
        }
      ]
    });

    const texto = response.choices[0].message.content;
    const json = JSON.parse(texto);

    const promptVeo3 = gerarPromptVeo3(json);

    res.json({
      cenas: json,
      prompt_veo3: promptVeo3
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro na IA" });
  }
});

// 🔥 TESTE
app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
