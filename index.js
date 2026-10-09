const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const ARQUIVO = "./agendamentos.json";

/*
  Horários disponíveis para demonstração
*/
const horariosDisponiveis = [
  {
    id: 1,
    medico: "Dra. Ana Silva",
    especialidade: "Dermatologia",
    data: "2026-10-15",
    horario: "09:00"
  },
  {
    id: 2,
    medico: "Dra. Ana Silva",
    especialidade: "Dermatologia",
    data: "2026-10-15",
    horario: "10:00"
  },
  {
    id: 3,
    medico: "Dr. João Santos",
    especialidade: "Cardiologia",
    data: "2026-10-16",
    horario: "14:00"
  }
];

/*
  GET horários disponíveis
*/
app.get("/horarios", (req, res) => {
  res.json(horariosDisponiveis);
});

/*
  GET listar agendamentos
*/
app.get("/agendamentos", (req, res) => {

  const dados = JSON.parse(
    fs.readFileSync(ARQUIVO, "utf-8")
  );

  res.json(dados);
});

/*
  POST criar consulta
*/
app.post("/agendamentos", (req, res) => {

  const {
    nome,
    telefone,
    medico,
    data,
    horario
  } = req.body;

  const agendamentos = JSON.parse(
    fs.readFileSync(ARQUIVO, "utf-8")
  );

  const novoAgendamento = {
    id: Date.now(),
    protocolo: `CONS-${Date.now()}`,
    nome,
    telefone,
    medico,
    data,
    horario,
    status: "Confirmado"
  };

  agendamentos.push(novoAgendamento);

  fs.writeFileSync(
    ARQUIVO,
    JSON.stringify(agendamentos, null, 2)
  );

  res.status(201).json(novoAgendamento);
});

/*
  Buscar consulta por telefone
*/
app.get("/consulta/:telefone", (req, res) => {

  const telefone = req.params.telefone;

  const agendamentos = JSON.parse(
    fs.readFileSync(ARQUIVO, "utf-8")
  );

  const consulta = agendamentos.find(
    a => a.telefone === telefone
  );

  if (!consulta) {
    return res.status(404).json({
      message: "Consulta não encontrada"
    });
  }

  res.json(consulta);
});

/*
  Cancelar consulta
*/
app.delete("/consulta/:id", (req, res) => {

  const id = Number(req.params.id);

  const agendamentos = JSON.parse(
    fs.readFileSync(ARQUIVO, "utf-8")
  );

  const novaLista = agendamentos.filter(
    a => a.id !== id
  );

  fs.writeFileSync(
    ARQUIVO,
    JSON.stringify(novaLista, null, 2)
  );

  res.json({
    message: "Consulta cancelada"
  });
});

app.listen(3000, () => {
  console.log("API rodando na porta 3000");
});