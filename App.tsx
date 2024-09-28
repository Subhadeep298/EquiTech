import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from './screens/Main';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import HireScreen from './screens/HireScreen';
import colors from './utils/colors';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Create the Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: false ,drawerStyle:{
      backgroundColor:colors.primary,
      width: 240,
    },
    drawerActiveTintColor:colors.text,
    drawerInactiveTintColor: colors.secondary,
    drawerActiveBackgroundColor:colors.tertiary,
    drawerLabelStyle:{
      fontSize:16,
      fontWeight: 'bold'
    }}}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Log In" component={SignIn} />
      <Drawer.Screen name="Registration" component={SignUp} />
      <Drawer.Screen name="Post a Job" component={HireScreen} />
    </Drawer.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <>
    {/* <StatusBar backgroundColor='white'/> */}
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}
