import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Alert
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = () => {
    const predefinedUsername = ''; // Usuário predefinido
    const predefinedPassword = ''; // Senha predefinida

    if (username === predefinedUsername && password === predefinedPassword) {
      // Navegar para a tela principal ou área administrativa
      navigation.navigate("AdminTabs"); // Substitua "AdminArea" pela tela desejada
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos');
    }
  };

  // Componente para o efeito de digitação e apagamento
  const TypingEffect = () => {
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [index, setIndex] = useState(0);
    const fullText = 'Área Administrativa';

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
      }, isTyping ? 250 : 100); // Ajuste a velocidade de digitação e apagamento

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
          name={"arrow-back-outline"}
          color={colors.black}
          size={25}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Bem-vindo à </Text>
        <TypingEffect />
      </View>
      <Image source={require("../assets/admin2.png")} style={styles.bannerImage} />
      <View style={styles.formWrapper}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name={"person-outline"} size={30} color={colors.mediumBlue} />
            <TextInput
              style={styles.textInput}
              placeholder="Usuário"
              placeholderTextColor={colors.black}
              keyboardType="email-address"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={30} color={colors.mediumBlue} />
            <TextInput
              style={styles.textInput}
              placeholder="Senha"
              placeholderTextColor={colors.black}
              secureTextEntry={secureEntery}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setSecureEntery((prev) => !prev);
              }}
            >
              <SimpleLineIcons name={"eye"} size={20} color={colors.mediumBlue} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

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
    height: 40, // Defina uma altura fixa adequada
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
  bannerImage: {
    marginVertical: -100, // Ajuste para evitar o efeito de subir e descer
    width: '60%',
    resizeMode: 'contain',
    alignSelf: "center",
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
});
