import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://192.168.0.44:3001/api'; // atualize se mudar o IP

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('token');
        const usuarioSalvo = await AsyncStorage.getItem('usuario');

        if (tokenSalvo && usuarioSalvo) {
          setToken(tokenSalvo);
          setUser(JSON.parse(usuarioSalvo));
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenSalvo}`;
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const login = async (email, senha) => {
    try {
      
      const response = await axios.post(`${API_BASE}/auth/login`, { email, senha });
      const { token, usuario } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

      setToken(token);
      setUser(usuario);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await sincronizar(); // Sincroniza automaticamente ao logar
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      Alert.alert('Erro', err.response?.data?.msg || 'Não foi possível fazer login.');
    }
  };

  const register = async (nome, email, senha) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, { nome, email, senha });
      const { token, usuario } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

      setToken(token);
      setUser(usuario);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (err) {
      console.error('Erro ao registrar:', err);
      Alert.alert('Erro', err.response?.data?.msg || 'Não foi possível registrar.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const sincronizar = async () => {
    try {
      const response = await axios.post(`${API_BASE}/sync/sincronizar`);
      console.log('✅ Dados sincronizados com o servidor');
    } catch (err) {
      console.error('Erro ao sincronizar:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      sincronizar,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Exporta o hook para ser usado nos componentes
export const useAuth = () => useContext(AuthContext);
