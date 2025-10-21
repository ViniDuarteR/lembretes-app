# 💊 Lembretes de Saúde - Assistente Pessoal

![Coração com um pulso a indicar cuidados de saúde](https://img.icons8.com/color/96/like--v1.png)

Um **aplicativo web completo** desenvolvido para ajudar utilizadores e cuidadores a **gerir compromissos médicos e a toma de medicamentos** de forma simples e eficaz.  
A interface é **limpa, moderna e acessível**, ideal para **todas as idades**.  

---

## ✨ Funcionalidades

O projeto está dividido em **frontend** e **backend**, que trabalham em conjunto para oferecer uma experiência completa:

### 🩺 Consultas Médicas
- **Agendamento:** Adicione novas consultas com detalhes como paciente, especialidade, médico, data, hora e local.  
- **Visualização:** Veja todas as consultas agendadas em formato de cartões informativos.  
- **Gestão Completa (CRUD):** Edite ou remova consultas existentes.  
- **Status de Comparecimento:** Marque se o paciente compareceu ou não a uma consulta.  

### 💊 Lembretes de Medicamentos
- **Criação de Lembretes:** Adicione medicamentos com informações de dosagem, frequência (ex: “de 8 em 8 horas”), horário de início e data final do tratamento.  
- **Gestão Completa (CRUD):** Edite ou remova lembretes de medicamentos.  
- **Cálculo Inteligente:** O sistema calcula e exibe automaticamente o **horário da próxima dose**, em vez de apenas o horário inicial.  

### 📅 Painel de Controle e Notificações
- **Dashboard Principal:** Resumo das consultas e próximos medicamentos do dia.  
- **Página de Notificações Unificada:** Exibe consultas e lembretes numa **linha do tempo cronológica**.  
- **Histórico:** Visualize eventos passados, incluindo o **status de comparecimento** das consultas.  

---

## 🛠️ Tecnologias Utilizadas

O projeto é um **monorepo** moderno, com as seguintes tecnologias:

### 🧩 Frontend (`packages/frontend`)
- ⚛️ **Framework:** React (com Vite)  
- 💬 **Linguagem:** TypeScript  
- 🎨 **Estilização:** Tailwind CSS  
- 🧱 **Componentes UI:** ShadCN/ui  
- 🗺️ **Roteamento:** React Router  
- 🧾 **Formulários:** React Hook Form + Zod (validação)  

### ⚙️ Backend (`packages/backend`)
- 🧠 **Framework:** Node.js + Express  
- 💬 **Linguagem:** TypeScript  
- 🧰 **ORM:** Prisma  
- 💾 **Base de Dados:** SQLite (ideal para desenvolvimento local)  
- 🚀 **Servidor de Desenvolvimento:** Nodemon  

### 🧭 Ferramentas do Monorepo
- 📦 **Gestor de Pacotes:** npm Workspaces  
- 🔄 **Execução Paralela de Scripts:** Concurrently  

---

## 🚀 Como Começar

### 🔧 Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)  
- npm (vem junto com o Node.js)

### 🧭 Passos de Instalação

1. **Clone o repositório**:
   git clone https://github.com/ViniDuarteR/lembretes-app.git
   
2. **Navegue para a pasta do projeto**:
cd lembretes-app

3. **Instale todas as dependências**:
  Este comando instala as dependências da raiz, do frontend e do backend.
npm install

4. **Configure a Base de Dados**:
cd packages/backend
npx prisma migrate dev

5. **Inicie os servidores de desenvolvimento**:
cd ../..
npm run dev

6. **Abra a aplicação no navegador**:
http://localhost:8080

📂 Estrutura do Projeto
/
├── packages/
│   ├── frontend/   # Código da aplicação React
│   └── backend/    # Código do servidor Node.js/Express
├── .gitignore
├── package.json    # Configuração principal (workspaces)
└── README.md
🧾 Licença
Este projeto está licenciado sob a MIT License.
Veja o ficheiro LICENSE para mais detalhes.

💡 Autor
👨‍💻 Vinicius Duarte Rosa
📎 GitHub - @ViniDuarteR

💬 “Cuidar da saúde nunca foi tão simples — tecnologia a serviço do bem-estar.”

---
