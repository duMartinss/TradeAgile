import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Image, Alert } from 'react-native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AdminProdutoScreen = ({ navigation }) => {
  const [products, setProducts] = useState([
    { id: '1', name: 'Iphone 14', brand: 'Apple', price: 3900.17, image: null }, // preço em centavos
    { id: '2', name: 'Televisão Sony A80J (65")', brand: 'Sony', price: 4999.95, image: null }, // preço em centavos
    { id: '1', name: 'Relógio Galaxy Watch 5 (40mm)', brand: 'Samsung', price: 1399.90, image: null }, // preço em centavos
    { id: '2', name: 'Caixa de Som JBL Charge 5', brand: 'JBL', price: 989.10, image: null }, // preço em centavos
    { id: '1', name: 'Fone de Ouvido AirPods Pro (2ª geração)', brand: 'Apple', price: 1849.00, image: null }, // preço em centavos
    { id: '2', name: 'Câmera Canon EOS R5', brand: 'Canon', price: 40000.00, image: null }, // preço em centavos
    { id: '1', name: 'Videogame PlaySation 5 (Standard Edition)', brand: 'Sony', price: 3479.00, image: null }, // preço em centavos
    { id: '2', name: 'MackBook Air (13")', brand: 'Apple', price: 6300.40, image: null }, // preço em centavos
  ]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', brand: '', price: '', image: null });

  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Desculpe, precisamos de permissões para acessar sua galeria!');
      return false;
    }
    return true;
  };

  const pickImage = async (productId) => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      if (productId) {
        setProducts(products.map(p =>
          p.id === productId ? { ...p, image: uri } : p
        ));
      } else {
        setNewProduct(prev => ({ ...prev, image: uri }));
      }
    }
  };

  const removeImage = (productId) => {
    if (productId) {
      setProducts(products.map(p =>
        p.id === productId ? { ...p, image: null } : p
      ));
    } else {
      setNewProduct(prev => ({ ...prev, image: null }));
    }
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...p, ...newProduct, price: parseFloat(newProduct.price) } : p
      ));
    } else {
      setProducts([...products, { ...newProduct, id: Date.now().toString(), price: parseFloat(newProduct.price) }]);
    }
    setNewProduct({ name: '', brand: '', price: '', image: null });
    setEditingProduct(null);
    setModalVisible(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, brand: product.brand, price: (product.price / 100).toFixed(2), image: product.image });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleLogout = () => {
    navigation.navigate('HomeScreen'); // Ajuste 'HomeScreen' para o nome correto
  };

  const formatPrice = (price) => {
    const number = parseFloat(price);
    return isNaN(number) ? 'R$0,00' : `R$${number.toFixed(2).replace('.', ',')}`;
  };

  const handlePriceChange = (text) => {
    // Remove qualquer caractere não numérico, mas mantém o ponto e a vírgula
    const cleanedText = text.replace(/[^0-9.,]/g, '');
    // Substitui vírgula por ponto para permitir a conversão para número
    const formattedText = cleanedText.replace(',', '.');
    setNewProduct(prev => ({ ...prev, price: formattedText }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <TouchableOpacity 
        onPress={() => pickImage(item.id)} 
        style={styles.imagePicker}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.selectedImage} />
        ) : (
          <Ionicons name="camera-outline" size={40} color={colors.darkBlue} />
        )}
      </TouchableOpacity>
      <View style={styles.productDetails}>
        <Text style={styles.productText}><Text style={styles.highlight2}>Produto</Text>: {item.name}</Text>
        <Text style={styles.productText}><Text style={styles.highlight2}>Marca</Text>: {item.brand}</Text>
        <Text style={styles.productText}><Text style={styles.highlight2}>Preço</Text>: {formatPrice(item.price)}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={20} color={colors.darkBlue} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color={colors.darkBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={36} color={colors.darkBlue} />
        </TouchableOpacity>
        <Text style={styles.highlight}>Gerenciar Produtos</Text>
        <TouchableOpacity onPress={() => {
          setNewProduct({ name: '', brand: '', price: '', image: null });
          setEditingProduct(null);
          setModalVisible(true);
        }} style={styles.addButtonHeader}>
          <Ionicons name="add-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setNewProduct({ name: '', brand: '', price: '', image: null });
          setEditingProduct(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => pickImage(null)} style={styles.imagePicker}>
              {newProduct.image ? (
                <Image source={{ uri: newProduct.image }} style={styles.selectedImage} />
              ) : (
                <Ionicons name="camera-outline" size={80} color={colors.darkBlue} />
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do Produto"
              placeholderTextColor='#4F4F4F'
              value={newProduct.name}
              onChangeText={text => setNewProduct(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Marca"
              placeholderTextColor='#4F4F4F'
              value={newProduct.brand}
              onChangeText={text => setNewProduct(prev => ({ ...prev, brand: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Preço"
              placeholderTextColor='#4F4F4F'
              value={newProduct.price}
              onChangeText={text => handlePriceChange(text)}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>{editingProduct ? 'Salvar' : 'Adicionar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumBlue,
    paddingBottom: 10,
  },
  logoutButton: {
    marginLeft: 5,
    marginVertical: 20
  },
  highlight: {
    color: colors.mediumBlue,
    fontFamily: fonts.RBlack,
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
  },
  addButtonHeader: {
    backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlight2: {
    fontSize: 18,
    fontFamily: fonts.RBold,
    color: colors.mediumBlue,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.mediumBlue,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.gray,
  },
  imagePicker: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.mediumBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productText: {
    fontFamily: fonts.RRegular,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumBlue,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: colors.darkBlue,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontFamily: fonts.RBold,
    fontSize: 16,
  },
});

export default AdminProdutoScreen;
