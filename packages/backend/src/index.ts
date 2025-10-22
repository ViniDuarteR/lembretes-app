import express, { Request, Response, NextFunction } from 'express'; // Importar tipos do Express
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './middleware/authMiddleware'; // Importar o middleware

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO_AQUI'; // Lembre-se de definir no .env e no Render

// --- Interface para Pedidos Autenticados ---
interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

// Middlewares
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: frontendUrl }));
app.use(express.json());

// Rota de Teste (Pública)
app.get('/api', (req, res) => {
  res.json({ message: 'API de Lembretes está funcionando!' });
});

// --- ROTAS DE AUTENTICAÇÃO (Públicas) ---

// Rota de Registo
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password são obrigatórios.' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já registado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (error) {
    console.error("Erro no registo:", error);
    res.status(500).json({ error: 'Erro interno ao registar utilizador.' });
  }
});

// Rota de Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password são obrigatórios.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Pode ajustar a duração
    );
    res.json({ token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});


// --- ROTAS DE CONSULTAS (Protegidas) ---

// BUSCAR consultas DO UTILIZADOR AUTENTICADO
app.get('/api/consultas', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' }); // Segurança extra

  try {
    const consultas = await prisma.consulta.findMany({
      where: { userId }, // Apenas as do utilizador logado
    });
    res.json(consultas);
  } catch (error) {
    console.error("Erro ao buscar consultas:", error);
    res.status(500).json({ error: "Erro interno ao buscar consultas." });
  }
});

// CRIAR uma nova consulta PARA O UTILIZADOR AUTENTICADO
app.post('/api/consultas', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { paciente, especialidade, medico, data, endereco } = req.body;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  try {
    const novaConsulta = await prisma.consulta.create({
      data: {
        paciente,
        especialidade,
        medico,
        data,
        endereco,
        userId: userId, // Associar ao utilizador logado
      },
    });
    res.status(201).json(novaConsulta);
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    res.status(500).json({ error: "Não foi possível criar a consulta." });
  }
});

// DELETAR uma consulta DO UTILIZADOR AUTENTICADO
app.delete('/api/consultas/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  try {
    // Verificar se a consulta pertence ao utilizador antes de deletar
    const consulta = await prisma.consulta.findUnique({ where: { id } });
    if (!consulta || consulta.userId !== userId) {
      return res.status(404).json({ error: 'Consulta não encontrada ou não pertence ao utilizador.' });
    }

    await prisma.consulta.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar consulta:", error);
    res.status(500).json({ error: "Não foi possível deletar a consulta." });
  }
});

// ATUALIZAR uma consulta DO UTILIZADOR AUTENTICADO
app.put('/api/consultas/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  const { paciente, especialidade, medico, data, endereco } = req.body;

  try {
    // Verificar se a consulta pertence ao utilizador antes de atualizar
    const consulta = await prisma.consulta.findUnique({ where: { id } });
    if (!consulta || consulta.userId !== userId) {
      return res.status(404).json({ error: 'Consulta não encontrada ou não pertence ao utilizador.' });
    }

    const updatedConsulta = await prisma.consulta.update({
      where: { id },
      data: { paciente, especialidade, medico, data, endereco },
    });
    res.json(updatedConsulta);
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error);
    res.status(500).json({ error: "Não foi possível atualizar a consulta." });
  }
});

// ATUALIZAR O STATUS de uma consulta DO UTILIZADOR AUTENTICADO
app.patch('/api/consultas/:id/status', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  const { compareceu } = req.body;

  try {
    // Verificar se a consulta pertence ao utilizador antes de atualizar
    const consulta = await prisma.consulta.findUnique({ where: { id } });
    if (!consulta || consulta.userId !== userId) {
      return res.status(404).json({ error: 'Consulta não encontrada ou não pertence ao utilizador.' });
    }

    const updatedConsulta = await prisma.consulta.update({
      where: { id },
      data: { compareceu },
    });
    res.json(updatedConsulta);
  } catch (error) {
    console.error("Erro ao atualizar status da consulta:", error);
    res.status(500).json({ error: "Não foi possível atualizar o status." });
  }
});


// --- ROTAS DE MEDICAMENTOS (Protegidas) ---

// BUSCAR medicamentos DO UTILIZADOR AUTENTICADO
app.get('/api/medicamentos', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  try {
    const medicamentos = await prisma.medicamento.findMany({
      where: { userId }, // Apenas os do utilizador logado
    });
    res.json(medicamentos);
  } catch (error) {
    console.error("Erro ao buscar medicamentos:", error);
    res.status(500).json({ error: "Erro interno ao buscar medicamentos." });
  }
});

// CRIAR um novo medicamento PARA O UTILIZADOR AUTENTICADO
app.post('/api/medicamentos', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { nome, dosagem, frequencia, horarioInicio, dataFinal } = req.body;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  try {
    const novoMedicamento = await prisma.medicamento.create({
      data: {
        nome,
        dosagem,
        frequencia,
        horarioInicio,
        dataFinal,
        userId: userId, // Associar ao utilizador logado
      },
    });
    res.status(201).json(novoMedicamento);
  } catch (error) {
    console.error("Erro ao criar medicamento:", error);
    res.status(500).json({ error: "Não foi possível criar o medicamento." });
  }
});

// DELETAR um medicamento DO UTILIZADOR AUTENTICADO
app.delete('/api/medicamentos/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  try {
    // Verificar se o medicamento pertence ao utilizador antes de deletar
    const medicamento = await prisma.medicamento.findUnique({ where: { id } });
    if (!medicamento || medicamento.userId !== userId) {
      return res.status(404).json({ error: 'Medicamento não encontrado ou não pertence ao utilizador.' });
    }

    await prisma.medicamento.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar medicamento:", error);
    res.status(500).json({ error: "Não foi possível deletar o medicamento." });
  }
});

// ATUALIZAR um medicamento DO UTILIZADOR AUTENTICADO
app.put('/api/medicamentos/:id', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Não autorizado' });

  const { nome, dosagem, frequencia, horarioInicio, dataFinal } = req.body;

  try {
    // Verificar se o medicamento pertence ao utilizador antes de atualizar
    const medicamento = await prisma.medicamento.findUnique({ where: { id } });
    if (!medicamento || medicamento.userId !== userId) {
      return res.status(404).json({ error: 'Medicamento não encontrado ou não pertence ao utilizador.' });
    }

    const updatedMedicamento = await prisma.medicamento.update({
      where: { id },
      data: { nome, dosagem, frequencia, horarioInicio, dataFinal },
    });
    res.json(updatedMedicamento);
  } catch (error) {
    console.error("Erro ao atualizar medicamento:", error);
    res.status(500).json({ error: "Não foi possível atualizar o medicamento." });
  }
});


// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});