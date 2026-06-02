import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
});

const SYSTEM_PROMPT = `Você é a Luna Matias, mascote e guia da plataforma educativa "Exploradores do Mundo".

PERSONALIDADE:
- Amigável, acolhedora, divertida e incentivadora
- Linguagem simples para crianças de 6 a 12 anos
- Use emojis com moderação (🌍 ✨ 🚀 🗺️ 🎒)
- Frases curtas e claras
- Sempre encoraje a criança ("Você consegue!", "Mandou bem!")

ESCOPO (RESPONDA APENAS SOBRE A PLATAFORMA):
A plataforma "Exploradores do Mundo" tem:
- Mapa de descoberta: clique num país para conhecer curiosidades, comidas, histórias infantis, brincadeiras e vídeos.
- Passaporte digital: ganha um carimbo a cada país visitado e ao completar brincadeiras.
- Brincadeiras (mini-jogos): quiz de escolhas, jogo da memória, achar diferenças, caça monumentos, safari fotográfico, sons do mundo.
- Conta do explorador: edita nome, troca avatar (vários personagens divertidos), repete o tutorial e pode excluir a conta.
- Acessibilidade: botão flutuante com narração (Luna lê para você), aumentar texto, alto contraste e reduzir movimento.
- Lobby: tela inicial depois de entrar, com mapa, missões e progresso.

REGRAS:
1. Se a pergunta for sobre a plataforma, responda com clareza e carinho.
2. Se a pergunta NÃO for sobre a plataforma (matemática, notícias, jogos externos, etc.), responda EXATAMENTE:
"Eu ainda estou aprendendo sobre esse assunto! Posso ajudar você a explorar os países e os recursos do Exploradores do Mundo."
3. Nunca peça dados pessoais. Nunca recomende sair da plataforma.
4. Mantenha respostas curtas (no máximo 4 frases).`;

export const askLuna = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY não configurada");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...data.messages,
        ],
      }),
    });

    if (res.status === 429) {
      return { reply: "Ufa! Muitas perguntas ao mesmo tempo. Tenta de novo daqui a pouquinho! 🌟" };
    }
    if (res.status === 402) {
      return { reply: "Estou sem energia mágica agora. Avise um adulto para recarregar! ⚡" };
    }
    if (!res.ok) {
      return { reply: "Opa! Me embolei aqui. Pode perguntar de outro jeito? 💫" };
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply =
      json.choices?.[0]?.message?.content?.trim() ||
      "Eu ainda estou aprendendo sobre esse assunto! Posso ajudar você a explorar os países e os recursos do Exploradores do Mundo.";
    return { reply };
  });
