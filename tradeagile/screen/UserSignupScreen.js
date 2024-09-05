import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Linking, Image, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const SignupScreen = () => {
  const [secureEntry, setSecureEntry] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  // Função para registrar o usuário
  const handleRegister = async () => {
    if (!username || !password || !phone) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const newUser = { id: Date.now().toString(), username, password, phone };

    try {
      const usersString = await AsyncStorage.getItem('users');
      const users = usersString ? JSON.parse(usersString) : [];
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Navegar para a tela de login
      navigation.navigate('UserLogin');
    } catch (error) {
      console.error('Failed to save user', error);
      alert('Ocorreu um erro ao salvar o usuário.');
    }
  };

  // Efeito de digitação
  const TypingEffect = () => {
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [index, setIndex] = useState(0);
    const fullText = 'Trade!';

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
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" color={colors.primary} size={25} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Crie sua conta</Text>
        <Text style={styles.headingText}>e comece a explorar a</Text>
        <TypingEffect />
      </View>

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
          <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
            <SimpleLineIcons name={secureEntry ? 'eye' : 'eye-off'} size={20} color={colors.mediumBlue} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="screen-smartphone" size={30} color={colors.mediumBlue} />
          <TextInput
            style={styles.textInput}
            placeholder="(XX) XXXXX-XXXX"
            placeholderTextColor={colors.black}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleRegister}>
          <Text style={styles.loginText}>Registre-se</Text>
        </TouchableOpacity>
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
          <Text style={styles.accountText}>Já tem conta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
            <Text style={styles.signupText}>Faça o login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  textContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  headingText: {
    fontSize: 28,
    color: colors.primary,
    fontFamily: fonts.RBold,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    height: 50,
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
    fontFamily: fonts.Rblack,
    textAlign: "center",
    padding: 10,
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
  typingEffectContainer: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    color: colors.mediumBlue,
    fontFamily: fonts.RBold,
    fontSize: 33,
  },
});

export default SignupScreen;
