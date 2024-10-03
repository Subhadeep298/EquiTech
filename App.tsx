import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Main from "./screens/Main";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import HireScreen from "./screens/HireScreen";
import JobDetails from "./components/JobsDetails";
import colors from "./utils/colors";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "./stores/authStore";
import UserProfile from "./screens/UserProfile";
import Logout from "./components/Logout";
import AppliedJobs from "./screens/AppliedJobs";
import { Ionicons } from "@expo/vector-icons"; // Import icons for customization

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
  const { isAuthenticated, loadUser } = useAuthStore(); // Get authentication state from Zustand

  useEffect(() => {
    loadUser(); // Load user data when the app starts
  }, [loadUser]);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // You can hide or show the header here
        headerStyle: {
          backgroundColor: colors.primary, // Customize the header background color
        },
        headerTintColor: "#fff", // Customize the header text color
        drawerStyle: {
          backgroundColor: colors.primary, // Customize the drawer background color
          width: 240, // Set drawer width
        },
        drawerLabelStyle: {
          fontSize: 16, // Set the label font size
          fontWeight: "bold", // Make the labels bold
        },
        drawerActiveTintColor: colors.secondary, // Active item text color
        drawerInactiveTintColor: colors.text, // Inactive item text color
        drawerActiveBackgroundColor: colors.tertiary, // Active item background color
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: "Home", // Custom label text
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} /> // Custom icon
          ),
          drawerLabelStyle: {
            color: colors.secondary, // Custom text color for this screen
            fontWeight: "500", // Bold label text
          },
        }}
      />
      {isAuthenticated ? (
        <>
          <Drawer.Screen
            name="Profile"
            component={UserProfile}
            options={{
              drawerLabel: "Profile",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
              drawerLabelStyle: {
                color: colors.secondary, // Custom text color for this screen
                fontWeight: "500", // Bold label text
              },
            }}
          />
          <Drawer.Screen
            name="Post a Job"
            component={HireScreen}
            options={{
              drawerLabel: "Post a Job",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="briefcase" color={color} size={size} />

              ),
              drawerLabelStyle: {
                color: colors.secondary, // Custom text color for this screen
                fontWeight: "500", // Bold label text
              },
            }}
          />
          <Drawer.Screen
            name="Applied Jobs"
            component={AppliedJobs}
            options={{
              drawerLabel: "Applied Jobs",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="file-tray" color={color} size={size} />
              ),drawerLabelStyle: {
                color: colors.secondary, // Custom text color for this screen
                fontWeight: "500", // Bold label text
              },
            }}
          />
          <Drawer.Screen
            name="Logout"
            component={Logout}
            options={{
              drawerLabel: "Logout", // Custom label
              drawerIcon: ({ color, size }) => (
                <Ionicons name="log-out" color="red" size={size} /> // Red color for Logout icon
              ),
              drawerLabelStyle: {
                color: "red", // Red text color for Logout
                fontWeight: "500", // Bold text
              },
            }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            name="Post a Job"
            component={HireScreen}
            options={{
              drawerLabel: "Post a Job",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="briefcase" color={color} size={size} /> // Custom briefcase icon
              ),
              drawerLabelStyle: {
                color: colors.text,
                fontWeight: "500", // Bold label text
              },
            }}
          />

          <Drawer.Screen
            name="Login"
            component={SignIn}
            options={{
              drawerLabel: "Login",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="log-in" color={color} size={size} /> // Custom log-in icon
              ),
              drawerLabelStyle: {
                color: colors.text, // Default text color
                fontWeight: "500", // Bold label text
              },
            }}
          />

          <Drawer.Screen
            name="Registration"
            component={SignUp}
            options={{
              drawerLabel: "Registration",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-add" color={color} size={size} /> // Custom person-add icon
              ),
              drawerLabelStyle: {
                color: colors.text, // Default text color
                fontWeight: "500", // Bold label text
              },
            }}
          />
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
        <StatusBar backgroundColor={colors.primary} />
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
