import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Recuperar o segredo do ambiente ou usar um padrão (APENAS para dev)
const JWT_SECRET = process.env.JWT_SECRET || 'SEU_SEGREDO_SUPER_SECRETO_AQUI';

// Estender a interface Request do Express para incluir a propriedade 'user'
interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // 1. Obter o token do cabeçalho 'Authorization'
  const authHeader = req.headers.authorization;

  // 2. Verificar se o token existe e está no formato correto ("Bearer TOKEN")
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificar se o token é válido usando o nosso segredo
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    // 4. Se for válido, anexar os dados do utilizador ao objeto 'req'
    req.user = decoded;

    // 5. Chamar 'next()' para permitir que o pedido continue para a rota pretendida
    next();
  } catch (error) {
    // Se o token for inválido (expirado, malformado, etc.)
    console.error("Erro na verificação do token:", error);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};