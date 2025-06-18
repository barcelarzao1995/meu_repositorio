import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/pt-br';
import { TransactionsContext } from '../context/TransactionsContext';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/theme'; // importe as cores da paleta

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const { addTransaction } = useContext(TransactionsContext);

  const [tipo, setTipo] = useState('despesa');
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [cartaoDescricao, setCartaoDescricao] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [vencimento, setVencimento] = useState('');
  const [devedor, setDevedor] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [mesReferencia, setMesReferencia] = useState('');

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dateField, setDateField] = useState('');

  const showDatePicker = (field) => {
    setDateField(field);
    setDatePickerVisible(true);
  };

  const handleDateConfirm = (date) => {
    if (dateField === 'dataCompra') {
      setDataCompra(moment(date).format('DD/MM/YYYY'));
    } else if (dateField === 'vencimento') {
      setVencimento(moment(date).format('MM/YYYY'));
    } else if (dateField === 'mesReferencia') {
      setMesReferencia(moment(date).format('MM/YYYY'));
    }
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (!descricao || !valor || !dataCompra) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const nova = {
      tipo,
      descricao,
      valor: parseFloat(valor.replace(',', '.')),
      dataCompra: moment(dataCompra, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      ...(tipo === 'despesa' && {
        formaPagamento,
        cartaoDescricao: formaPagamento === 'cartao' ? cartaoDescricao : '',
        parcelas: formaPagamento === 'cartao' ? Number(parcelas) : 1,
        vencimento,
        devedor,
        mesReferencia,
      }),
      ...(tipo === 'receita' && { mesReferencia }),
    };

    await addTransaction(nova);
    Alert.alert('Sucesso', 'Transação cadastrada com sucesso!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tipo:</Text>
      <Picker selectedValue={tipo} style={styles.picker} onValueChange={setTipo}>
        <Picker.Item label="Receita" value="receita" />
        <Picker.Item label="Despesa" value="despesa" />
      </Picker>

      <Text style={styles.label}>Descrição:</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />

      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      {tipo === 'despesa' && (
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
              <TextInput style={styles.input} value={cartaoDescricao} onChangeText={setCartaoDescricao} />
              <Text style={styles.label}>Parcelas:</Text>
              <TextInput style={styles.input} value={parcelas} onChangeText={setParcelas} keyboardType="numeric" />
            </>
          )}

          <Text style={styles.label}>Devedor:</Text>
          <TextInput style={styles.input} value={devedor} onChangeText={setDevedor} />

          <Text style={styles.label}>Data da Compra:</Text>
          <TouchableOpacity onPress={() => showDatePicker('dataCompra')}>
            <TextInput style={styles.input} value={dataCompra} editable={false} placeholder="Selecionar data" />
          </TouchableOpacity>

          <Text style={styles.label}>Vencimento 1ª Parcela:</Text>
          <TouchableOpacity onPress={() => showDatePicker('vencimento')}>
            <TextInput style={styles.input} value={vencimento} editable={false} placeholder="Selecionar mês/ano" />
          </TouchableOpacity>

          <Text style={styles.label}>Mês de Referência:</Text>
          <TouchableOpacity onPress={() => showDatePicker('mesReferencia')}>
            <TextInput style={styles.input} value={mesReferencia} editable={false} placeholder="Selecionar mês/ano" />
          </TouchableOpacity>
        </>
      )}

      {tipo === 'receita' && (
        <>
          <Text style={styles.label}>Mês de Referência:</Text>
          <TouchableOpacity onPress={() => showDatePicker('mesReferencia')}>
            <TextInput style={styles.input} value={mesReferencia} editable={false} placeholder="Selecionar mês/ano" />
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cadastrar Transação</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
        locale="pt-BR"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    backgroundColor: colors.background,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    color: colors.label,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    color: colors.text,
  },
  picker: {
    marginTop: 10,
    backgroundColor: colors.surface,
    borderRadius: 15,
  },
  button: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
