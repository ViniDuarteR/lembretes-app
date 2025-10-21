import { useState, useEffect } from "react";
import { Calendar, Heart, Plus, Loader2, MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format, isPast, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para tipar os dados da consulta
interface Consulta {
  id: string;
  paciente: string;
  especialidade: string;
  medico: string;
  data: string;
  endereco: string;
  compareceu?: boolean | null;
}

// Estado inicial do formulário (para limparmos depois)
const initialFormData = {
  paciente: "",
  especialidade: "",
  medico: "",
  data: "",
  hora: "",
  endereco: ""
};

export default function Consultas() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  // Estados para controlar a lista e a interface
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NOVOS ESTADOS para controlar edição e deleção
  const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);
  const [consultaToDelete, setConsultaToDelete] = useState<Consulta | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  // Função para buscar os dados da API
  const fetchConsultas = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/consultas`);
      if (!response.ok) throw new Error('Falha ao buscar consultas');
      const data = await response.json();
      setConsultas(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar as consultas.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar os dados quando o componente for montado
  useEffect(() => {
    fetchConsultas();
  }, []);

  // Função de Submissão ATUALIZADA para criar e editar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    const dataHoraISO = new Date(`${formData.data}T${formData.hora}`).toISOString();
    const dataToSend = {
      paciente: formData.paciente,
      especialidade: formData.especialidade,
      medico: formData.medico,
      data: dataHoraISO,
      endereco: formData.endereco,
    };

    const url = editingConsulta
      ? `${apiUrl}/api/consultas/${editingConsulta.id}`
      : `${apiUrl}/api/consultas`;

    const method = editingConsulta ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Falha ao ${editingConsulta ? 'atualizar' : 'salvar'} a consulta`);
      }

      toast.success(`Consulta ${editingConsulta ? 'atualizada' : 'agendada'} com sucesso!`);
      setShowAddDialog(false);
      fetchConsultas();

    } catch (err) {
      console.error(err);
      toast.error(`Erro ao ${editingConsulta ? 'atualizar' : 'salvar'} consulta. Tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // NOVAS FUNÇÕES para controlar as ações
  const handleEditClick = (consulta: Consulta) => {
    setEditingConsulta(consulta);
    const dataObj = new Date(consulta.data);
    setFormData({
      paciente: consulta.paciente,
      especialidade: consulta.especialidade,
      medico: consulta.medico,
      data: format(dataObj, 'yyyy-MM-dd'),
      hora: format(dataObj, 'HH:mm'),
      endereco: consulta.endereco,
    });
    setShowAddDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!consultaToDelete) return;

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/api/consultas/${consultaToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Falha ao deletar a consulta');
      toast.success("Consulta removida com sucesso!");
      fetchConsultas();
    } catch (error) {
      toast.error("Erro ao remover consulta.");
    } finally {
      setShowDeleteAlert(false);
      setConsultaToDelete(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: boolean) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/consultas/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compareceu: status }),
      });
      if (!response.ok) throw new Error('Falha ao atualizar status');
      toast.success("Status da consulta atualizado!");
      fetchConsultas();
    } catch (err) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const openAddDialog = () => {
    setEditingConsulta(null);
    setFormData(initialFormData);
    setShowAddDialog(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><Heart className="h-10 w-10 text-primary fill-primary" /><h1 className="text-3xl font-bold">Consultas</h1></div>
            <Button onClick={openAddDialog} size="lg" className="gap-2"><Plus className="h-5 w-5" /> Adicionar</Button>
          </div>
        </div>
      </header>
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {error && <div className="text-center text-destructive-foreground bg-destructive p-4 rounded-lg mb-6">{error}</div>}
        {!loading && !error && consultas.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 border shadow-sm"><div className="text-center py-12"><Calendar className="h-20 w-20 mx-auto text-muted-foreground mb-4" /><h2 className="text-2xl font-semibold mb-2">Nenhuma consulta agendada</h2><p className="text-lg text-muted-foreground mb-6">Clique em "Adicionar" para agendar sua primeira consulta</p></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultas.map((consulta) => {
              const consultaDate = parseISO(consulta.data);
              const isConsultaPast = isPast(consultaDate);

              return (
                <div key={consulta.id} className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-3 relative">
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-5 w-5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(consulta)} className="gap-2"><Pencil className="h-4 w-4" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setConsultaToDelete(consulta); setShowDeleteAlert(true); }} className="gap-2 text-destructive focus:text-destructive"><Trash2 className="h-4 w-4" /> Remover</DropdownMenuItem>
                        {isConsultaPast && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateStatus(consulta.id, true)} className="gap-2"><Check className="h-4 w-4 text-success" /> Marcar como Compareceu</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(consulta.id, false)} className="gap-2"><X className="h-4 w-4 text-destructive" /> Marcar como Não Compareceu</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between pr-8">
                    <span className="text-sm font-semibold text-primary uppercase">{format(consultaDate, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}</span>
                    {consulta.compareceu === true && (
                      <Badge className="bg-green-600 text-white hover:bg-green-600/80">
                        Compareceu
                      </Badge>
                    )}
                    {consulta.compareceu === false && (
                      <Badge variant="destructive">Não Compareceu</Badge>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{consulta.especialidade}</h3>
                  <p className="text-lg text-muted-foreground">Paciente: {consulta.paciente}</p>
                  <p className="text-lg text-muted-foreground">Médico: {consulta.medico || "Não informado"}</p>
                  <p className="text-lg text-muted-foreground">Local: {consulta.endereco}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-2xl">{editingConsulta ? "Editar Consulta" : "Agendar Nova Consulta"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2"><Label htmlFor="paciente" className="text-lg">Nome do Paciente</Label><Input id="paciente" value={formData.paciente} onChange={(e) => setFormData({ ...formData, paciente: e.target.value })} className="h-14 text-lg" required /></div>
            <div className="space-y-2"><Label htmlFor="especialidade" className="text-lg">Especialidade Médica</Label><Input id="especialidade" value={formData.especialidade} onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })} className="h-14 text-lg" placeholder="Ex: Cardiologista" required /></div>
            <div className="space-y-2"><Label htmlFor="medico" className="text-lg">Nome do Médico (Opcional)</Label><Input id="medico" value={formData.medico} onChange={(e) => setFormData({ ...formData, medico: e.target.value })} className="h-14 text-lg" /></div>
            <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="data" className="text-lg">Data</Label><Input id="data" type="date" value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} className="h-14 text-lg" required /></div><div className="space-y-2"><Label htmlFor="hora" className="text-lg">Hora</Label><Input id="hora" type="time" value={formData.hora} onChange={(e) => setFormData({ ...formData, hora: e.target.value })} className="h-14 text-lg" required /></div></div>
            <div className="space-y-2"><Label htmlFor="endereco" className="text-lg">Endereço do Local</Label><Textarea id="endereco" value={formData.endereco} onChange={(e) => setFormData({ ...formData, endereco: e.target.value })} className="min-h-24 text-lg" required /></div>
            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (editingConsulta ? 'Salvar Alterações' : 'Salvar Consulta')}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Isso removerá permanentemente a consulta de "{consultaToDelete?.especialidade}" do paciente "{consultaToDelete?.paciente}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm}>Continuar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NavigationBar />
    </div>
  );
}