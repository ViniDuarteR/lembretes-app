export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('authToken');

  // Clona os headers existentes ou cria um novo objeto
  const headers = new Headers(options.headers || {});

  // Adiciona o header Authorization se o token existir
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // Realiza a chamada fetch com os headers atualizados
  const response = await fetch(url, {
    ...options, // Mantém outras opções (method, body, etc.)
    headers,   // Usa os headers (com ou sem o token)
  });

  // Tratamento básico de erro para tokens expirados ou inválidos
  if (response.status === 401) {
    // Token inválido ou expirado. Limpa o token e redireciona para o login.
    localStorage.removeItem('authToken');
    // Força um reload para que o ProtectedRoute redirecione
    window.location.href = '/login'; 
    // Lança um erro para interromper a execução atual
    throw new Error('Não autorizado ou token expirado.');
  }

  return response;
}