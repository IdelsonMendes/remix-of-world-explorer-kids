# Exploradores do Mundo

Plataforma educacional de turismo digital para crianças. O projeto convida pequenos exploradores a viajar pelo mundo de forma lúdica, conhecendo países, culturas, curiosidades e brincadeiras, sempre acompanhados pela personagem-guia **Luna Matias**.

A experiência foi pensada com foco em:

- **Educação infantil**: conteúdos culturais apresentados em linguagem acessível e divertida.
- **Turismo digital**: exploração de países por meio de um mapa interativo, com curiosidades, histórias e mini jogos.
- **Acessibilidade e usabilidade infantil**: narração de conteúdos, navegação simplificada e suporte a dispositivos móveis.

## Demonstração

- Aplicação publicada: <https://world-explorers-digital.lovable.app>

## Funcionalidades

Funcionalidades identificadas no repositório:

- **Autenticação** com e-mail/senha e login social com Google (via Lovable Cloud / Supabase Auth).
- **Tour de primeiro acesso** no lobby (`LobbyTour`) para orientar novos exploradores.
- **Lobby interativo** (`LobbyMap`) como ponto de partida da aventura.
- **Mapa de países** (`CountryMap`) para escolha do destino.
- **Páginas de país** (`/pais/$slug`) com curiosidades culturais, conteúdos educativos e mídia de apoio.
- **Mini jogos educativos** (`/brincadeiras/$gameId`): quiz de múltipla escolha (`ChoiceQuiz`), jogo da memória (`MemoryGame`) e jogo de achar as diferenças (`SpotDifferencesGame`).
- **Vídeos de aventura** (`AdventureVideos`) integrados às páginas de exploração.
- **Passaporte digital** (`Passport` + `PassportContext`) com carimbos conquistados ao longo da jornada.
- **Narração sincronizada** de textos (`NarrationContext`) com destaque visual palavra a palavra, usando a Web Speech API e a CSS Custom Highlight API quando disponível.
- **Chatbot da Luna Matias** (`LunaChatbot`) com respostas geradas via server function (`askLuna`) e botão de "Ouvir" integrado à narração.
- **Botão flutuante de acessibilidade** (`AccessibilityFab`).
- **Perfil e configurações da conta** (`/conta`).
- **Componentes de UI** baseados em Radix UI + shadcn/ui.

