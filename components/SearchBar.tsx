import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Use FontAwesome icons
import colors from '../utils/colors'; // Assuming you have color utilities

// Get screen dimensions
const { width } = Dimensions.get('window');

interface SearchBarProps {
  placeholder: string;
  iconName: string; // The name of the icon from FontAwesome
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, iconName }) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name={iconName} size={20} color={colors.text} style={styles.icon} />
      <TextInput 
        placeholder={placeholder} 
        placeholderTextColor="gray" 
        style={styles.input} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary, // Background color of the search bar
    borderRadius: 15,
    paddingHorizontal: 10, // Ensure horizontal padding is consistent
    paddingVertical: 10, // Padding inside the container
    marginVertical: 3,
    width: width * 0.92, // 90% of the screen width
    alignSelf: 'center',
  },
  icon: {
    marginRight: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight:"400",
    color: colors.text,
    paddingLeft: 0, // Remove extra padding so the cursor starts consistently
  },
});

export default SearchBar;
