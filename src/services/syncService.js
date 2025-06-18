import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.44:3000';

export const syncTransactions = async (token) => {
  const localData = await AsyncStorage.getItem('transactions');
  const parsed = JSON.parse(localData || '[]');

  if (parsed.length === 0) return;

  await axios.post(`${API_URL}/sync`, { transactions: parsed }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // (opcional) Limpar local após sync:
  // await AsyncStorage.removeItem('transactions');
};
