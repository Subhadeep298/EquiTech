import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2024 EquiTech</Text>
      <Text style={styles.footerText}>All Rights Reserved</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 5,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },      
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});

export default Footer;
