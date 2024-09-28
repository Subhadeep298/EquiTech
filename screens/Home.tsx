import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header'; // Import your Header component
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar'; // Import the custom SearchBar component

const Home: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        {/* Wrap SearchBar for job title, keywords, or company */}
        <View style={styles.searchBarWrapper}>
          <SearchBar 
            placeholder="Job title, keywords or company" 
            iconName="search" // FontAwesome search icon
          />
          {/* Border between search bars */}
          <View style={styles.separator} />
          {/* Wrap SearchBar for location */}
          <SearchBar 
            placeholder="Location" 
            iconName="map-marker" // FontAwesome location icon
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Background color for the entire page
  },
  content: {
    paddingTop: 15, // Add padding to create space below the header
    paddingHorizontal: 10, // Adjust padding for horizontal spacing
  },
  searchBarWrapper: {
    backgroundColor: '#fff', // White background for the search bar container
    borderRadius: 10, // Rounded corners
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // Light gray border color
  },
});

export default Home;
