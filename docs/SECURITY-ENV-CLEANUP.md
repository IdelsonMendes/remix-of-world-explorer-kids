# Limpeza de arquivos `.env` versionados

Este documento descreve, passo a passo, como remover arquivos `.env` do
versionamento Git e do histórico do repositório. **Nenhuma destas etapas foi
executada automaticamente** — todas exigem revisão humana e devem ser
realizadas em uma cópia local do repositório, com backup prévio.

> ⚠️ Reescrever o histórico Git é uma operação **destrutiva**. Coordene com
> toda a equipe antes de fazer push forçado.

---

## 1. O que já foi feito no projeto

- `.gitignore` atualizado para ignorar `.env` e `.env.*`, exceto `.env.example`.
- Criado `.env.example` com as chaves esperadas (sem valores).
- Nenhum arquivo `.env` foi apagado do disco local.

## 2. Verificar quais arquivos `.env` estão rastreados

Em uma máquina local com Git instalado e o repositório clonado:

```bash
git ls-files | grep -E '(^|/)\.env(\..*)?$' | grep -v '\.env\.example$'
```

Liste também o histórico (qualquer commit que já tenha incluído um `.env`):

```bash
git log --all --full-history --diff-filter=A --name-only -- '**/.env' '.env' '**/.env.*' '.env.*' \
  | grep -E '(^|/)\.env(\..*)?$' | grep -v '\.env\.example$' | sort -u
```

## 3. Remover do índice sem apagar o arquivo local

Para cada arquivo retornado acima (ex.: `.env`):

```bash
git rm --cached .env
# repita para cada arquivo:
# git rm --cached path/para/.env.production
```

Depois:

```bash
git commit -m "chore(security): stop tracking .env files"
git push origin <sua-branch>
```

A partir daqui o `.env` continua presente no disco mas não é mais versionado.
Novos `.env*` serão bloqueados pelo `.gitignore`.

## 4. **CRÍTICO** — rotacionar todos os segredos expostos

Considere comprometido qualquer segredo que já tenha estado em commit público,
mesmo após removê-lo do HEAD. Antes ou em paralelo à limpeza do histórico:

- Rotacione chaves de API, tokens, senhas, service-role keys, webhook secrets.
- Em Lovable Cloud, chaves publishable (`VITE_SUPABASE_PUBLISHABLE_KEY`) podem
  permanecer; segredos como `SUPABASE_SERVICE_ROLE_KEY` ou
  `LOVABLE_API_KEY` **devem ser rotacionados** se foram versionados.
- Atualize os valores nos Secrets do projeto (Settings → Secrets).

## 5. Limpeza do histórico Git (escolha **uma** ferramenta)

### Opção A — `git-filter-repo` (recomendado)

Instalação: https://github.com/newren/git-filter-repo

```bash
# 1. Clone um espelho do repositório (NÃO use seu clone de trabalho)
git clone --mirror git@github.com:<org>/<repo>.git repo-cleanup.git
cd repo-cleanup.git

# 2. Faça backup
cd ..
cp -r repo-cleanup.git repo-cleanup.git.backup
cd repo-cleanup.git

# 3. Liste os caminhos a remover em um arquivo
cat > ../paths-to-remove.txt <<'EOF'
.env
.env.local
.env.development
.env.production
.env.staging
EOF

# 4. Reescreva o histórico removendo esses caminhos
git filter-repo --invert-paths --paths-from-file ../paths-to-remove.txt

# 5. Verifique que sumiram do histórico
git log --all --full-history -- .env | head
```

### Opção B — BFG Repo Cleaner

Instalação: https://rtyley.github.io/bfg-repo-cleaner/

```bash
# 1. Clone espelhado + backup (mesmas etapas da Opção A)
git clone --mirror git@github.com:<org>/<repo>.git repo-cleanup.git
cp -r repo-cleanup.git repo-cleanup.git.backup
cd repo-cleanup.git

# 2. Remova arquivos por nome em todo o histórico
java -jar bfg.jar --delete-files '.env'
java -jar bfg.jar --delete-files '.env.*'

# 3. Limpe referências antigas
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

> Dica BFG: para apagar **valores** específicos (ex.: uma chave vazada) e não
> só arquivos, use `--replace-text segredos.txt` com uma linha por segredo.

## 6. Push forçado e coordenação com a equipe

```bash
# Dentro do espelho limpo:
git push --force --all
git push --force --tags
```

Depois do push forçado:

1. Avise toda a equipe **antes** do push.
2. Cada pessoa deve descartar clones antigos e re-clonar o repositório:
   ```bash
   cd ..
   rm -rf <repo>
   git clone git@github.com:<org>/<repo>.git
   ```
   `git pull` em clones antigos **não** é suficiente e pode reintroduzir os
   commits removidos.
3. PRs abertos baseados no histórico antigo precisam ser recriados.
4. Invalide caches de CI/CD que dependam de SHAs antigos.
5. Em GitHub/GitLab, considere abrir um chamado de suporte para limpar caches
   internos e forks que possam ainda conter o segredo.

## 7. Checklist final

- [ ] `.gitignore` ignora `.env` e `.env.*` (exceto `.env.example`).
- [ ] `.env.example` versionado, sem valores.
- [ ] `git rm --cached` aplicado a todos os `.env` rastreados.
- [ ] Segredos expostos rotacionados em todos os ambientes.
- [ ] Histórico reescrito com `git-filter-repo` ou BFG (em backup primeiro).
- [ ] Equipe avisada e clones re-feitos após o push forçado.
- [ ] Pipelines de CI/CD validados após a reescrita.

## 8. O que NÃO foi alterado

- Código da aplicação.
- Configurações do Supabase / Lovable Cloud.
- Pipelines de deploy.
- Arquivos `.env` locais (continuam no disco para o app funcionar).
