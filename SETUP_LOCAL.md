# 🚀 Guia de Instalação Local - Pedreira Transparente

Siga este guia passo a passo para rodar a plataforma de transparência e auditoria cidadã localmente em sua máquina.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 22+** - [Download](https://nodejs.org/)
- **pnpm 10+** - Instale com: `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)
- **MySQL 8.0+** ou **MariaDB 10.5+** - [Download](https://dev.mysql.com/downloads/mysql/)

### Verificar instalação

```bash
node --version      # Deve mostrar v22.x.x ou superior
pnpm --version      # Deve mostrar 10.x.x ou superior
git --version       # Deve mostrar git version 2.x.x ou superior
mysql --version     # Deve mostrar mysql Ver 8.0 ou superior
```

---

## 1️⃣ Clonar o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/pedreira-transparente.git

# Entre no diretório
cd pedreira-transparente
```

---

## 2️⃣ Instalar Dependências

```bash
# Instale todas as dependências do projeto
pnpm install

# Aguarde a conclusão (pode levar alguns minutos)
```

---

## 3️⃣ Configurar Banco de Dados

### Opção A: Usar Supabase (Recomendado)

Se você já tem uma conta Supabase:

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto ou use um existente
3. Vá para **Settings → Database** e copie a connection string
4. Vá para **Settings → API** e copie:
   - `Project URL` (SUPABASE_URL)
   - `anon public` (SUPABASE_ANON_KEY)
   - `service_role` (SUPABASE_SERVICE_ROLE_KEY)

### Opção B: Usar MySQL Local

Se preferir usar MySQL instalado localmente:

```bash
# Conecte ao MySQL
mysql -u root -p

# Crie um banco de dados
CREATE DATABASE pedreira_transparente;
CREATE USER 'pedreira'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON pedreira_transparente.* TO 'pedreira'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

A connection string será:
```
mysql://pedreira:sua_senha_segura@localhost:3306/pedreira_transparente
```

---

## 4️⃣ Configurar Variáveis de Ambiente

### Criar arquivo `.env.local`

Na raiz do projeto, crie um arquivo `.env.local`:

```bash
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@localhost:3306/pedreira_transparente

# Supabase (se usar)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=seu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key-aqui

# Autenticação OAuth Manus (obtenha em https://manus.im)
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# JWT Secret (gere uma string aleatória segura)
JWT_SECRET=sua-chave-secreta-super-segura-aqui-minimo-32-caracteres

# Informações do Proprietário
OWNER_NAME=Seu Nome
OWNER_OPEN_ID=seu-open-id

# APIs Manus (obtenha em seu painel Manus)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api-aqui
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua-chave-frontend-aqui

# Analytics (opcional)
VITE_ANALYTICS_ENDPOINT=https://analytics.manus.im
VITE_ANALYTICS_WEBSITE_ID=seu-website-id

# App Config
VITE_APP_TITLE=Boca Aberta
VITE_APP_LOGO=/logo.png
```

**⚠️ Importante:** Nunca compartilhe seu arquivo `.env.local`. Adicione-o ao `.gitignore`.

---

## 5️⃣ Executar Migrations do Banco de Dados

```bash
# Gerar e aplicar migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Verificar se as tabelas foram criadas
mysql -u pedreira -p pedreira_transparente -e "SHOW TABLES;"
```

---

## 6️⃣ Iniciar o Servidor de Desenvolvimento

```bash
# Inicie o servidor (frontend + backend)
pnpm dev
```

Você verá uma saída similar a:

```
[OAuth] Initialized with baseURL: https://api.manus.im
Server running on http://localhost:3000/
```

---

## 7️⃣ Acessar a Plataforma

Abra seu navegador e acesse:

```
http://localhost:3000
```

Você verá a homepage da plataforma "Boca Aberta" com:
- ✅ Manchete principal
- ✅ Seção "Destaques do Dia"
- ✅ Navegação para Relatórios, Denúncias e Estatísticas
- ✅ Painel Admin (com login)

---

## 🧪 Executar Testes

```bash
# Rodar todos os testes unitários
pnpm test

# Rodar testes em modo watch (reexecuta ao salvar)
pnpm test --watch

# Rodar teste específico
pnpm test server/routers.test.ts
```

Você deve ver:

```
✓ Test Files  6 passed (6)
✓ Tests  31 passed (31)
```

---

## 🔍 Verificar Saúde do Projeto

```bash
# Verificar erros TypeScript
pnpm check

# Formatar código
pnpm format

# Build para produção
pnpm build
```

---

## 📱 Estrutura de Pastas

```
pedreira-transparente/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas principais
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── App.tsx           # Roteamento
│   │   └── index.css         # Estilos globais
│   └── public/               # Arquivos estáticos
├── server/                    # Backend Express + tRPC
│   ├── routers.ts            # APIs tRPC
│   ├── db.ts                 # Query helpers
│   └── email-notifier.ts     # Notificações por email
├── drizzle/                   # Schema do banco de dados
│   └── schema.ts             # Definição de tabelas
├── .env.local                # Variáveis de ambiente (NÃO COMMITAR)
├── package.json              # Dependências
└── README.md                 # Documentação
```

---

## 🎯 Funcionalidades Principais

### 🏠 Homepage
- Manchete principal com call-to-action
- Seção "Destaques do Dia"
- Links para Relatórios, Denúncias e Estatísticas

### 📄 Página de Relatórios
- Busca full-text em relatórios
- Filtros por tipo (Diário Oficial, PLO, Decreto, etc.)
- Filtros por data
- Paginação

### 🚨 Página de Denúncias
- Formulário com seletor de severidade
- Upload de evidências (PDFs)
- Número de protocolo único
- Rastreamento de status

### 📊 Página de Estatísticas
- Gráficos de denúncias por severidade
- Gráficos de denúncias por status
- Gráficos de relatórios por tipo
- Métricas em tempo real

### 👤 Painel Admin
- Autenticação OAuth
- Gerenciamento de relatórios
- Gerenciamento de denúncias
- Dashboard com estatísticas

### 📧 Notificações por Email
- Novos relatórios publicados
- Atualizações de denúncias
- Denúncias críticas
- Inscrição em notificações

---

## 🔧 Troubleshooting

### Erro: "Cannot find module 'drizzle-orm'"

```bash
# Reinstale as dependências
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Connection refused" ao conectar ao banco

```bash
# Verifique se MySQL está rodando
mysql -u root -p

# Verifique a DATABASE_URL no .env.local
# Formato: mysql://usuario:senha@host:porta/database
```

### Erro: "OAuth not initialized"

```bash
# Verifique as variáveis de ambiente:
# - VITE_APP_ID
# - OAUTH_SERVER_URL
# - JWT_SECRET
```

### Porta 3000 já em uso

```bash
# Use outra porta
PORT=3001 pnpm dev

# Ou mate o processo na porta 3000
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Recursos Úteis

- **Documentação Drizzle ORM:** https://orm.drizzle.team/
- **Documentação tRPC:** https://trpc.io/
- **Documentação React:** https://react.dev/
- **Documentação Tailwind CSS:** https://tailwindcss.com/
- **Documentação Supabase:** https://supabase.com/docs

---

## 🚀 Deploy para Produção

Para fazer deploy da plataforma:

1. **Manus:** Use o botão "Publish" no painel de controle
2. **Vercel:** `vercel deploy`
3. **Railway:** `railway deploy`
4. **Docker:** Veja `Dockerfile` no projeto

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique o arquivo `.env.local`
2. Verifique se o banco de dados está rodando
3. Verifique os logs: `pnpm dev` mostra erros em tempo real
4. Execute `pnpm check` para validar TypeScript
5. Execute `pnpm test` para validar funcionalidades

---

## ✅ Checklist Final

- [ ] Node.js 22+ instalado
- [ ] pnpm instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Banco de dados criado
- [ ] `.env.local` configurado
- [ ] Migrations aplicadas
- [ ] Servidor iniciado (`pnpm dev`)
- [ ] Página acessível em `http://localhost:3000`
- [ ] Testes passando (`pnpm test`)

Parabéns! 🎉 Você tem a plataforma Pedreira Transparente rodando localmente!
