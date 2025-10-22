import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verifica se existe um token no localStorage
  const token = localStorage.getItem('authToken');

  // Se não houver token, redireciona para a página de login
  if (!token) {
    // Poderíamos adicionar uma mensagem de erro aqui com toast, se quisermos
    return <Navigate to="/login" replace />;
  }

  // Se houver um token, permite o acesso à rota filha (usando <Outlet />)
  // NOTA: Uma verificação mais robusta poderia validar o token aqui (ex: verificar expiração)
  return <Outlet />;
};

export default ProtectedRoute;