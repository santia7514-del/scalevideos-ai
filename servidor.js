import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ROTA PRINCIPAL (TESTE)
app.get("/", (req, res) => {
  res.send("Servidor rodando");
});

// ROTA DE GERAÇÃO
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
- Gancho forte
- Desenvolvimento
- CTA final

Texto simples, direto e altamente envolvente.`
});
- Desenvolvimento
- CTA final
Texto simples, direto e altamente envolvente.`
        }
      ]
    });

    res.json({
      sucesso: true,
      resultado: resposta.choices[0].message.content
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao gerar roteiro" });
  }
});

// PORTA (OBRIGATÓRIO NO RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
