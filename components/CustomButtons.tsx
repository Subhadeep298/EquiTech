import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  text: string;
  color: string;
  borderColor: string;
  textColor: string;
  onPress: any;
  width? : number;
}

const CustomButton: React.FC<ButtonProps> = ({ text, color, borderColor, onPress,textColor ,width=330}) => {
  return (
    <Pressable 
      style={[styles.button, { backgroundColor: color, borderColor: borderColor, width: width}]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText,{color: textColor}]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent:'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomButton;
