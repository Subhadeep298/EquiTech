import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import colors from "../utils/colors";
import CustomButton from "../components/CustomButtons";
import HomeButton from "../components/HomeButton";
import axios from "axios";

// Zod Schema for form validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await axios.get(
        `http://192.168.1.13:3000/users?email=${data.email}&password=${data.password}`
      );

      if (response.data.length > 0) {
        console.log('User signed in:', response.data[0]);
        navigation.navigate("Home")
      } else {
        setErrorMessage('Invalid credentials. Please try again.'); // Set error message
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) ? error.response?.data || error.message : 'Unexpected error occurred';
      console.error('Error:', errorMessage);
      setErrorMessage('An error occurred. Please try again.'); // Set error message for other errors
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <HomeButton imageSource={require('../assets/sucheta.png')} position="left" />
    <HomeButton imageSource={require('../assets/logo.png')} />

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
              placeholderTextColor="gray" // Changed to gray
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

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur } }) => (
          <View>
            <TextInput
              style={[
                styles.input,
                focusedField === "password" && styles.inputFocused,
              ]}
              placeholder="Password"
              placeholderTextColor="gray" // Changed to gray
              secureTextEntry
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField("password")}
              onChangeText={onChange}
            />
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
        color="#034B86" // Provide your button color
        borderColor="#034B86" // Provide your border color
        textColor="white" // Provide your text color
      />

      <Pressable onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.loginText}>
          Don't have an account? Go to Sign Up
        </Text>
      </Pressable>
    </ScrollView>
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
    borderColor: "black", // Set a black border
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: 330, // Set width to 330
    color: colors.text,
  },
  inputFocused: {
    borderColor: "#034B86", // Change this to your focused color
    borderBottomWidth: 5,
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
