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
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "./utils/RootStackParamList";

// Stack and Drawer Navigator definitions
const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const { isAuthenticated, loadUser, isJobSeeker } = useAuthStore();

  // Load user only once when component mounts
  useEffect(() => {
    loadUser();
    console.log("is job seeker or not"+isJobSeeker);
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "#fff",
        drawerStyle: {
          backgroundColor: colors.primary,
          width: 240,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        drawerActiveTintColor: colors.secondary,
        drawerInactiveTintColor: colors.text,
        drawerActiveBackgroundColor: colors.tertiary,
      }}
    >
      {/* Home screen is always accessible */}
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          drawerLabelStyle: {
            color: colors.secondary,
            fontWeight: "500",
          },
        }}
      />
      {/* Conditionally render screens based on authentication status */}
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
                color: colors.secondary,
                fontWeight: "500",
              },
            }}
          />
          {!isJobSeeker && (
            <Drawer.Screen
              name="Post a Job"
              component={HireScreen}
              options={{
                drawerLabel: "Post a Job",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="briefcase" color={color} size={size} />
                ),
                drawerLabelStyle: {
                  color: colors.secondary,
                  fontWeight: "500",
                },
              }}
            />
          )}
          {isJobSeeker && (
            <Drawer.Screen
              name="Applied Jobs"
              component={AppliedJobs}
              options={{
                drawerLabel: "Applied Jobs",
                drawerIcon: ({ color, size }) => (
                  <Ionicons name="file-tray" color={color} size={size} />
                ),
                drawerLabelStyle: {
                  color: colors.secondary,
                  fontWeight: "500",
                },
              }}
            />
          )}
          <Drawer.Screen
            name="Logout"
            component={Logout}
            options={{
              drawerLabel: "Logout",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="log-out" color="red" size={size} />
              ),
              drawerLabelStyle: {
                color: "red",
                fontWeight: "500",
              },
            }}
          />
        </>
      ) : (
        <>
          <Drawer.Screen
            name="Login"
            component={SignIn}
            options={{
              drawerLabel: "Login",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="log-in" color={color} size={size} />
              ),
              drawerLabelStyle: {
                color: colors.text,
                fontWeight: "500",
              },
            }}
          />
          <Drawer.Screen
            name="Registration"
            component={SignUp}
            options={{
              drawerLabel: "Registration",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="person-add" color={color} size={size} />
              ),
              drawerLabelStyle: {
                color: colors.text,
                fontWeight: "500",
              },
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}

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
