import { Home, Calendar, Pill, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Painel", icon: Home },
  { path: "/consultas", label: "Consultas", icon: Calendar },
  { path: "/medicamentos", label: "Remédios", icon: Pill },
  { path: "/notificacoes", label: "Avisos", icon: Bell }
];

export function NavigationBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 px-6 rounded-xl transition-all duration-200 min-w-[80px] ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-7 w-7" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
