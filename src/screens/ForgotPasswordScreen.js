import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { colors } from '../styles/theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Informe seu e-mail');
      return;
    }

    try {
      await axios.post('http://192.168.0.44:3001/auth/forgot-password', { email });
      Alert.alert('Sucesso', 'Se o e-mail existir, enviaremos um link de redefinição');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao solicitar redefinição:', error);
      Alert.alert('Erro', error?.response?.data?.msg || 'Tente novamente mais tarde');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir Senha</Text>

      <Text style={styles.label}>Digite seu e-mail cadastrado:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendReset}>
        <Text style={styles.buttonText}>Enviar link de redefinição</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.primary,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.label,
  },
  input: {
    height: 50,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
