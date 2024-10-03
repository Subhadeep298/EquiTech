import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DrawerParamList, RootStackParamList } from "../utils/RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import colors from "../utils/colors";
import CustomButton from "../components/CustomButtons";
import HomeButton from "../components/HomeButton";
import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import Icon from "react-native-vector-icons/Ionicons"; // Import the icon component
import Footer from "../components/Footer";
import { your_json_url } from "../utils/url";

// Zod Schema for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type SignInScreenNavigationProp = NativeStackNavigationProp<any>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { login } = useAuthStore(); // Get Zustand state and actions

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      
      const response = await axios.get(
        `http://${your_json_url}/users?email=${data.email.toLowerCase()}`
      );
      const user = response.data[0];
      if (response.data.length > 0 && user.password === data.password) {

        console.log("User signed in:", response.data[0]);
        // Store the user data in Zustand
        login({
          id: user.id,
          email: user.email,
          name: user.name,
          phoneNumber: user.phoneNumber,
          skills: user.skills,
          workExperience: user.workExperience,
          education: user.education,
          password: user.password,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }], // Set Home as the new initial route
        });
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data || error.message
        : "Unexpected error occurred";
      console.error("Error:", errorMessage);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
      <HomeButton imageSource={require("../assets/sucheta.png")} position="left"/>
      <HomeButton imageSource={require("../assets/logo.png")} />

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur } }) => (
          <View>
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
              ]}
              placeholder="Email"
              placeholderTextColor="gray"
              keyboardType="email-address"
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField("email")}
              onChangeText={onChange}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email.message}</Text>
            )}
          </View>
        )}
      />

      {/* Password Input with Toggle */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur } }) => (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                focusedField === "password" && styles.inputFocused,
              ]}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={!passwordVisible} // Toggle secureTextEntry based on password visibility
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField("password")}
              onChangeText={onChange}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={togglePasswordVisibility}
            >
              <Icon
                name={passwordVisible ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password.message}</Text>
            )}
            
          </View>
          
        )}
      />

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      {/* Custom Button for Login */}
      <CustomButton
        text={isSubmitting ? "Logging in..." : "Login"}
        onPress={handleSubmit(onSubmit)}
        color="#034B86"
        borderColor="#034B86"
        textColor="white"
      />

      <Pressable onPress={() => navigation.navigate("Drawer",{screen:"Registration"})}>
        <Text style={styles.loginText}>Don't have an account? Go to Sign Up</Text>
      </Pressable>
    </ScrollView>
          <Footer />
</>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: "600",
    color: colors.secondary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 20,
    color: colors.text,
    textAlign: "center",
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: 330,
    color: colors.text,
  },
  inputFocused: {
    borderColor: "#034B86",
    borderBottomWidth: 5,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 10, // Add some margin for consistency with other inputs
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    height: "100%",
    paddingBottom: 10,
    justifyContent: "center",
  },
  loginText: {
    color: colors.text,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignIn;
