import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './screens/Main';
import SignIn from './screens/SignIn'; // Import your SignIn screen
import SignUp from './screens/SignUp'; // Import your SignUp screen
import Home from './screens/Home'; // Import your Home screen
import Footer from './components/Footer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Main" 
        screenOptions={{ headerShown: false }} // Hide header for all screens
      >
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="SignIn" component={SignIn}  options={{
    gestureEnabled: false, // Enable swipe back gesture for this screen
  }}/>
        <Stack.Screen name="SignUp" component={SignUp}  options={{
    gestureEnabled: false, // Enable swipe back gesture for this screen
  }}/>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
      <Footer />
    </NavigationContainer>
  );
}
