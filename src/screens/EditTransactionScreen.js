import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TransactionsContext } from '../context/TransactionsContext';
import { colors } from '../styles/theme';

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatMonthYear = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${year}`;
};

export default function EditTransactionScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { id } = params || {};
  const { transactions, updateTransaction, deleteTransaction } = useContext(TransactionsContext);

  const transaction = transactions.find((t) => t._id === id);

  const [type, setType] = useState(transaction?.tipo || 'despesa');
  const [description, setDescription] = useState(transaction?.descricao || '');
  const [value, setValue] = useState(transaction?.valor?.toString() || '');
  const [formaPagamento, setFormaPagamento] = useState(transaction?.formaPagamento || '');
  const [cartaoDescricao, setCartaoDescricao] = useState(transaction?.cartaoDescricao || '');
  const [parcelas, setParcelas] = useState(transaction?.parcelas?.toString() || '');
  const [devedor, setDevedor] = useState(transaction?.devedor || '');

  const [dataCompra, setDataCompra] = useState(transaction?.dataCompra ? new Date(transaction.dataCompra) : null);
  const [vencimento, setVencimento] = useState(transaction?.vencimento ? new Date(transaction.vencimento + '-01') : null);
  const [mesReferencia, setMesReferencia] = useState(transaction?.mesReferencia ? new Date(transaction.mesReferencia + '-01') : null);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState(null);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Transação não encontrada.</Text>
      </View>
    );
  }

  const handleConfirmDate = (date) => {
    if (pickerMode === 'dataCompra') setDataCompra(date);
    if (pickerMode === 'vencimento') setVencimento(date);
    if (pickerMode === 'mesReferencia') setMesReferencia(date);
    setDatePickerVisible(false);
  };

  const handleUpdate = async () => {
    if (!description || !value || !dataCompra) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const updated = {
      tipo: type,
      descricao: description,
      valor: parseFloat(value.replace(',', '.')),
      dataCompra: dataCompra.toISOString(),
      ...(type === 'despesa' && {
        formaPagamento,
        cartaoDescricao: formaPagamento === 'cartao' ? cartaoDescricao : '',
        parcelas: formaPagamento === 'cartao' ? Number(parcelas) : 1,
        vencimento: vencimento ? formatMonthYear(vencimento) : '',
        devedor,
        mesReferencia: mesReferencia ? formatMonthYear(mesReferencia) : '',
      }),
      ...(type === 'receita' && {
        mesReferencia: mesReferencia ? formatMonthYear(mesReferencia) : '',
      }),
    };

    await updateTransaction(id, updated);
    Alert.alert('Sucesso', 'Transação atualizada com sucesso!');
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo:</Text>
      <Picker selectedValue={type} style={styles.picker} onValueChange={setType}>
        <Picker.Item label="Receita" value="receita" />
        <Picker.Item label="Despesa" value="despesa" />
      </Picker>

      <Text style={styles.label}>Descrição:</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Descrição" />

      {type === 'despesa' && (
        <>
          <Text style={styles.label}>Forma de Pagamento:</Text>
          <Picker selectedValue={formaPagamento} style={styles.picker} onValueChange={setFormaPagamento}>
            <Picker.Item label="Pix" value="pix" />
            <Picker.Item label="Débito" value="debito" />
            <Picker.Item label="Cartão" value="cartao" />
          </Picker>

          {formaPagamento === 'cartao' && (
            <>
              <Text style={styles.label}>Cartão:</Text>
              <TextInput style={styles.input} value={cartaoDescricao} onChangeText={setCartaoDescricao} placeholder="Descrição do cartão" />
              <Text style={styles.label}>Parcelas:</Text>
              <TextInput style={styles.input} value={parcelas} onChangeText={setParcelas} keyboardType="numeric" placeholder="Parcelas" />
            </>
          )}

          <Text style={styles.label}>Devedor:</Text>
          <TextInput style={styles.input} value={devedor} onChangeText={setDevedor} placeholder="Nome do devedor" />

          <TouchableOpacity onPress={() => { setPickerMode('dataCompra'); setDatePickerVisible(true); }}>
            <Text style={styles.label}>Data da Compra: {dataCompra ? formatDate(dataCompra) : 'Selecionar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setPickerMode('vencimento'); setDatePickerVisible(true); }}>
            <Text style={styles.label}>Vencimento 1ª Parcela: {vencimento ? formatMonthYear(vencimento) : 'Selecionar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setPickerMode('mesReferencia'); setDatePickerVisible(true); }}>
            <Text style={styles.label}>Mês de Referência: {mesReferencia ? formatMonthYear(mesReferencia) : 'Selecionar'}</Text>
          </TouchableOpacity>
        </>
      )}

      {type === 'receita' && (
        <>
          <TouchableOpacity onPress={() => { setPickerMode('mesReferencia'); setDatePickerVisible(true); }}>
            <Text style={styles.label}>Mês de Referência: {mesReferencia ? formatMonthYear(mesReferencia) : 'Selecionar'}</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.label}>Valor:</Text>
      <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="numeric" placeholder="Valor" />

      <Button title="Salvar alterações" onPress={handleUpdate} color={colors.primary} />
      <View style={{ height: 10 }} />
      <Button title="Excluir" color={colors.danger} onPress={handleDelete} />

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  label: { fontWeight: 'bold', marginTop: 10, color: colors.label },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  picker: {
    marginTop: 4,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  empty: { textAlign: 'center', marginTop: 50, color: colors.text },
});
