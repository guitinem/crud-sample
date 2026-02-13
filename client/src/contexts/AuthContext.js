import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Verifica se há token ao carregar a aplicação
  useEffect(() => {
    const storedToken = Cookies.get('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Configura o axios para usar o token em todas as requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      
      // Aqui você pode fazer uma requisição para buscar os dados do usuário
      // Por enquanto, vamos apenas marcar como autenticado
      setUser({ token: storedToken });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );

      const { token: authToken, user: userData } = response.data;

      // Armazena o token no cookie (sessão expira em 7 dias)
      Cookies.set('auth_token', authToken, { expires: 7, sameSite: 'strict' });
      
      setToken(authToken);
      setUser(userData || { email });
      
      // Configura o axios para usar o token
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.',
      };
    }
  };

  const logout = () => {
    // Remove o token do cookie
    Cookies.remove('auth_token');
    
    // Remove o token do axios
    delete axios.defaults.headers.common['Authorization'];
    
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!Cookies.get('auth_token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
