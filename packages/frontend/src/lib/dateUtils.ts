import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { parseISO, addHours } from 'date-fns';

interface MedicamentoParaCalculo {
  horarioInicio: string;
  frequencia: string;
  dataFinal?: string | null;
}

/**
 * Extrai o número de horas de uma string de frequência.
 * Ex: "De 8 em 8 horas" retorna 8. "Uma vez ao dia" retorna 24.
 */
function parseFrequenciaEmHoras(frequencia: string): number {
  if (!frequencia) return 24; // Padrão
  const match = frequencia.match(/\d+/); // Encontra o primeiro número na string
  if (match) {
    return parseInt(match[0], 10);
  }
  // Se não encontrar número, assume que é uma vez por dia
  return 24;
}

/**
 * Calcula o próximo horário para tomar um medicamento.
 */
export function calcularProximoHorario(medicamento: MedicamentoParaCalculo): Date | null {
  const agora = new Date();
  const inicio = parseISO(medicamento.horarioInicio);
  const intervaloHoras = parseFrequenciaEmHoras(medicamento.frequencia);

  // Se o horário de início já for no futuro, ele é o próximo
  if (inicio > agora) {
    return inicio;
  }

  let proximoHorario = inicio;

  // Enquanto o próximo horário calculado ainda estiver no passado, continue adicionando o intervalo
  while (proximoHorario < agora) {
    proximoHorario = addHours(proximoHorario, intervaloHoras);
  }

  // Verifica se o tratamento já terminou (se houver data final)
  if (medicamento.dataFinal) {
    const dataFinal = parseISO(medicamento.dataFinal);
    if (proximoHorario > dataFinal) {
      return null; // Não há mais doses futuras
    }
  }

  return proximoHorario;
}