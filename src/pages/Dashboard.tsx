import { useState } from "react";
import { Calendar, Pill, Heart } from "lucide-react";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            <h1 className="text-3xl font-bold">Resumo de Hoje</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <InfoCard
            icon={Calendar}
            title="Você tem 1 consulta hoje"
            subtitle="Cardiologista às 14h"
            description="Dr. Silva - Hospital São Lucas"
            actionLabel="Ver todas"
            onAction={() => navigate("/consultas")}
            variant="default"
          />

          <InfoCard
            icon={Pill}
            title="Você tem 2 medicamentos hoje"
            subtitle="Aspirina às 10h"
            description="Próximo: Losartana às 18h"
            actionLabel="Ver todos"
            onAction={() => navigate("/medicamentos")}
            variant="success"
          />
        </div>
      </main>

      {/* FAB */}
      <FloatingActionButton onClick={() => setShowAddDialog(true)} />

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">O que deseja adicionar?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              onClick={() => {
                setShowAddDialog(false);
                navigate("/consultas");
              }}
              size="lg"
              variant="outline"
              className="w-full justify-start text-lg h-16 border-2"
            >
              <Calendar className="mr-3 h-6 w-6" />
              Nova Consulta
            </Button>
            <Button
              onClick={() => {
                setShowAddDialog(false);
                navigate("/medicamentos");
              }}
              size="lg"
              variant="outline"
              className="w-full justify-start text-lg h-16 border-2"
            >
              <Pill className="mr-3 h-6 w-6" />
              Novo Medicamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <NavigationBar />
    </div>
  );
}
