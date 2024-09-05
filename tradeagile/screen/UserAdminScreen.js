import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const AdminUserScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersString = await AsyncStorage.getItem('users');
        if (usersString) {
          setUsers(JSON.parse(usersString));
        }
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar usuários.');
      }
    };

    loadUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDelete = async (userId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este usuário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const updatedUsers = users.filter(user => user.id !== userId);
              setUsers(updatedUsers);
              await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir usuário.');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!editingUser.username || !editingUser.phone) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const updatedUsers = users.map(user =>
        user.id === editingUser.id ? editingUser : user
      );
      setUsers(updatedUsers);
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      setEditingUser(null); // Resetar a edição
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar usuário.');
    }
  };

  const handleLogout = () => {
    navigation.navigate('HomeScreen'); // Ajuste o nome da tela de início conforme necessário
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userDetails}>
        <Text style={styles.userText}><Text style={styles.highlight2}>Usuário</Text>: {item.username}</Text>
        <Text style={styles.userText}><Text style={styles.highlight2}>Telefone</Text>: {item.phone}</Text>
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
        <Text style={styles.headerTitle}>Gerenciar Usuários</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Username"
              value={editingUser?.username || ''}
              onChangeText={text => setEditingUser(prev => ({ ...prev, username: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Phone"
              value={editingUser?.phone || ''}
              onChangeText={text => setEditingUser(prev => ({ ...prev, phone: text }))}
            />
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Salvar</Text>
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
    backgroundColor: colors.white,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumBlue,
    paddingBottom: 10,
    marginVertical: 20,
  },
  logoutButton: {
    marginVertical: 20,
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: 24,
    color: colors.mediumBlue,
    fontFamily: fonts.RBlack,
    flex: 1,
    textAlign: 'center',
  },
  highlight2: {
    fontSize: 18,
    fontFamily: fonts.RBold,
    color: colors.mediumBlue,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.mediumBlue,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.gray,
  },
  userDetails: {
    flex: 1,
  },
  userText: {
    fontSize: 16,
    fontFamily: fonts.RRegular,
    marginVertical: 5,
    marginLeft: 20,
  },
  actionButtons: {
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
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: colors.darkBlue,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
  listContainer: {
    marginTop: 20,
  },
});

export default AdminUserScreen;
