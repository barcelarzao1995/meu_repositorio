import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TransactionsContext } from '../context/TransactionsContext';
import theme from '../constants/theme'; // Certifique-se de que o caminho está correto

export default function HomeScreen() {
  const navigation = useNavigation();
  const { transactions } = useContext(TransactionsContext);

  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={[
      styles.card,
      {
        borderLeftColor: item.tipo === 'despesa' ? 'red' : 'green',
        borderLeftWidth: 5,
      },
    ]}
    onPress={() => navigation.navigate('EditTransaction', { id: item._id })}
  >
    <Text style={styles.tipo}>{item.tipo?.toUpperCase()}</Text>
    {item.formaPagamento && (
      <Text style={styles.info}>Forma de pagamento: {item.formaPagamento}</Text>
    )}
    {item.devedor && (
      <Text style={styles.info}>Devedor: {item.devedor}</Text>
    )}
    {item.mesReferencia && (
      <Text style={styles.info}>Mês de referência: {item.mesReferencia}</Text>
    )}
    <Text style={styles.valor}>R$ {item.valor?.toFixed(2)}</Text>
  </TouchableOpacity>
);



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Início</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma transação encontrada.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Adicionar')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  header: {
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  card: {
    backgroundColor: theme.colors.label,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tipo: {
    fontWeight: 'bold',
    color: theme.colors.label,
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: theme.colors.text,
  },
  valor: {
    marginTop: 6,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  info: {
  fontSize: 14,
  color: theme.colors.text,
  marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.text,
    marginTop: 50,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    bottom: 16,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 28,
    color: theme.colors.white,
  },
});
