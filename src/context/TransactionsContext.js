import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const { token } = useAuth();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://192.168.0.44:3001/api/transacoes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
      await AsyncStorage.setItem('@transactions', JSON.stringify(res.data)); // opcional
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      console.log('📦 Enviando transação:', transaction);

      await axios.post('http://192.168.0.44:3001/api/transacoes', transaction, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTransactions();
    } catch (error) {
      console.error('❌ Erro ao adicionar transação:', error.response?.data || error.message);
    }
  };


  const updateTransaction = async (id, updatedData) => {
    try {
      await axios.put(`http://192.168.0.44:3001/api/transacoes/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`http://192.168.0.44:3001/api/transacoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
    }
  };

  useEffect(() => {
    if (token) fetchTransactions();
  }, [token]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
