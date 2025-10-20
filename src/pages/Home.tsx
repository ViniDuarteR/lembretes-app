import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Calendar, Pill, Bell } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            <h1 className="text-3xl font-bold text-foreground">Saúde</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Cuidando de quem você ama
            </h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Gerencie lembretes de medicamentos e consultas médicas de forma simples, clara e acessível
            </p>
          </div>
          
          <Button 
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="text-xl px-12 py-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Acessar Painel
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Consultas</h3>
            <p className="text-lg text-muted-foreground">
              Agende e acompanhe todas as consultas médicas em um só lugar
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-success/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Pill className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Medicamentos</h3>
            <p className="text-lg text-muted-foreground">
              Lembretes automáticos para nunca esquecer seus remédios
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Bell className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Notificações</h3>
            <p className="text-lg text-muted-foreground">
              Alertas claros e no momento certo para sua tranquilidade
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="max-w-screen-xl mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground text-lg">
            © 2025 - Assistente de Saúde
          </p>
        </div>
      </footer>
    </div>
  );
}
