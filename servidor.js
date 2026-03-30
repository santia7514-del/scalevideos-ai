import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

app.post("/gerar", async (req, res) => {
  const { produto } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: `
Crie um roteiro de vídeo para o produto: ${produto}

Responda SOMENTE em JSON válido:
{
  "roteiro": "texto geral",
  "cenas": [
    {"cena": 1, "texto": "", "narracao": ""},
    {"cena": 2, "texto": "", "narracao": ""},
    {"cena": 3, "texto": "", "narracao": ""}
  ],
  "legenda": ""
}
`
        }
      ]
    });

    const texto = response.choices[0].message.content;

    let json;

    try {
      json = JSON.parse(texto);
    } catch (e) {
      return res.status(500).json({
        erro: "Erro ao converter JSON",
        resposta: texto
      });
    }

    const promptVeo3 = gerarPromptVeo3(json.cenas);

    res.json({
      ...json,
      prompt_veo3: promptVeo3
    });

  } catch (e) {
    res.status(500).json({ erro: "Erro na IA" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});
