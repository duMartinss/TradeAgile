import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleAdm = () => {
    navigation.navigate("AdminLogin");
  };

  const handleUser = () => {
    navigation.navigate("UserLogin");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/tradeAgile.png")} style={styles.bannerImage} />
      <Text style={styles.title}>
        Selecione entre <Text style={styles.highlight}>Administrador</Text> ou <Text style={styles.highlight}>Usuário</Text>
      </Text>
      <Text style={styles.subTitle}>
        Para acessar o <Text style={styles.highlight}>Trade Agile</Text>, selecione Administrador ou Usuário e acesse suas vendas de tecnologia.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: colors.darkBlue },
          ]}
          onPress={handleAdm}
        >
          <Text style={styles.loginButtonText}>ADM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper]}
          onPress={handleUser}
        >
          <Text style={styles.signupButtonText}>USUARIO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  bannerImage: {
    marginVertical: 130,
    width: '80%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 29,
    fontFamily: fonts.RMedium,
    paddingHorizontal: 0,
    textAlign: "center",
    color: colors.primary,
    marginTop: -50,
  },
  subTitle: {
    fontSize: 17,
    paddingHorizontal: 20,
    textAlign: "center",
    color: colors.secondary,
    fontFamily: fonts.RLight,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.black,
    width: "80%",
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    borderRadius: 98,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.RBlack,
  },
  signupButtonText: {
    fontSize: 18,
    fontFamily: fonts.RBlack,
  },
  highlight: {
    color: colors.mediumBlue,
    fontFamily: fonts.RMedium
  },
});
