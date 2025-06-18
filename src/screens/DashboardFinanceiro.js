import React, { useContext } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { TransactionsContext } from '../context/TransactionsContext';

const screenWidth = Dimensions.get('window').width;

export default function DashboardFinanceiro() {
  const { transactions } = useContext(TransactionsContext);

  const receitas = transactions.filter(t => t.tipo === 'receita');
  const despesas = transactions.filter(t => t.tipo === 'despesa');

  const totalReceitas = receitas.reduce((sum, r) => sum + (Number(r.valor) || 0), 0);
  const totalDespesas = despesas.reduce((sum, d) => sum + (Number(d.valor) || 0), 0);
  const saldo = totalReceitas - totalDespesas;

  const despesasPorCategoria = {};
  despesas.forEach(d => {
    const categoria = d.categoria || 'Outros';
    despesasPorCategoria[categoria] = (despesasPorCategoria[categoria] || 0) + (Number(d.valor) || 0);
  });

  const pieData = Object.keys(despesasPorCategoria).map((cat, index) => ({
    name: cat,
    value: despesasPorCategoria[cat],
    color: ['#FF6384', '#36A2EB', '#FFCE56', '#00C853'][index % 4],
    legendFontColor: '#333',
    legendFontSize: 12,
    key: `pie-${cat}-${index}`,
  }));

  const meses = [...new Set(transactions.map(t => t.mesReferencia))];
  const barData = {
    labels: meses,
    datasets: [
      {
        data: meses.map(m =>
          transactions
            .filter(t => t.tipo === 'receita' && t.mesReferencia === m)
            .reduce((sum, t) => sum + (Number(t.valor) || 0), 0)
        ),
        color: () => '#00c853',
        label: 'Receitas',
      },
      {
        data: meses.map(m =>
          transactions
            .filter(t => t.tipo === 'despesa' && t.mesReferencia === m)
            .reduce((sum, t) => sum + (Number(t.valor) || 0), 0)
        ),
        color: () => '#ff5252',
        label: 'Despesas',
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumo Financeiro</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Receitas: R$ {totalReceitas.toFixed(2)}</Text>
        <Text style={styles.label}>Despesas: R$ {totalDespesas.toFixed(2)}</Text>
        <Text style={styles.label}>Saldo: R$ {saldo.toFixed(2)}</Text>
      </View>

      <Text style={styles.chartTitle}>Despesas por Categoria</Text>
      <PieChart
        data={pieData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      <Text style={styles.chartTitle}>Receitas vs Despesas</Text>
      <BarChart
        data={barData}
        width={screenWidth}
        height={280}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
        withHorizontalLabels
      />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  labelColor: () => '#333',
  barPercentage: 0.6,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 16 },
  card: {
    backgroundColor: '#e0f2f1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 4,
    color: '#333',
  },
});

