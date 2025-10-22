import { useState, useEffect } from "react";
// 1. IMPORTAR LogOut e toast (toast já deve estar a ser usado indiretamente, mas adicionar explicitamente se necessário)
import { Calendar, Pill, Heart, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner"; // Importar toast para feedback de logout
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
import { calcularProximoHorario } from "@/lib/dateUtils";
import { fetchWithAuth } from '@/lib/api';
import { jwtDecode } from "jwt-decode";

// Interfaces
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

// Tipo para o Payload do Token (ajuste se tiver mais dados no token)
interface DecodedToken {
  userId: string;
  email: string;
  iat: number; // Issued At (timestamp)
  exp: number; // Expiration (timestamp)
}

// Declarar apiUrl uma vez fora do componente
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Estado para o email

  // Função de Logout (Necessária para o useEffect e botão)
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove o token
    setUserEmail(null); // Limpa o email do estado
    navigate('/login'); // Redireciona para o login
    toast.info("Sessão terminada."); // Feedback opcional
  };

  // Ler e descodificar o token ao carregar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        // Opcional: Verificar expiração
        if (decodedToken.exp * 1000 < Date.now()) {
          console.log("Token expirado, a fazer logout.");
          handleLogout(); // Token expirado
        } else {
          setUserEmail(decodedToken.email);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        handleLogout(); // Se for inválido, faz logout
      }
    } else {
       console.log("Nenhum token encontrado, a redirecionar para login.");
       handleLogout(); // Se não houver token, força logout/redirecionamento
    }
  }, []); // Executa apenas uma vez ao montar

  // Buscar dados da API (agora depende de userEmail)
  useEffect(() => {
    // Só busca dados se houver um email (ou seja, se o token foi válido no primeiro useEffect)
    if (userEmail) {
      const fetchData = async () => {
        // Não resetar loading aqui se o userEmail já estiver definido
        // setLoading(true);
        try {
          const [consultasRes, medicamentosRes] = await Promise.all([
            fetchWithAuth(`${apiUrl}/api/consultas`),
            fetchWithAuth(`${apiUrl}/api/medicamentos`)
          ]);
          if (!consultasRes.ok || !medicamentosRes.ok) {
            throw new Error('Falha ao buscar dados da API');
          }
          const consultasData = await consultasRes.json();
          const medicamentosData = await medicamentosRes.json();
          setConsultas(consultasData);
          setMedicamentos(medicamentosData);
          setError(null);
        } catch (err: any) {
          console.error(err);
          if (err.message !== 'Não autorizado ou token expirado.') {
           setError("Não foi possível carregar os dados.");
          }
        } finally {
          // Garante que o loading termina mesmo se userEmail mudar rapidamente
          // (embora não deva acontecer neste fluxo)
          setLoading(false);
        }
      };
      fetchData();
    } else if (!localStorage.getItem('authToken')) {
      // Se explicitamente não há token (logout foi chamado),
      // garante que paramos o loading para evitar ecrã branco.
      setLoading(false);
    }
    // A dependência de userEmail garante que a busca ocorre após a verificação do token.
  }, [userEmail]);

  // Lógica de processamento (sem alteração)
  const consultasHoje = consultas.filter(c => isToday(new Date(c.data)));
  const proximaConsulta = consultasHoje
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .find(c => new Date(c.data) > new Date());

  const proximoMedicamento = medicamentos
    .map(m => ({ ...m, proximoHorario: calcularProximoHorario(m) }))
    .filter(m => m.proximoHorario && isToday(m.proximoHorario))
    .sort((a, b) => a.proximoHorario!.getTime() - b.proximoHorario!.getTime())
    .find(m => m.proximoHorario! >= new Date());

  const medicamentosHojeCount = medicamentos.filter(m => {
      const proximo = calcularProximoHorario(m);
      return proximo && isToday(proximo);
  }).length;

  // Renderização condicional (loading/error)
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  // Se houver erro E o utilizador supostamente estava logado (userEmail definido), mostra erro
  if (error && userEmail) {
    return <div className="flex items-center justify-center min-h-screen text-center text-destructive"><p>{error}</p></div>;
  }
  // Se não estiver loading, não tiver erro E não tiver userEmail, significa que fomos
  // redirecionados para o login pelo primeiro useEffect ou ProtectedRoute, então retorna null.
  if (!userEmail) return null;

  // Renderização principal (JSX)
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-10 w-10 text-primary fill-primary" />
              <h1 className="text-3xl font-bold">Resumo de Hoje</h1>
            </div>
            {/* Mostrar Email e Botão de Logout */}
            <div className="flex items-center gap-4">
              {userEmail && (
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {userEmail}
                </span>
              )}
              <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Sair">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
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
            {/* Ajustar navegação para rotas de CRIAÇÃO se existirem */}
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

