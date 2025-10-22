import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Declarar a apiUrl uma vez fora do componente
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }

      // --- LÓGICA DE SUCESSO ---
      // 1. Guardar o token (vamos usar localStorage por simplicidade)
      localStorage.setItem('authToken', data.token);

      // 2. Redirecionar para o Dashboard
      toast.success("Login bem-sucedido!");
      navigate('/dashboard'); // Ou a sua rota principal

    } catch (error: any) {
      console.error("Erro de login:", error);
      toast.error(error.message || "Erro desconhecido no login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Bem-vindo!</CardTitle>
          <CardDescription>Faça login para aceder aos seus lembretes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-lg"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-lg"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
            <p className="text-center text-muted-foreground">
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')} // Navega para a página de registo
                className="font-semibold text-primary hover:underline"
                disabled={isLoading}
              >
                Registe-se aqui
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
