import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionItem({ item }) {
  const cor = item.tipo === 'receita' ? '#00c853' : '#d50000';
  const icone = item.tipo === 'receita' ? 'arrow-down' : 'arrow-up';

  return (
    <View style={styles.item}>
      <Ionicons name={icone} size={24} color={cor} style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.descricao}>{item.descricao}</Text>
        <Text style={[styles.valor, { color: cor }]}>
          {item.tipo === 'despesa' ? '-' : '+'} R$ {parseFloat(item.valor).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  descricao: {
    fontSize: 16,
    fontWeight: '500',
  },
  valor: {
    fontSize: 16,
  },
});
