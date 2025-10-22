# 💊 Lembretes de Saúde - Assistente Pessoal

![Coração com um pulso a indicar cuidados de saúde](https://img.icons8.com/color/96/like--v1.png)

Um aplicativo web completo (**Frontend + Backend**) desenvolvido para ajudar utilizadores e cuidadores a gerir compromissos médicos e a toma de medicamentos de forma simples, eficaz e personalizada.  
A interface é **limpa, moderna e acessível**, ideal para todas as idades.

O projeto suporta **múltiplos utilizadores** com registo e login seguro (passwords com hash e JWT), garantindo que os dados de cada pessoa permaneçam privados.  
Construído como um **Progressive Web App (PWA)**, permite a "instalação" no ecrã inicial para uma experiência otimizada em dispositivos móveis.

---

## ✨ Funcionalidades

O projeto é um **monorepo** com frontend (React/Vite) e backend (Node.js/Express) separados, oferecendo:

### 👤 Autenticação & Segurança
- **Registo Seguro:** Criação de contas com email e password (hash segura com bcrypt).  
- **Login Protegido:** Autenticação via JWT (JSON Web Tokens) com tempo de expiração.  
- **Rotas Protegidas:** Acesso às funcionalidades principais apenas para utilizadores autenticados (middleware no backend e ProtectedRoute no frontend).  
- **Dados Privados:** Cada utilizador só acede aos seus próprios dados (consultas/medicamentos).  
- **Logout:** Terminar sessão de forma segura.

---

### 🩺 Consultas Médicas
- **Agendamento Detalhado:** Adicione consultas (paciente, especialidade, médico, data/hora, local).  
- **Visualização Clara:** Listagem das consultas agendadas em cartões informativos.  
- **Gestão Completa (CRUD):** Edite detalhes ou remova consultas existentes.  
- **Status de Comparecimento:** Marque consultas passadas como "Compareceu" ou "Não Compareceu".

---

### 💊 Lembretes de Medicamentos
- **Criação Flexível:** Adicione medicamentos (dosagem, frequência textual, horário de início, data final opcional).  
- **Gestão Completa (CRUD):** Edite ou remova lembretes facilmente.  
- **Cálculo Inteligente de Próxima Dose:** O sistema exibe o horário da próxima toma com base na frequência, tornando o lembrete mais prático.

---

### 📅 Painel e Notificações
- **Dashboard:** Visão geral rápida das consultas e próximas doses de medicamentos do dia.  
- **Página de Notificações:** Linha do tempo unificada e cronológica (Hoje, Amanhã, Próximos Dias) de todos os eventos futuros.  
- **Histórico Completo:** Visualize eventos passados (consultas e medicamentos), incluindo o status de comparecimento das consultas.

---

### 📱 Experiência PWA
- **Instalável:** Adicione ao ecrã inicial em Android e iOS para acesso rápido.  
- **Ícones Personalizados:** Favicon e ícones de PWA consistentes com a identidade visual.  
- **Offline Básico:** Acesso à interface mesmo sem ligação (cache de Service Worker).

---

## 🛠️ Tecnologias Utilizadas

### 🧩 Frontend (packages/frontend)
- **Framework:** React 18+ (com Vite)  
- **Linguagem:** TypeScript  
- **Estilização:** Tailwind CSS  
- **Componentes UI:** ShadCN/UI (Radix UI + Tailwind)  
- **Roteamento:** React Router DOM v6  
- **Datas/Horas:** date-fns  
- **Descodificação JWT:** jwt-decode  
- **PWA:** vite-plugin-pwa  

---

### ⚙️ Backend (packages/backend)
- **Runtime:** Node.js (v18+)  
- **Framework:** Express  
- **Linguagem:** TypeScript  
- **ORM:** Prisma  
- **Base de Dados:** PostgreSQL (Produção no Render, Desenvolvimento com Docker)  
- **Autenticação:** bcrypt (Hashing) + jsonwebtoken (JWT)  
- **Validação:** Middleware CORS configurável via variáveis de ambiente  
- **Variáveis de Ambiente:** dotenv  

---

### 🏗️ Monorepo & Ferramentas
- **Estrutura:** npm Workspaces  
- **Scripts Paralelos:** Concurrently  
- **Controlo de Versões:** Git & GitHub  

---

## ☁️ Deploy & Infraestrutura
- **Frontend:** Vercel (CI/CD a partir do GitHub)  
- **Backend:** Render (Web Service com CI/CD a partir do GitHub)  
- **Base de Dados (Produção):** Render PostgreSQL (plano gratuito)  
- **Ambiente Local:** Docker & Docker Compose (para base de dados PostgreSQL)

---

## 🚀 Como Começar (Desenvolvimento Local)

### 🔧 Pré-requisitos
- Node.js (v18 ou superior)  
- npm (v7 ou superior, para suporte a workspaces)  
- Docker Desktop  
- Git  

---

### 🧭 Passos de Instalação

# 1. Clone o repositório
git clone https://github.com/ViniDuarteR/lembretes-app.git
cd lembretes-app

# 2. Instale todas as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie o ficheiro .env dentro de packages/backend com:
DATABASE_URL="postgresql://vinicius:password@localhost:5432/lembretes_db"
JWT_SECRET="gere_uma_chave_secreta_forte_e_unica_aqui"
FRONTEND_URL="http://localhost:5173"

# 4. Inicie a base de dados Docker
docker-compose up -d db

# 5. Aplique as migrações Prisma
cd packages/backend
npx prisma migrate dev

# 6. Inicie os servidores de desenvolvimento
cd ../..
npm run dev

# 7. Aceda no navegador
http://localhost:5173

---

## ☁️ Deploy

### 🌐 Frontend (Vercel)
VITE_API_URL=https://lembretes-app.onrender.com

### 🖥️ Backend (Render)
DATABASE_URL=<Internal Connection String do Render PostgreSQL>  
FRONTEND_URL=https://lembretes-app-frontend.vercel.app  
JWT_SECRET=<chave secreta>

---

## 📂 Estrutura do Projeto (Simplificada)
/
lembretes-app
├── packages/
│   ├── frontend/     # Código React (Páginas, Componentes, Libs)
│   └── backend/      # Código Node.js (Servidor, Prisma, Middleware)
├── .dockerignore
├── .gitignore
├── docker-compose.yml # Base de dados local
├── package.json       # Configuração do Monorepo (Workspaces)
└── README.md          # Este ficheiro

---

## 🧾 Licença
Distribuído sob a **Licença MIT**.  
Consulte o ficheiro LICENSE para mais informações (se aplicável).

---

## 💡 Autor
👨‍💻 **Vinicius Duarte Rosa**  
GitHub: https://github.com/ViniDuarteR  

💬 “Cuidar da saúde nunca foi tão simples — tecnologia a serviço do bem-estar.”
