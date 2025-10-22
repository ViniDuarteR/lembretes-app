import { useState, useEffect } from "react";
import { Bell, Heart, Calendar, Pill, Loader2 } from "lucide-react";
import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isToday, isTomorrow, format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calcularProximoHorario } from "@/lib/dateUtils";
// 1. IMPORTAR fetchWithAuth (ajuste o caminho se necessário)
import { fetchWithAuth } from '@/lib/api'; // Ou '@/lib/api' se o criou lá

// Interfaces para os dados brutos da API
interface Consulta {
  id: string;
  especialidade: string;
  data: string;
  compareceu?: boolean | null;
}

interface Medicamento {
  id: string;
  nome: string;
  horarioInicio: string;
  frequencia: string;
  dataFinal?: string | null;
}

// Interface unificada para uma "Notificação"
interface NotificationItem {
  id: string;
  type: 'consulta' | 'medicamento';
  title: string;
  datetime: Date;
  compareceu?: boolean | null;
}

// Declarar apiUrl uma vez fora do componente
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Notificacoes() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // 2. SUBSTITUIR fetch por fetchWithAuth
        const [consultasRes, medicamentosRes] = await Promise.all([
          fetchWithAuth(`${apiUrl}/api/consultas`),
          fetchWithAuth(`${apiUrl}/api/medicamentos`)
        ]);

        if (!consultasRes.ok || !medicamentosRes.ok) {
          // A função fetchWithAuth já trata o 401, então este erro
          // seria para outros problemas (ex: 500 no backend)
          throw new Error('Falha ao buscar dados');
        }

        const consultasData: Consulta[] = await consultasRes.json();
        const medicamentosData: Medicamento[] = await medicamentosRes.json();

        // Mapeamento de Consultas
        const consultaNotifications: NotificationItem[] = consultasData.map(c => ({
          id: `c-${c.id}`,
          type: 'consulta',
          title: `Consulta ${c.especialidade}`,
          datetime: parseISO(c.data),
          compareceu: c.compareceu,
        }));

        // Mapeamento de Medicamentos
        const medicamentoNotifications: NotificationItem[] = medicamentosData
          .map(m => {
            const proximoHorario = calcularProximoHorario(m);
            if (!proximoHorario) return null;
            return {
              id: `m-${m.id}`,
              type: 'medicamento' as const,
              title: `Tomar ${m.nome}`,
              datetime: proximoHorario,
            };
          })
          .filter(Boolean);

        const allNotifications = [...consultaNotifications, ...medicamentoNotifications];
        setNotifications(allNotifications);
        setError(null); // Limpa erros anteriores

      } catch (err: any) { // Capturar erro corretamente
        console.error(err);
        // Evitar exibir erro 401 (já tratado pelo fetchWithAuth com redirecionamento)
        if (err.message !== 'Não autorizado ou token expirado.') {
          setError("Não foi possível carregar as notificações.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []); // Executa apenas uma vez

  // Agrupar as notificações por período (sem alteração)
  const agora = new Date();
  const futureNotifications = notifications.filter(n => n.datetime >= agora).sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  const pastNotifications = notifications.filter(n => n.datetime < agora).sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
  const today = futureNotifications.filter(n => isToday(n.datetime));
  const tomorrow = futureNotifications.filter(n => isTomorrow(n.datetime));
  const upcoming = futureNotifications.filter(n => !isToday(n.datetime) && !isTomorrow(n.datetime));

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  // O JSX permanece o mesmo da versão anterior (com badge de comparecimento no histórico)
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            <h1 className="text-3xl font-bold">Notificações</h1>
          </div>
        </div>
      </header>
      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
        {error && <p className="text-center text-destructive bg-destructive/10 p-4 rounded-lg">{error}</p>}
        {!loading && !error && notifications.length === 0 && (
           <div className="text-center py-12">
             <Bell className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
             <h2 className="text-2xl font-semibold mb-2">Nenhuma notificação encontrada</h2>
             <p className="text-lg text-muted-foreground">Adicione consultas e medicamentos para ver os lembretes aqui.</p>
           </div>
        )}

        {/* Hoje */}
        {today.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Hoje</h2>
            <div className="space-y-4">
              {today.map((notification) => (
                <Card key={notification.id} className="p-6 transition-all hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${notification.type === "consulta" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                      {notification.type === "consulta" ? <Calendar className="h-7 w-7" /> : <Pill className="h-7 w-7" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{notification.title}</h3>
                      <p className="text-lg text-muted-foreground">
                        às {format(notification.datetime, "HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Amanhã */}
        {tomorrow.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Amanhã</h2>
            <div className="space-y-4">
              {tomorrow.map((notification) => (
                 <Card key={notification.id} className="p-6 hover:shadow-md transition-all">
                   <div className="flex items-start gap-4">
                     <div className={`p-3 rounded-2xl ${notification.type === "consulta" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                       {notification.type === "consulta" ? <Calendar className="h-7 w-7" /> : <Pill className="h-7 w-7" />}
                     </div>
                     <div className="flex-1">
                       <h3 className="text-xl font-semibold mb-1">{notification.title}</h3>
                       <p className="text-lg text-muted-foreground">
                         às {format(notification.datetime, "HH:mm", { locale: ptBR })}
                       </p>
                     </div>
                   </div>
                 </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* Próximos Dias */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Próximos Dias</h2>
            <div className="space-y-4">
              {upcoming.map((notification) => (
                 <Card key={notification.id} className="p-6 hover:shadow-md transition-all">
                   <div className="flex items-start gap-4">
                     <div className={`p-3 rounded-2xl ${notification.type === "consulta" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                       {notification.type === "consulta" ? <Calendar className="h-7 w-7" /> : <Pill className="h-7 w-7" />}
                     </div>
                     <div className="flex-1">
                       <h3 className="text-xl font-semibold mb-1">{notification.title}</h3>
                       <p className="text-lg text-muted-foreground">
                         {format(notification.datetime, "dd/MM 'às' HH:mm", { locale: ptBR })}
                       </p>
                     </div>
                   </div>
                 </Card>
              ))}
            </div>
          </section>
        )}

        {/* Histórico */}
        {pastNotifications.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Histórico</h2>
            <div className="space-y-4">
              {pastNotifications.map((notification) => (
                <Card key={notification.id} className="p-6 opacity-70">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${notification.type === "consulta" ? "bg-primary/10 text-primary" : "bg-success/10 text-success"}`}>
                      {notification.type === "consulta" ? <Calendar className="h-7 w-7" /> : <Pill className="h-7 w-7" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{notification.title}</h3>
                        {notification.type === 'consulta' && notification.compareceu === true && (
                          <Badge className="bg-green-600 text-white hover:bg-green-600/80">
                            Compareceu
                          </Badge>
                        )}
                        {notification.type === 'consulta' && notification.compareceu === false && (
                          <Badge variant="destructive">Não Compareceu</Badge>
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground mt-1">
                        {format(notification.datetime, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <NavigationBar />
    </div>
  );
}

