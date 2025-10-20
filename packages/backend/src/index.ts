import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

// Rota de Teste
app.get('/api', (req, res) => {
  res.json({ message: 'API de Lembretes está funcionando!' });
});

// --- ROTAS DE CONSULTAS ---

// Rota para BUSCAR todas as consultas
app.get('/api/consultas', async (req, res) => {
  const consultas = await prisma.consulta.findMany();
  res.json(consultas);
});

// Rota para CRIAR uma nova consulta
app.post('/api/consultas', async (req, res) => {
  const { paciente, especialidade, medico, data, endereco } = req.body;
  try {
    const novaConsulta = await prisma.consulta.create({
      data: {
        paciente,
        especialidade,
        medico,
        data, // A string ISO vinda do frontend
        endereco,
        // CORREÇÃO: O campo 'compareceu' não é necessário aqui,
        // pois ele é opcional e o banco de dados o deixará como 'null' por padrão.
      },
    });
    res.status(201).json(novaConsulta);
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    res.status(500).json({ error: "Não foi possível criar a consulta." });
  }
});

// Rota para DELETAR uma consulta
app.delete('/api/consultas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.consulta.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar consulta:", error);
    res.status(500).json({ error: "Não foi possível deletar a consulta." });
  }
});

// Rota para ATUALIZAR uma consulta
app.put('/api/consultas/:id', async (req, res) => {
  const { id } = req.params;
  const { paciente, especialidade, medico, data, endereco } = req.body;
  try {
    const updatedConsulta = await prisma.consulta.update({
      where: { id },
      data: {
        paciente,
        especialidade,
        medico,
        data,
        endereco,
      },
    });
    res.json(updatedConsulta);
  } catch (error) {
    console.error("Erro ao atualizar consulta:", error);
    res.status(500).json({ error: "Não foi possível atualizar a consulta." });
  }
});

// Rota para ATUALIZAR O STATUS de uma consulta
app.patch('/api/consultas/:id/status', async (req, res) => {
  const { id } = req.params;
  const { compareceu } = req.body;
  try {
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


// --- ROTAS DE MEDICAMENTOS ---

// Rota para BUSCAR todos os medicamentos
app.get('/api/medicamentos', async (req, res) => {
  const medicamentos = await prisma.medicamento.findMany();
  res.json(medicamentos);
});

// Rota para CRIAR um novo medicamento
app.post('/api/medicamentos', async (req, res) => {
  const { nome, dosagem, frequencia, horarioInicio, dataFinal } = req.body;
  try {
    const novoMedicamento = await prisma.medicamento.create({
      data: {
        nome,
        dosagem,
        frequencia,
        horarioInicio,
        dataFinal,
      },
    });
    res.status(201).json(novoMedicamento);
  } catch (error) {
    console.error("Erro ao criar medicamento:", error);
    res.status(500).json({ error: "Não foi possível criar o medicamento." });
  }
});

// Rota para DELETAR um medicamento
app.delete('/api/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.medicamento.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar medicamento:", error);
    res.status(500).json({ error: "Não foi possível deletar o medicamento." });
  }
});

// Rota para ATUALIZAR um medicamento
app.put('/api/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, dosagem, frequencia, horarioInicio, dataFinal } = req.body;
  try {
    const updatedMedicamento = await prisma.medicamento.update({
      where: { id },
      data: {
        nome,
        dosagem,
        frequencia,
        horarioInicio,
        dataFinal,
      },
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
