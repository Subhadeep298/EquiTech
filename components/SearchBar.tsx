import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../utils/colors';

const { width } = Dimensions.get('window');

interface SearchBarProps {
  placeholder: string;
  iconName: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, iconName, value, onChangeText }) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name={iconName} size={20} color={colors.text} style={styles.icon} />
      <TextInput 
        placeholder={placeholder} 
        placeholderTextColor="gray" 
        style={styles.input} 
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 3,
    width: width * 0.92,
    alignSelf: 'center',
  },
  icon: {
    marginRight: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "400",
    color: colors.text,
    paddingLeft: 0,
  },
});

export default SearchBar;