import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import Icon from 'react-native-vector-icons/Ionicons';

// Importar imagens locais
const productImages = {
  '1': require('../assets/iphone.jpg'),
  '2': require('../assets/televisao.png'),
  '3': require('../assets/relogio.jpg'),
  '4': require('../assets/caixaDeSom.jpg'),
  '5': require('../assets/foneDeOuvido.jpg'),
  '6': require('../assets/camera.webp'),
  '7': require('../assets/videogame.png'),
  '8': require('../assets/macbook.jpg'),
};

const products = [
  { id: '1', name: 'Iphone 14', brand: 'Apple', price: 3900.17, image: productImages['1'] },
  { id: '2', name: 'Televisão Sony A80J (65")', brand: 'Sony', price: 4999.95, image: productImages['2'] },
  { id: '3', name: 'Relogio Galaxy Watch 5 (40mm)', brand: 'Samsung', price: 1399.90, image: productImages['3'] },
  { id: '4', name: 'Caixa de som JBL Charge 5', brand: 'JBL', price: 989.10, image: productImages['4'] },
  { id: '5', name: 'Fone de ouvido AirPods Pro (2ª geração)', brand: 'Apple', price: 1849.00, image: productImages['5'] },
  { id: '6', name: 'Câmera Canon EOS R5', brand: 'Canon', price: 40000.00, image: productImages['6'] },
  { id: '7', name: 'Videogame PlayStation 5 (Standard Edition)', brand: 'Sony', price: 3479.90, image: productImages['7'] },
  { id: '8', name: 'Mackbook Air (13 polegadas)', brand: 'Apple', price: 6300.40, image: productImages['8'] },
];

const ProductScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    setCart([...cart, { ...product, quantity }]);
    setMessage('Produto adicionado ao carrinho!');
    setTimeout(() => setMessage(''), 3000); // Limpa a mensagem após 3 segundos
  };

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleLogout = () => {
    navigation.navigate('UserLogin');
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={36} color={colors.darkBlue} />
        </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Escolha seu produto</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {products.map((product) => (
          <View key={product.id} style={styles.product}>
            <TouchableOpacity onPress={() => openImageModal(product.image)}>
              <Image source={product.image} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.details}>
              <View style={styles.detailsTop}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.brand}>{product.brand}</Text>
              </View>
              <View style={styles.detailsBottom}>
                <Text style={styles.price}>{formatPrice(product.price)}</Text>
                <TextInput
                  placeholder="Quantidade"
                  keyboardType="numeric"
                  value={quantities[product.id]?.toString() || ''}
                  onChangeText={(text) => setQuantities({ ...quantities, [product.id]: parseInt(text) || 1 })}
                  style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={() => handleAddToCart(product)}>
                  <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalImageWrapper} onPress={closeImageModal}>
            <Image source={selectedImage} style={styles.modalImage} />
          </TouchableOpacity>
        </View>
      </Modal>

      {message !== '' && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{message}</Text>
        </View>
      )}
      <View style={styles.checkoutButton}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Checkout', { cart, clearCartCallback: () => setCart([]) })}
        >
          <Text style={styles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 20,
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
  scrollContainer: {
    padding: 20,
  },
  product: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: 215,
  },
  image: {
    width: 150,
    height: 142,
    marginRight: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailsTop: {
    justifyContent: 'flex-start',
  },
  detailsBottom: {
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.RRegular,
    marginBottom: 10,
  },
  brand: {
    fontSize: 14,
    color: colors.mediumBlue,
    fontFamily: fonts.RRegular,
  },
  price: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.RMedium,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 20,
    padding: 5,
    width: 120,
    height: 35,
    textAlign: 'center',
    backgroundColor: colors.white,
    marginBottom: 10,
    fontFamily: fonts.RRegular,
  },
  button: {
    backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.darkBlue,
    marginTop: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.RMedium,
  },
  checkoutButton: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: colors.secondary,
    backgroundColor: colors.white,
  },
  toast: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -20 }],
    backgroundColor: colors.black,
    padding: 15,
    borderRadius: 5,
    zIndex: 1000,
    width: 200,
    alignItems: 'center',
  },
  toastText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.RRegular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default ProductScreen;
