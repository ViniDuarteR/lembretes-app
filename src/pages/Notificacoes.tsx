import { Bell, Heart, Calendar, Pill } from "lucide-react";
import { NavigationBar } from "@/components/NavigationBar";
import { Card } from "@/components/ui/card";

const mockNotifications = [
  {
    id: 1,
    type: "consulta",
    title: "Consulta com Cardiologista",
    datetime: "Hoje, 14:00",
    isPast: false
  },
  {
    id: 2,
    type: "medicamento",
    title: "Tomar Aspirina",
    datetime: "Hoje, 10:00",
    isPast: true
  },
  {
    id: 3,
    type: "medicamento",
    title: "Tomar Losartana",
    datetime: "Hoje, 18:00",
    isPast: false
  },
  {
    id: 4,
    type: "consulta",
    title: "Retorno Oftalmologista",
    datetime: "Amanhã, 10:00",
    isPast: false
  }
];

export default function Notificacoes() {
  const today = mockNotifications.filter(n => n.datetime.startsWith("Hoje"));
  const tomorrow = mockNotifications.filter(n => n.datetime.startsWith("Amanhã"));

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            <h1 className="text-3xl font-bold">Notificações</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
        {/* Hoje */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Hoje</h2>
          <div className="space-y-4">
            {today.map((notification) => (
              <Card
                key={notification.id}
                className={`p-6 transition-all ${
                  notification.isPast ? "opacity-60" : "hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${
                    notification.type === "consulta"
                      ? "bg-primary/10 text-primary"
                      : "bg-success/10 text-success"
                  }`}>
                    {notification.type === "consulta" ? (
                      <Calendar className="h-7 w-7" />
                    ) : (
                      <Pill className="h-7 w-7" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {notification.datetime}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Amanhã */}
        {tomorrow.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Amanhã</h2>
            <div className="space-y-4">
              {tomorrow.map((notification) => (
                <Card
                  key={notification.id}
                  className="p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${
                      notification.type === "consulta"
                        ? "bg-primary/10 text-primary"
                        : "bg-success/10 text-success"
                    }`}>
                      {notification.type === "consulta" ? (
                        <Calendar className="h-7 w-7" />
                      ) : (
                        <Pill className="h-7 w-7" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        {notification.datetime}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Navigation */}
      <NavigationBar />
    </div>
  );
}
