// src/screens/HireScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomButton from '../components/CustomButtons'; // Assuming this is the button component
import { useNavigation } from '@react-navigation/native';
import PostModal from '../components/PostModal';
import colors from '../utils/colors';
import { useAuthStore } from '../stores/authStore'; // Import the auth store

const HireScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const isAuthenticated = useAuthStore(state => state.isAuthenticated); // Get authentication status
  // Function to toggle modal visibility
  const toggleModal = () => {
    if (isAuthenticated) {
      setModalVisible(!modalVisible);
    } else {
      navigation.navigate('Drawer', { screen: 'Login', params: { previousRoute: 'PostJob' } })    
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Component */}
      <Header navigation={navigation} />

      {/* Middle Section */}
      <View style={styles.middleContent}>
      {!modalVisible &&
        <Text style={styles.hireText}>
          Let's hire your next great{' '}
          <Text style={styles.boldItalicText}>Female</Text>{' '}
          candidate.{' '}
          <Text style={styles.boldItalicText}>Fast.</Text>
        </Text>
      }
        {/* Post Job Button */}
        <CustomButton
          text="Post a free job"
          textColor={colors.primary}
          color="#034B86"
          borderColor="#034B86"
          onPress={toggleModal}
        />

        <Image
          source={require('../assets/post.png')}
          style={{ width: 400, height: 300, marginTop: 50 }}
        />
      </View>

      {/* Custom Modal Component */}
      <PostModal visible={modalVisible} onClose={toggleModal} />

      {/* Footer Component */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  hireText: {
    fontSize: 40,
    fontWeight: '300',
    width: '80%',
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 25,
  },
  boldItalicText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'black',
  },
});

export default HireScreen;
