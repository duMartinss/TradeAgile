import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AdminFornecedorScreen = ({ navigation }) => {
  const [fornecedores, setFornecedores] = useState([
    { id: '1', name: 'Fornecedor A', contact: '123456789' },
    { id: '2', name: 'Fornecedor B', contact: '987654321' },
  ]);

  const [editingFornecedor, setEditingFornecedor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFornecedor, setNewFornecedor] = useState({ name: '', contact: '' });

  const handleEdit = (fornecedor) => {
    setEditingFornecedor(fornecedor);
    setNewFornecedor({ name: fornecedor.name, contact: fornecedor.contact });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (editingFornecedor) {
      setFornecedores(fornecedores.map(f =>
        f.id === editingFornecedor.id ? { ...f, ...newFornecedor } : f
      ));
    } else {
      setFornecedores([...fornecedores, { ...newFornecedor, id: String(fornecedores.length + 1) }]);
    }
    setModalVisible(false);
    setNewFornecedor({ name: '', contact: '' });
    setEditingFornecedor(null);
  };

  const handleDelete = (id) => {
    setFornecedores(fornecedores.filter(f => f.id !== id));
  };

  const handleLogout = () => {
    navigation.navigate('HomeScreen'); // Ajuste 'HomeScreen' para o nome correto
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemText}><Text style={styles.highlight2}>Fornecedor</Text>: {item.name}</Text>
        <Text style={styles.itemText}><Text style={styles.highlight2}>Contato</Text>: {item.contact}</Text>
      </View>
      <View style={styles.itemActions}>
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={36} color={colors.darkBlue} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Gerenciar Fornecedores</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButtonHeader}>
          <Ionicons name="add-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={fornecedores}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setNewFornecedor({ name: '', contact: '' });
          setEditingFornecedor(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Nome do Fornecedor"
              placeholderTextColor='#4F4F4F'
              value={newFornecedor.name}
              onChangeText={text => setNewFornecedor(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Contato"
              placeholderTextColor='#4F4F4F'
              value={newFornecedor.contact}
              onChangeText={text => setNewFornecedor(prev => ({ ...prev, contact: text }))}
            />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>{editingFornecedor ? 'Salvar' : 'Adicionar'}</Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumBlue,
    paddingBottom: 10,
  },
  logoutButton: {
    marginLeft: 5,
    marginVertical: 20
  },
  headerText: {
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
    marginVertical: 5,
    color: colors.mediumBlue,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.mediumBlue,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.gray
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginVertical: 5,
    marginLeft: 20,
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 20,
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalInput: {
    width: '100%',
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumBlue,
  },
  saveButton: {
    backgroundColor: colors.darkBlue,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fonts.RBold,
  },
  listContainer: {
    flex: 1, // Garante que a lista preencha o espaço restante
  },
});

export default AdminFornecedorScreen;
