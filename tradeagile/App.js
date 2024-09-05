import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading'; // Importar AppLoading
import * as Font from 'expo-font'; // Importar expo-font
import { colors } from './utils/colors'; // Certifique-se de que o caminho está correto

// Importar suas telas
import UserSignupScreen from './screen/UserSignupScreen'; // Tela de registro do cliente
import AdminProdutoScreen from './screen/AdminProdutoScreen'; // Tela de Produtos
import AdminFornecedorScreen from './screen/AdminFornecedorScreen'; // Tela de Fornecedores
import AdminUserScreen from './screen/UserAdminScreen'; // Tela de Administração de Clientes
import UserLoginScreen from './screen/UserLoginScreen'; // Tela de Login do Cliente
import AdminLoginScreen from './screen/AdminLoginScreen'; // Tela de Login do Admin
import UserProductsScreen from './screen/UserProductsScreen'; // Tela de Produtos do Usuário
import CheckoutScreen from './screen/CheckoutScreen';
import HomeScreen from './screen/HomeScreen'; // Tela Inicial

// Configuração das Navegações
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Função para carregar fontes
const loadFonts = () => {
  return Font.loadAsync({
    'RBlack': require('./assets/fonts/Roboto-Black.ttf'),
    'RBold': require('./assets/fonts/Roboto-Bold.ttf'),
    'RLight': require('./assets/fonts/Roboto-Light.ttf'),
    'RMedium': require('./assets/fonts/Roboto-Light.ttf'),
    'RRegular': require('./assets/fonts/Roboto-Regular.ttf'),
  });
};

// Tela de navegação principal com Bottom Tabs para Administradores
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Clientes':
              iconName = 'user';
              break;
            case 'Produtos':
              iconName = 'box';
              break;
            case 'Fornecedores':
              iconName = 'truck';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.darkBlue,
        tabBarInactiveTintColor: colors.lightBlue,
      })}
    >
      <Tab.Screen
        name="Clientes"
        component={AdminUserScreen}
        options={{ headerShown: false, title: 'Clientes' }}
      />
      <Tab.Screen
        name="Produtos"
        component={AdminProdutoScreen}
        options={{ headerShown: false, title: 'Produtos' }}
      />
      <Tab.Screen
        name="Fornecedores"
        component={AdminFornecedorScreen}
        options={{ headerShown: false, title: 'Fornecedores' }}
      />
    </Tab.Navigator>
  );
}

// Componente principal do aplicativo
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts()
      .then(() => setFontsLoaded(true))
      .catch(error => console.error(error));
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />; // Exibe um carregador enquanto as fontes são carregadas
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="UserLogin" component={UserLoginScreen} />
        <Stack.Screen name="UserSignup" component={UserSignupScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="UserProducts" component={UserProductsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