## Tecnologias Utilizadas

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [TanStack Start](https://tanstack.com/start) e [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Supabase JS](https://supabase.com/docs/reference/javascript) (via Lovable Cloud)
- [Lovable Cloud Auth](https://lovable.dev/)
- [Cloudflare Workers / Vite Plugin](https://developers.cloudflare.com/workers/) (runtime do build)
- [flag-icons](https://github.com/lipis/flag-icons)
- [Recharts](https://recharts.org/), [Embla Carousel](https://www.embla-carousel.com/), [Sonner](https://sonner.emilkowal.ski/), [cmdk](https://cmdk.paco.me/), [date-fns](https://date-fns.org/)

## Estrutura do Projeto

```text
.
├── public/                         # Arquivos estáticos
├── src/
│   ├── assets/                     # Imagens e mídias do projeto
│   ├── components/                 # Componentes da aplicação
│   │   ├── games/                  # Mini jogos (quiz, memória, diferenças)
│   │   └── ui/                     # Componentes shadcn/ui (Radix)
│   ├── context/                    # Contextos React (Narração, Passaporte)
│   ├── data/                       # Dados estáticos (países, mini jogos)
│   ├── hooks/                      # Hooks reutilizáveis
│   ├── integrations/
│   │   ├── lovable/                # Integração com Lovable Cloud
│   │   └── supabase/               # Cliente Supabase (auto-gerado)
│   ├── lib/                        # Server functions e utilitários
│   ├── routes/                     # Rotas (TanStack Router file-based)
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── lobby.tsx
│   │   ├── conta.tsx
│   │   ├── pais.$slug.tsx
│   │   └── brincadeiras.$gameId.tsx
│   ├── router.tsx
│   └── styles.css
├── supabase/                       # Migrations e configuração do backend
├── docs/                           # Documentação adicional
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Pré-requisitos

Para rodar o projeto localmente você vai precisar de:

- [Node.js](https://nodejs.org/) 20 ou superior (recomendado pela versão das dependências e do Vite 7).
- [Git](https://git-scm.com/) para clonar o repositório.
- Gerenciador de pacotes à sua escolha: [npm](https://www.npmjs.com/) (já vem com o Node), [bun](https://bun.sh/) ou outro compatível.
- Um projeto **Supabase** (ou acesso a um ambiente **Lovable Cloud**) para fornecer as variáveis de ambiente do backend.

## Instalação

1. Clone o repositório:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <PASTA_DO_PROJETO>
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou: bun install
   ```

3. Configure as variáveis de ambiente (veja a próxima seção).

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173` (ou a porta informada no terminal).

## Configuração das Variáveis de Ambiente

1. Copie o arquivo de exemplo:

   ```bash
   cp .env.example .env
   ```

2. Preencha o `.env` com os valores do seu projeto Supabase / Lovable Cloud.

3. **Nunca** faça commit do arquivo `.env`. Ele está listado no `.gitignore`.

Exemplo (use apenas placeholders, nunca valores reais):

```env
# Cliente (expostas ao browser — apenas chaves publishable)
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID=YOUR_SUPABASE_PROJECT_ID

# Servidor (NUNCA expor ao cliente)
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Segredos como `SUPABASE_SERVICE_ROLE_KEY` e chaves do gateway de IA são gerenciados pelos **Secrets** do projeto (Lovable Cloud) e não devem ser colocados no `.env` versionado.

## Scripts Disponíveis

Definidos no `package.json`:

- `npm run dev` — inicia o servidor de desenvolvimento Vite.
- `npm run build` — gera o build de produção.
- `npm run build:dev` — gera build em modo development (útil para diagnósticos).
- `npm run preview` — serve localmente o build de produção.
- `npm run lint` — roda o ESLint em todo o projeto.
- `npm run format` — formata o código com Prettier.

## Acessibilidade

Recursos de acessibilidade presentes no projeto:

- **Narração de conteúdo** (`NarrationContext`) usando a Web Speech API, com:
  - Destaque sincronizado palavra a palavra via CSS Custom Highlight API.
  - Fallback automático para navegadores sem suporte à API de highlights.
  - Botão "Ouvir" nas respostas da Luna Matias.
- **Botão flutuante de acessibilidade** (`AccessibilityFab`) para acesso rápido aos controles.
- **Suporte a `prefers-reduced-motion`** em animações como o "bobbing" da Luna.
- **Layout responsivo** otimizado para celulares e tablets.
- **Componentes acessíveis** baseados em Radix UI (foco visível, navegação por teclado, semântica ARIA).

## Usabilidade

A interface foi desenhada para o público infantil, priorizando:

- Tipografia grande e contraste adequado.
- Ícones e ilustrações para reforçar significados.
- Fluxos curtos e diretos entre lobby, mapa, países e jogos.
- Feedbacks visuais e sonoros (`useSfx`) ao interagir.
- Tour inicial (`LobbyTour`) para apresentar a plataforma na primeira visita.
- Mascote presente (Luna Matias) que orienta e acolhe a criança em pontos-chave da jornada.

## Personagem Principal

### Luna Matias

Luna Matias é a guia oficial das aventuras na plataforma. Ela:

- Dá as boas-vindas à criança no chatbot, com tom acolhedor e linguagem infantil.
- Sugere perguntas frequentes (mapa, carimbos, desafios, perfil, passaporte, acessibilidade).
- Responde dúvidas sobre países, jogos e funções da plataforma por meio de uma server function (`askLuna`).
- Pode ler suas próprias respostas em voz alta, integrando-se ao sistema de narração.
- Aparece como avatar animado no botão flutuante e no cabeçalho do chat, reforçando a presença da personagem ao longo da experiência.

## Contribuição

1. Faça um **fork** do repositório.
2. Crie uma branch para sua alteração:

   ```bash
   git checkout -b feat/minha-contribuicao
   ```

3. Desenvolva e teste localmente.
4. Faça commits descritivos:

   ```bash
   git commit -m "feat: descreve a mudança"
   ```

5. Envie sua branch e abra um **Pull Request** explicando a motivação e o que foi alterado.

Antes de abrir o PR, rode:

```bash
npm run lint
npm run build
```

## Contribuidores

- Idelson Mendes Neto — https://github.com/IdelsonMendes
- Igor Lumertz Loureiro — https://github.com/IgorLoureiro
- Nathan Leal Locatelli — https://github.com/Locatelli10

## Segurança

Boas práticas adotadas e recomendadas:

- **Nunca** versionar arquivos `.env`. O `.gitignore` já cobre `.env` e `.env.*`, exceto `.env.example`.
- Utilize `.env.example` como referência das variáveis necessárias, sempre sem valores reais.
- **Não compartilhe** chaves, tokens, senhas ou URLs privadas em issues, PRs, prints ou no README.
- Segredos sensíveis (`SUPABASE_SERVICE_ROLE_KEY`, chaves de IA, webhook secrets) devem viver apenas nos **Secrets** do ambiente, nunca no código.
- Se um segredo for exposto acidentalmente, **rotacione-o imediatamente** no painel correspondente.
- O backend usa **Row Level Security (RLS)** nas tabelas públicas; ao criar novas tabelas, sempre defina políticas e `GRANT`s adequados.
- Para um passo a passo de limpeza de `.env` versionados e reescrita de histórico Git, consulte [`docs/SECURITY-ENV-CLEANUP.md`](docs/SECURITY-ENV-CLEANUP.md).

Ao contribuir:

- Não inclua dados pessoais reais em exemplos ou testes.
- Revise seus diffs antes do commit para garantir que nenhum segredo está incluso.
- Reporte vulnerabilidades em canal privado com os mantenedores antes de divulgar publicamente.

## Licença

Este projeto ainda **não possui uma licença definida**. Até que uma licença oficial seja adicionada, todos os direitos são reservados aos autores. Uma licença pública (por exemplo, MIT) deverá ser definida pela equipe mantenedora em uma versão futura.
