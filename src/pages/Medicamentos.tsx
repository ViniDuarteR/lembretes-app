import { useState } from "react";
import { Pill, Heart, Plus } from "lucide-react";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Medicamentos() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    dosagem: "",
    frequencia: "",
    horario: "",
    dataFinal: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Lembrete de medicamento criado!");
    setShowAddDialog(false);
    setFormData({
      nome: "",
      dosagem: "",
      frequencia: "",
      horario: "",
      dataFinal: ""
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-10 w-10 text-primary fill-primary" />
              <h1 className="text-3xl font-bold">Medicamentos</h1>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Adicionar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <div className="text-center py-12">
            <Pill className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum medicamento cadastrado</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Clique em "Adicionar" para criar seu primeiro lembrete
            </p>
          </div>
        </div>
      </main>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Adicionar Novo Remédio</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-lg">Nome do Remédio</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="h-14 text-lg"
                placeholder="Ex: Aspirina"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosagem" className="text-lg">Dosagem</Label>
              <Input
                id="dosagem"
                value={formData.dosagem}
                onChange={(e) => setFormData({ ...formData, dosagem: e.target.value })}
                className="h-14 text-lg"
                placeholder="Ex: 500mg ou 1 comprimido"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequencia" className="text-lg">Frequência</Label>
              <Input
                id="frequencia"
                value={formData.frequencia}
                onChange={(e) => setFormData({ ...formData, frequencia: e.target.value })}
                className="h-14 text-lg"
                placeholder="Ex: De 8 em 8 horas"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario" className="text-lg">Horário de Início</Label>
              <Input
                id="horario"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                className="h-14 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFinal" className="text-lg">Data Final do Tratamento (Opcional)</Label>
              <Input
                id="dataFinal"
                type="date"
                value={formData.dataFinal}
                onChange={(e) => setFormData({ ...formData, dataFinal: e.target.value })}
                className="h-14 text-lg"
              />
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14">
              Salvar Lembrete
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <NavigationBar />
    </div>
  );
}
