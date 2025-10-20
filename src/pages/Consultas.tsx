import { useState } from "react";
import { Calendar, Heart, Plus } from "lucide-react";
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
import { toast } from "sonner";

export default function Consultas() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    paciente: "",
    especialidade: "",
    medico: "",
    data: "",
    hora: "",
    endereco: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Consulta agendada com sucesso!");
    setShowAddDialog(false);
    setFormData({
      paciente: "",
      especialidade: "",
      medico: "",
      data: "",
      hora: "",
      endereco: ""
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
              <h1 className="text-3xl font-bold">Consultas</h1>
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
            <Calendar className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhuma consulta agendada</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Clique em "Adicionar" para agendar sua primeira consulta
            </p>
          </div>
        </div>
      </main>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Agendar Nova Consulta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="paciente" className="text-lg">Nome do Paciente</Label>
              <Input
                id="paciente"
                value={formData.paciente}
                onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                className="h-14 text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidade" className="text-lg">Especialidade Médica</Label>
              <Input
                id="especialidade"
                value={formData.especialidade}
                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                className="h-14 text-lg"
                placeholder="Ex: Cardiologista"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medico" className="text-lg">Nome do Médico (Opcional)</Label>
              <Input
                id="medico"
                value={formData.medico}
                onChange={(e) => setFormData({ ...formData, medico: e.target.value })}
                className="h-14 text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data" className="text-lg">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="h-14 text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora" className="text-lg">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  className="h-14 text-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-lg">Endereço do Local</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="min-h-24 text-lg"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14">
              Salvar Consulta
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <NavigationBar />
    </div>
  );
}
