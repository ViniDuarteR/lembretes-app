import { useState, useEffect } from "react";
import { Calendar, Pill, Heart, Loader2 } from "lucide-react";
import { InfoCard } from "@/components/InfoCard";
import { NavigationBar } from "@/components/NavigationBar";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isToday, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calcularProximoHorario } from "@/lib/dateUtils"; // Importação da nova função

// Definição de Tipos
interface Consulta {
  id: string;
  paciente: string;
  especialidade: string;
  medico: string;
  data: string;
}

interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  horarioInicio: string;
  frequencia: string;
  dataFinal?: string | null;
}
const apiUrl = import.meta.env.VITE_API_URL;
export default function Dashboard() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lógica para buscar os dados da API (sem alteração)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consultasRes, medicamentosRes] = await Promise.all([
          fetch(`${apiUrl}api/consultas`),
          fetch(`${apiUrl}api/medicamentos`)
        ]);
        if (!consultasRes.ok || !medicamentosRes.ok) {
          throw new Error('Falha ao buscar dados da API');
        }
        const consultasData = await consultasRes.json();
        const medicamentosData = await medicamentosRes.json();
        setConsultas(consultasData);
        setMedicamentos(medicamentosData);
      } catch (err) {
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LÓGICA DE PROCESSAMENTO ATUALIZADA ---
  const consultasHoje = consultas.filter(c => isToday(new Date(c.data)));
  const proximaConsulta = consultasHoje
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .find(c => new Date(c.data) > new Date());

  const proximoMedicamento = medicamentos
    .map(m => ({
      ...m,
      proximoHorario: calcularProximoHorario(m),
    }))
    .filter(m => m.proximoHorario && isToday(m.proximoHorario))
    .sort((a, b) => a.proximoHorario!.getTime() - b.proximoHorario!.getTime())
    .find(m => m.proximoHorario! >= new Date());

  const medicamentosHojeCount = medicamentos.filter(m => {
    const proximo = calcularProximoHorario(m);
    return proximo && isToday(proximo);
  }).length;
  // --- FIM DA LÓGICA DE PROCESSAMENTO ---

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-center text-destructive"><p>{error}</p></div>;
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            <h1 className="text-3xl font-bold">Resumo de Hoje</h1>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <InfoCard
            icon={Calendar}
            title={`Você tem ${consultasHoje.length} ${consultasHoje.length === 1 ? 'consulta' : 'consultas'} hoje`}
            subtitle={proximaConsulta ? `${proximaConsulta.especialidade} às ${format(new Date(proximaConsulta.data), 'HH:mm')}` : "Nenhuma próxima consulta hoje"}
            description={proximaConsulta ? `${proximaConsulta.medico} - ${proximaConsulta.paciente}` : "Tudo certo por aqui!"}
            actionLabel="Ver todas"
            onAction={() => navigate("/consultas")}
            variant="default"
          />

          {/* --- INFOCARD DE MEDICAMENTOS ATUALIZADO --- */}
          <InfoCard
            icon={Pill}
            title={`Você tem ${medicamentosHojeCount} ${medicamentosHojeCount === 1 ? 'medicamento' : 'medicamentos'} hoje`}
            subtitle={proximoMedicamento ? `${proximoMedicamento.nome} às ${format(proximoMedicamento.proximoHorario!, 'HH:mm')}` : "Nenhum próximo medicamento hoje"}
            description={proximoMedicamento ? `Próxima dose calculada` : "Tudo certo por aqui!"}
            actionLabel="Ver todos"
            onAction={() => navigate("/medicamentos")}
            variant="success"
          />
        </div>
      </main>

      <FloatingActionButton onClick={() => setShowAddDialog(true)} />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">O que deseja adicionar?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button onClick={() => { setShowAddDialog(false); navigate("/consultas"); }} size="lg" variant="outline" className="w-full justify-start text-lg h-16 border-2">
              <Calendar className="mr-3 h-6 w-6" /> Nova Consulta
            </Button>
            <Button onClick={() => { setShowAddDialog(false); navigate("/medicamentos"); }} size="lg" variant="outline" className="w-full justify-start text-lg h-16 border-2">
              <Pill className="mr-3 h-6 w-6" /> Novo Medicamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <NavigationBar />
    </div>
  );
}