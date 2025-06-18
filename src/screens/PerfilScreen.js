// src/screens/PerfilScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { syncTransactions } from '../services/syncService';

export default function PerfilScreen() {
  const { user, logout, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    try {
      setLoading(true);
      await syncTransactions(token);
      Alert.alert('Sucesso', 'Dados sincronizados com sucesso!');
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      Alert.alert('Erro', 'Falha ao sincronizar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.label}>Nome: {user?.nome}</Text>
      <Text style={styles.label}>Email: {user?.email}</Text>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <Button title="Sincronizar agora" onPress={handleSync} />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Sair" onPress={logout} color="#F44336" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 16, marginBottom: 12 },
  buttonContainer: { marginTop: 20 },
});
