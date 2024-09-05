import React, { useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import { colors } from '../utils/colors'; // Importar as cores
import { fonts } from '../utils/fonts'; // Importar as fontes
import Ionicons from "react-native-vector-icons/Ionicons"; // Importar a biblioteca de ícones

const CheckoutScreen = ({ route, navigation }) => {
  const { cart, clearCartCallback } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (paymentMethod === 'card') {
      total += total * 0.01; // Adiciona 1% para pagamento com cartão
    }
    return total;
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handlePayment = () => {
    Alert.alert(
      'Pedido Finalizado',
      `Forma de pagamento: ${paymentMethod === 'cash' ? 'Dinheiro' : 'Cartão'}\nTotal: ${formatCurrency(calculateTotal())}`
    );
    generatePDF().then(() => {
      if (clearCartCallback) clearCartCallback();
      navigation.goBack();
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao gerar o PDF.');
    });
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Resumo do Pedido', 10, 10);
      doc.setFontSize(12);
      cart.forEach((item, index) => {
        doc.text(`${item.name} ${item.quantity} x ${formatCurrency(item.price)}`, 10, 20 + index * 10);
      });
      doc.text(`Total: ${formatCurrency(calculateTotal())}`, 10, 30 + cart.length * 10);
      doc.text(`Forma de pagamento: ${paymentMethod === 'cash' ? 'Dinheiro' : 'Cartão'}`, 10, 40 + cart.length * 10);
      doc.setFontSize(10);
      doc.text("Obrigado pela sua compra!", 10, 290);
      const pdfBase64 = doc.output('datauristring');
      const uri = FileSystem.documentDirectory + 'pedido.pdf';
      await FileSystem.writeAsStringAsync(uri, pdfBase64.split(',')[1], { encoding: FileSystem.EncodingType.Base64 });
      Alert.alert('Pedido Finalizado', `Resumo do pedido:\n${cart.map(item => `${item.name} ${item.quantity} x ${formatCurrency(item.price)}`).join('\n')}\nTotal: ${formatCurrency(calculateTotal())}\n\nPedido salvo em: ${uri}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    navigation.navigate('UserProducts'); 
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="arrow-back" size={36} color={colors.darkBlue} />
        </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Resumo do Pedido</Text>
      </View>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>Quantidade: {item.quantity}</Text>
            <Text style={styles.itemDetails}>Preço unitário: {formatCurrency(item.price)}</Text>
          </View>
        )}
      />
      <Text style={styles.total}>Total: {formatCurrency(calculateTotal())}</Text>
      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'cash' && styles.selectedButton]}
          onPress={() => setPaymentMethod('cash')}
        >
          <Text style={styles.buttonText}>Pagar com Dinheiro</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentButton, paymentMethod === 'card' && styles.selectedButton]}
          onPress={() => setPaymentMethod('card')}
        >
          <Text style={styles.buttonText}>Pagar com Cartão</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.finalizeButton} onPress={handlePayment}>
        <Text style={styles.finalizeButtonText}>Finalizar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumBlue,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logoutButton: {
    marginLeft: 15,
    top: 30,
    width: 50,
    height: 50
  },
  title: {
    fontSize: 20,
    color: colors.black,
    fontFamily: fonts.RBold,
    textAlign: 'center',
    justifyContent: 'center'
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBlue,
    paddingVertical: 10,
  },
  itemName: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fonts.RMedium,
  },
  itemDetails: {
    fontSize: 16,
    color: colors.gray,
    fontFamily: fonts.RRegular,
  },
  total: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: 'center',
    borderColor: colors.mediumBlue,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: colors.white,
    fontFamily: fonts.RBold,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentButton: {
    backgroundColor: colors.mediumBlue,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mediumBlue,
  },
  selectedButton: {
    backgroundColor: colors.darkBlue,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  finalizeButton: {
    backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.mediumBlue,
  },
  finalizeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.RMedium,
  },
});

export default CheckoutScreen;
