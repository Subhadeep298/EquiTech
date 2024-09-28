import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import colors from '../utils/colors';

interface HeaderProps {
  navigation: any; // Define a more specific type if possible
}

const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <Image 
        source={require('../assets/sucheta.png')} 
        style={styles.logo} 
      />
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Image 
          source={require('../assets/hamburger-icon.png')} // Path to your hamburger icon
          style={styles.hamburgerIcon} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: colors.primary, // Header background color
  },
  logo: {
    width: 100,
    height: 20, // Adjust size as needed
  },
  hamburgerIcon: {
    width: 30,
    height: 30, // Adjust size as needed
  },
});

export default Header;
