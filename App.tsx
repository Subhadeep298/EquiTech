import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from './screens/Main';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import HireScreen from './screens/HireScreen';
import JobDetails from './components/JobsDetails';
import colors from './utils/colors';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './stores/authStore';
import UserProfile from './screens/UserProfile';
import Logout from './components/Logout';
import AppliedJobs from './screens/AppliedJobs';

// Define the Job interface (make sure this matches the one in your Home component)
interface Job {
  jobTitle: string;
  companyName: string;
  location: string;
  jobPay: string;
  employmentType: string;
  postedTime: string;
}

// Define the RootStackParamList
type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Drawer: undefined;
  JobDetails: { job: Job };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

// Create the Drawer Navigator
function DrawerNavigator() {
  const { isAuthenticated,loadUser } = useAuthStore(); // Get authentication state from Zustand

  useEffect(() => {
    loadUser(); // Load user data when the app starts
  }, [loadUser]);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.primary,
          width: 240,
        },
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: colors.secondary,
        drawerActiveBackgroundColor: colors.tertiary,
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      {isAuthenticated ? (
        <>
          <Drawer.Screen name="User Profile" component={UserProfile} />
          <Drawer.Screen name="Logout" component={Logout} />
          <Drawer.Screen name="Post a Job" component={HireScreen} />
          <Drawer.Screen name="My Applied Job" component={AppliedJobs}/>
        </>
      ) : (
        <>
          <Drawer.Screen name="Post a Job" component={HireScreen} />
          <Drawer.Screen name="Login" component={SignIn} />
          <Drawer.Screen name="Registration" component={SignUp} />

        </>
      )}
    </Drawer.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <>
      <NavigationContainer>
      <StatusBar backgroundColor={colors.primary}/>
        <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}