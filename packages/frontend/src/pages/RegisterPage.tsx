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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples de password
    if (password !== confirmPassword) {
      toast.error("As passwords não coincidem.");
      return;
    }
    if (password.length < 6) {
        toast.error("A password deve ter pelo menos 6 caracteres.");
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Assume que o backend envia uma mensagem de erro útil em data.error
        throw new Error(data.error || 'Falha no registo');
      }

      // --- LÓGICA DE SUCESSO ---
      toast.success("Registo bem-sucedido! Faça login para continuar.");
      navigate('/login'); // Redireciona para a página de login

    } catch (error: any) {
      console.error("Erro de registo:", error);
      toast.error(error.message || "Erro desconhecido no registo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Insira os seus dados para se registar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
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
                placeholder="Pelo menos 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 text-lg"
                required
                disabled={isLoading}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-lg">Confirmar Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 text-lg"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Registar"
              )}
            </Button>
            <p className="text-center text-muted-foreground">
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')} // Navega de volta para o login
                className="font-semibold text-primary hover:underline"
                disabled={isLoading}
              >
                Faça login aqui
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
