import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import CustomButton from '../components/CustomButtons';
import Footer from '../components/Footer';
import { Dimensions } from 'react-native';
import { RootStackParamList } from '../utils/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeButton from '../components/HomeButton';
import { useAuthStore } from '../stores/authStore';
import { useFocusEffect } from '@react-navigation/native';

interface MainProps {
    navigation: any; // Add navigation prop
}

export default function Main({ navigation }: MainProps) {

  const { loadUser, isAuthenticated } = useAuthStore(); // Destructure isAuthenticated

  useFocusEffect(
    React.useCallback(() => {
      const checkAuthentication = async () => {
        await loadUser(); // Load user data from AsyncStorage
        if (isAuthenticated) {
          navigation.navigate('Drawer', { screen: 'Home' }); // Navigate to Home if authenticated
        }
      };

      checkAuthentication();

      // Clean up function (if needed)
      return () => {
        // Any cleanup code can go here if necessary
      };
    }, [loadUser, navigation,isAuthenticated]) // Add isAuthenticated and navigation as dependencies
  );
    
  return (
    <View style={styles.container}>
      {/* Home Button (Logo in the top right corner) */}
      <HomeButton imageSource={require('../assets/logo.png')}/>

      {/* Main Content */}
      <View style={styles.mainContent}>

        <Image source={require('../assets/sucheta.png')} style={styles.companyName} />

        <Text style={styles.tagline}>Building Equal Opportunities in Tech</Text>
        
        {/* Buttons */}
        <CustomButton text="Sign in"  textColor="white" color="#034B86" borderColor="#034B86" onPress={() => navigation.navigate('Drawer', { screen: 'Login' })}
 />
        <CustomButton text="Create an account" textColor="#034B86" color="white" borderColor="#034B86" onPress={() => navigation.navigate('Drawer', { screen: 'Registration' })}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  companyName:{
    width: 150,
    height: 30,
    marginBottom: 15,
    marginLeft: 10, 
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    fontSize: 18,
    fontWeight: "700",
    color: '#000',
    marginBottom: 30,
  },
});
