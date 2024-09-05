import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Linking,
  Alert
} from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSignup = () => {
    navigation.navigate("UserSignup");
  };

  const handleLogin = async () => {
    try {
      const usersString = await AsyncStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : [];

      const user = users.find(user => user.username === username && user.password === password);

      if (user) {
        navigation.navigate('UserProducts'); // Navega para a tela de produtos
      } else {
        Alert.alert('Erro', 'Nome de usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Failed to retrieve users', error);
      Alert.alert('Erro', 'Ocorreu um erro ao autenticar o usuário.');
    }
  };

  // Componente para o efeito de digitação e apagamento
  const TypingEffect = () => {
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [index, setIndex] = useState(0);
    const fullText = 'mais!';

    useEffect(() => {
      const typingInterval = setInterval(() => {
        if (isTyping) {
          if (index < fullText.length) {
            setText(fullText.slice(0, index + 1));
            setIndex(prevIndex => prevIndex + 1);
          } else {
            setIsTyping(false);
          }
        } else {
          if (index > 0) {
            setText(fullText.slice(0, index - 1));
            setIndex(prevIndex => prevIndex - 1);
          } else {
            setIsTyping(true);
          }
        }
      }, isTyping ? 550 : 150); // Ajuste a velocidade de digitação e apagamento

      return () => clearInterval(typingInterval);
    }, [index, isTyping]);

    return (
      <View style={styles.typingEffectContainer}>
        <Animated.Text style={styles.highlight}>
          {text}
        </Animated.Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name="arrow-back-outline"
          color={colors.black}
          size={25}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Acesse sua conta</Text>
        <Text style={styles.headingText}>e descubra <TypingEffect /></Text>
      </View>
      <View style={styles.formWrapper}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={30} color={colors.mediumBlue} />
            <TextInput
              style={styles.textInput}
              placeholder="Usuário"
              placeholderTextColor={colors.black}
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name="lock" size={30} color={colors.mediumBlue} />
            <TextInput
              style={styles.textInput}
              placeholder="Senha"
              placeholderTextColor={colors.black}
              secureTextEntry={secureEntry}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setSecureEntry(prev => !prev)}
            >
              <Ionicons name={secureEntry ? "eye" : "eye-off"} size={20} color={colors.mediumBlue} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.loginButtonWrapper}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.continueText}>ou continue com</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://accounts.google.com/AccountChooser/signinchooser?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&flowName=GlifWebSignIn&flowEntry=AccountChooser&ec=asw-gmail-globalnav-signin&ddm=0")}
          style={styles.googleButtonContainer}
        >
          <Image
            source={require("../assets/google.png")}
            style={styles.googleImage}
          />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>Não tem conta?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Faça o registro</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'center', // Centraliza verticalmente
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  textContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  typingEffectContainer: {
    height: 35, // Defina uma altura fixa adequada
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'center', // Alinha o formContainer verticalmente no centro do container
  },
  formContainer: {
    marginVertical: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.RLight,
  },
  loginButtonWrapper: {
    backgroundColor: colors.darkBlue,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.RMedium,
    textAlign: "center",
    padding: 10,
  },
  headingText: {
    fontSize: 35,
    color: colors.black,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  highlight: {
    color: colors.mediumBlue,
    fontSize: 35,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    fontFamily: fonts.RRegular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
    fontFamily: fonts.RBold,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.RRegular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.RBold,
  },
});

export default LoginScreen;
