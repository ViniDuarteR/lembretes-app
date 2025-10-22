import React from 'react';
import { Navigate } from 'react-router-dom';

const RootRedirect = () => {
  // Verifica se existe um token no localStorage
  const token = localStorage.getItem('authToken');

  // Se houver token, redireciona para o Dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se não houver token, redireciona para a página de Login
  return <Navigate to="/login" replace />;
};

export default RootRedirect;