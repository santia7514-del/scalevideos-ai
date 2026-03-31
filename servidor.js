import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Cliente OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota principal
app.post("/gerar", async (req, res) => {
  try {
    const { tema } = req.body;

    if (!tema) {
      return res.status(400).json({ erro: "Tema é obrigatório" });
    }

    const resposta = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Crie um roteiro viral de vídeo curto para TikTok sobre: ${tema}.

Estrutura:
- Gancho forte (primeiros 3 segundos chamativos)
- Desenvolvimento (mostrando o produto em uso)
- CTA final (chamada clara para ação)

Texto simples, direto, envolvente e focado em conversão.`
    });

    const texto = resposta.output[0].content[0].text;

    res.json({
      success: true,
      resultado: texto,
    });

  } catch (erro) {
    console.error("ERRO:", erro);
    res.status(500).json({ erro: "Erro ao gerar roteiro" });
  }
});

// Porta obrigatória do Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
