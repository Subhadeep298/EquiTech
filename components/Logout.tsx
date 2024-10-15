import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useAuthStore } from '../stores/authStore'; // Adjust import path if necessary
import CustomButton from './CustomButtons';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../utils/colors';

const Logout = ({ navigation }: any) => {
  const logout = useAuthStore((state) => state.logout);
  const [modalVisible, setModalVisible] = useState(true);

  const handleLogout = async () => {
    logout();
    navigation.navigate('Main'); // Navigate to Home or any other screen after logout
  };

  useFocusEffect(
    React.useCallback(() => {
    setModalVisible(true);
      // Clean up function (if needed)
      return () => {
        // Any cleanup code can go here if necessary
      };
    }, [navigation]) // Add isAuthenticated and navigation as dependencies
  );

  return (
    <View style={styles.container}>
      

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to logout?</Text>
            <View style={styles.buttonContainer}>
              <CustomButton text="yes" color="white" borderColor='red' textColor='red' onPress={handleLogout} width={260}>
              </CustomButton>
              <CustomButton text="No" color="white" borderColor="gray" textColor="black "onPress={() => {setModalVisible(false)
                navigation.navigate("Drawer",{screen:"Home"})
                }} width={260}>
              </CustomButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    color: 'red', // Adjust color as necessary
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.secondary
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'red', // Change color as needed
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: 'lightgray', // Change color as needed
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Logout;
