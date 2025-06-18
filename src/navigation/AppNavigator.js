import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import theme from '../constants/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';
import ReportsScreen from '../screens/ReportsScreen';
import DashboardFinanceiro from '../screens/DashboardFinanceiro';
import PerfilScreen from '../screens/PerfilScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Início':
            iconName = 'home';
            break;
          case 'Adicionar':
            iconName = 'add-circle';
            break;
          case 'Dashboard':
            iconName = 'pie-chart';
            break;
          case 'Relatórios':
            iconName = 'bar-chart';
            break;
          case 'Perfil':
            iconName = 'person';
            break;
          default:
            iconName = 'ellipse';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.colors.background,
      tabBarInactiveTintColor: theme.colors.gray,
      tabBarStyle: {
        backgroundColor: theme.colors.primary,
        borderTopColor: theme.colors.accent,
        borderTopWidth: 1,
      },
      tabBarLabelStyle: {
        fontWeight: 'bold',
      },
    })}
  >
    <Tab.Screen name="Início" component={HomeScreen} />
    <Tab.Screen name="Adicionar" component={AddTransactionScreen} />
    <Tab.Screen name="Dashboard" component={DashboardFinanceiro} />
    <Tab.Screen name="Relatórios" component={ReportsScreen} />
    <Tab.Screen name="Perfil" component={PerfilScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditTransaction"
            component={EditTransactionScreen}
            options={{ title: 'Editar Transação' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cadastro"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AdicionarTransacao"
            component={AddTransactionScreen}
            options={{ title: 'Nova Transação' }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ title: 'Recuperar Senha' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
