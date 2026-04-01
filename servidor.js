import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Cliente OpenRouter
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Rota principal
app.post("/gerar", async (req, res) => {
  try {
    const { tema } = req.body;

    if (!tema) {
      return res.status(400).json({ erro: "Tema é obrigatório" });
    }

    const resposta = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "user",
          content: `Crie um roteiro viral de vídeo curto para TikTok sobre: ${tema}.
Estrutura:
- Gancho forte (primeiros 3 segundos chamativos)
- Desenvolvimento (mostrando o produto em uso)
- CTA final (chamada clara para ação)
Texto simples, direto, envolvente e focado em conversão.`
        }
      ]
    });

    const texto = resposta.choices[0].message.content;

    res.json({
      success: true,
      resultado: texto,
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao gerar roteiro" });
  }
});

// Porta obrigatória (Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
