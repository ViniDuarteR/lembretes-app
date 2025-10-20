import { useState, useEffect } from "react";
import { Pill, Heart, Plus, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { calcularProximoHorario } from "@/lib/dateUtils"; // 1. IMPORTAR A FUNÇÃO UTILITÁRIA

interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  frequencia: string;
  horarioInicio: string;
  dataFinal?: string | null;
}

const initialFormData = {
  nome: "",
  dosagem: "",
  frequencia: "",
  horario: "",
  dataFinal: ""
};

export default function Medicamentos() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMedicamento, setEditingMedicamento] = useState<Medicamento | null>(null);
  const [medicamentoToDelete, setMedicamentoToDelete] = useState<Medicamento | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const fetchMedicamentos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/medicamentos');
      if (!response.ok) throw new Error('Falha ao buscar medicamentos');
      const data = await response.json();
      setMedicamentos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os lembretes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const hoje = new Date();
    const [horas, minutos] = formData.horario.split(':');
    hoje.setHours(parseInt(horas), parseInt(minutos), 0, 0);
    const dataToSend = {
      nome: formData.nome,
      dosagem: formData.dosagem,
      frequencia: formData.frequencia,
      horarioInicio: hoje.toISOString(),
      dataFinal: formData.dataFinal ? new Date(formData.dataFinal).toISOString() : null,
    };
    const url = editingMedicamento
      ? `http://localhost:3001/api/medicamentos/${editingMedicamento.id}`
      : 'http://localhost:3001/api/medicamentos';
    const method = editingMedicamento ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSend) });
      if (!response.ok) throw new Error(`Falha ao ${editingMedicamento ? 'atualizar' : 'salvar'}`);
      toast.success(`Lembrete ${editingMedicamento ? 'atualizado' : 'criado'} com sucesso!`);
      setShowAddDialog(false);
      fetchMedicamentos();
    } catch (err) {
      console.error(err);
      toast.error(`Erro ao ${editingMedicamento ? 'atualizar' : 'salvar'}. Tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (medicamento: Medicamento) => {
    setEditingMedicamento(medicamento);
    const dataObj = new Date(medicamento.horarioInicio);
    setFormData({
      nome: medicamento.nome,
      dosagem: medicamento.dosagem,
      frequencia: medicamento.frequencia,
      horario: format(dataObj, 'HH:mm'),
      dataFinal: medicamento.dataFinal ? format(new Date(medicamento.dataFinal), 'yyyy-MM-dd') : ""
    });
    setShowAddDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!medicamentoToDelete) return;
    try {
      const response = await fetch(`http://localhost:3001/api/medicamentos/${medicamentoToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Falha ao deletar');
      toast.success("Lembrete removido com sucesso!");
      fetchMedicamentos();
    } catch (error) {
      toast.error("Erro ao remover lembrete.");
    } finally {
      setShowDeleteAlert(false);
      setMedicamentoToDelete(null);
    }
  };

  const openAddDialog = () => {
    setEditingMedicamento(null);
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
            <div className="flex items-center gap-3"><Heart className="h-10 w-10 text-primary fill-primary" /><h1 className="text-3xl font-bold">Medicamentos</h1></div>
            <Button onClick={openAddDialog} size="lg" className="gap-2"><Plus className="h-5 w-5" /> Adicionar</Button>
          </div>
        </div>
      </header>
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {error && <div className="text-center text-destructive-foreground bg-destructive p-4 rounded-lg mb-6">{error}</div>}
        {!loading && !error && medicamentos.length === 0 ? (
          <div className="bg-card rounded-3xl p-8 border shadow-sm"><div className="text-center py-12"><Pill className="h-20 w-20 mx-auto text-muted-foreground mb-4" /><h2 className="text-2xl font-semibold mb-2">Nenhum medicamento cadastrado</h2><p className="text-lg text-muted-foreground mb-6">Clique em "Adicionar" para criar seu primeiro lembrete</p></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicamentos.map((medicamento) => {
              // 2. CALCULAR O PRÓXIMO HORÁRIO DENTRO DO LOOP
              const proximoHorario = calcularProximoHorario(medicamento);

              return (
                <div key={medicamento.id} className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col gap-3 relative">
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-5 w-5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(medicamento)} className="gap-2"><Pencil className="h-4 w-4" /> Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setMedicamentoToDelete(medicamento); setShowDeleteAlert(true); }} className="gap-2 text-destructive focus:text-destructive"><Trash2 className="h-4 w-4" /> Remover</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="text-2xl font-bold pr-8">{medicamento.nome}</h3>
                  <p className="text-lg text-muted-foreground">Dosagem: {medicamento.dosagem}</p>
                  <p className="text-lg text-muted-foreground">Frequência: {medicamento.frequencia}</p>

                  {/* 3. ATUALIZAR A INTERFACE PARA MOSTRAR O HORÁRIO CORRETO */}
                  {proximoHorario ? (
                    <p className="text-lg font-semibold text-primary pt-2">
                      Próxima dose: {format(proximoHorario, "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  ) : (
                    <p className="text-lg text-muted-foreground pt-2">Tratamento finalizado</p>
                  )}
                  
                  {medicamento.dataFinal && <p className="text-sm text-muted-foreground">Término em: {format(new Date(medicamento.dataFinal), 'dd/MM/yyyy')}</p>}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-2xl">{editingMedicamento ? 'Editar Remédio' : 'Adicionar Novo Remédio'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2"><Label htmlFor="nome" className="text-lg">Nome do Remédio</Label><Input id="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="h-14 text-lg" placeholder="Ex: Aspirina" required /></div>
            <div className="space-y-2"><Label htmlFor="dosagem" className="text-lg">Dosagem</Label><Input id="dosagem" value={formData.dosagem} onChange={(e) => setFormData({ ...formData, dosagem: e.target.value })} className="h-14 text-lg" placeholder="Ex: 500mg ou 1 comprimido" required /></div>
            <div className="space-y-2"><Label htmlFor="frequencia" className="text-lg">Frequência</Label><Input id="frequencia" value={formData.frequencia} onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })} className="h-14 text-lg" placeholder="Ex: De 8 em 8 horas" required /></div>
            <div className="space-y-2"><Label htmlFor="horario" className="text-lg">Horário de Início</Label><Input id="horario" type="time" value={formData.horario} onChange={(e) => setFormData({ ...formData, horario: e.target.value })} className="h-14 text-lg" required /></div>
            <div className="space-y-2"><Label htmlFor="dataFinal" className="text-lg">Data Final (Opcional)</Label><Input id="dataFinal" type="date" value={formData.dataFinal} onChange={(e) => setFormData({ ...formData, dataFinal: e.target.value })} className="h-14 text-lg" /></div>
            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Salvar Lembrete"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Você tem certeza?</AlertDialogTitle><AlertDialogDescription>Esta ação removerá permanentemente o lembrete para "{medicamentoToDelete?.nome}".</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm}>Continuar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <NavigationBar />
    </div>
  );
}

