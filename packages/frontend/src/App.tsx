import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 

// Importar todas as páginas
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Consultas from "./pages/Consultas";
import Medicamentos from "./pages/Medicamentos";
import Notificacoes from "./pages/Notificacoes";
import NotFound from "./pages/NotFound";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
// Remover a importação do RootRedirect

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rota Raiz continua a ser a Home */}
          <Route path="/" element={<Home />} />

          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/medicamentos" element={<Medicamentos />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
          </Route>

          {/* Rota Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

