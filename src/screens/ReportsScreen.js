// src/screens/ReportsScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { TransactionsContext } from '../context/TransactionsContext';

const ReportsScreen = () => {
  const { transactions } = useContext(TransactionsContext);

  const screenWidth = Dimensions.get('window').width;

  // Agrupar transações por tipo com validação de valor
  const totals = transactions.reduce(
    (acc, item) => {
      const valor = parseFloat(item.valor);
      const valorSeguro = isNaN(valor) ? 0 : valor;

      if (item.tipo === 'receita') {
        acc.receita += valorSeguro;
      } else {
        acc.despesa += valorSeguro;
      }

      if (item.tipo === 'despesa' && item.devedor) {
        acc.porDevedor[item.devedor] = (acc.porDevedor[item.devedor] || 0) + valorSeguro;
      }

      return acc;
    },
    { receita: 0, despesa: 0, porDevedor: {} }
  );

  const pieData = [
  {
    name: 'Receitas',
    value: totals.receita,
    color: '#4CAF50',
    legendFontColor: '#333',
    legendFontSize: 14,
    key: 'receitas',
  },
  {
    name: 'Despesas',
    value: totals.despesa,
    color: '#F44336',
    legendFontColor: '#333',
    legendFontSize: 14,
    key: 'despesas',
  }
];


  const barData = {
    labels: Object.keys(totals.porDevedor),
    datasets: [
      {
        data: Object.values(totals.porDevedor),
      }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumo Financeiro</Text>

      <Text style={styles.subtitle}>Distribuição</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="16"
        absolute
      />

      <Text style={styles.subtitle}>Despesas por Devedor</Text>
      <BarChart
        data={barData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        style={styles.chart}
      />
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: () => '#333',
  barPercentage: 0.7
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  subtitle: {
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8
  },
  chart: {
    marginVertical: 8
  }
});

export default ReportsScreen;
