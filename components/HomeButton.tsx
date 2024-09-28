import React from 'react';
import { Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/RootStackParamList'; // Adjust the path as needed

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define navigation type
type HomeButtonNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Define props interface
interface HomeButtonProps {
  imageSource: any; // Image source passed as prop
  position?: 'left' | 'right'; // Position (left or right), default is 'right'
}

const HomeButton: React.FC<HomeButtonProps> = ({ imageSource, position = 'right' }) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    
      // Navigate to Drawer with the 'SignIn' screen
      navigation.navigate('Drawer', {
        screen: 'Home',
      });
    
  };
  

  return (
    <Pressable 
      style={[styles.homeButton, position === 'left' ? styles.left : styles.right]} 
      onPress={handlePress}
    >
      <Image 
        source={imageSource} 
        style={[styles.logo, position === 'left' ? styles.smallLogo : styles.largeLogo]} 
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  homeButton: {
    marginTop: height * 0.01,
    position: 'absolute',
    top: height * 0.05, // 5% from the top
  },
  right: {
    left: width * 0.75, // Positioned to the right
  },
  left: {
    left: width * 0.05, // Positioned to the left
  },
  logo: {
    // Customize your logo styles here if needed
  },
  largeLogo: {
    width: width * 0.35, // 35% of screen width
    height: width * 0.1, // Dynamic height
  },
  smallLogo: {
    width: width * 0.22, // 22% of screen width for left button
    height: width * 0.05, // Dynamic height for small logo
    marginTop: height * 0.01, // 1% from the top
  },
});

export default HomeButton;
