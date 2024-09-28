import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import CustomButton from '../components/CustomButtons';
import Footer from '../components/Footer';
import { Dimensions } from 'react-native';
import { RootStackParamList } from '../utils/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeButton from '../components/HomeButton';

interface MainProps {
    navigation: any; // Add navigation prop
}

export default function Main({ navigation }: MainProps) {
    
  return (
    <View style={styles.container}>
      {/* Home Button (Logo in the top right corner) */}
      <HomeButton imageSource={require('../assets/logo.png')}/>

      {/* Main Content */}
      <View style={styles.mainContent}>

        <Image source={require('../assets/sucheta.png')} style={styles.companyName} />

        <Text style={styles.tagline}>Building Equal Opportunities in Tech</Text>
        
        {/* Buttons */}
        <CustomButton text="Sign in"  textColor="white" color="#034B86" borderColor="#034B86" onPress={() => navigation.navigate('SignIn')}
 />
        <CustomButton text="Create an account" textColor="#034B86" color="white" borderColor="#034B86" onPress={() => navigation.navigate("SignUp")}/>
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
