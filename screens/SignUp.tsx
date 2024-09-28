import React, { useState,useEffect } from "react";
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
import { RootStackParamList } from "../utils/RootStackParamList";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from '../stores/authStore'; // Import Zustand store
import colors from "../utils/colors";
import CustomButton from "../components/CustomButtons";
import HomeButton from "../components/HomeButton";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const registerSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const SignUp: React.FC = () => {

  const { isAuthenticated } = useAuthStore(); // Get Zustand state and actions
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("Home");
    }
  }, [isAuthenticated]);


  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await axios.post("http://192.168.1.13:3000/users", data);

      if (response.status === 201) {
        console.log("User registered:", response.data[0]);
        navigation.navigate("SignIn");
      } else {
        console.error("Failed to register user.");
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data || error.message
        : "Unexpected error occurred";
      console.error("Error:", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HomeButton
        imageSource={require("../assets/sucheta.png")}
        position="left"
      />
      <HomeButton imageSource={require("../assets/logo.png")} />

      <Text style={styles.title}>Ready to take the next step?</Text>
      <Text style={styles.subtitle}>Create an Account</Text>

      {/* Full Name Input */}
      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur } }) => (
          <View>
            <TextInput
              style={[
                styles.input,
                focusedField === "fullName" && styles.inputFocused,
              ]}
              placeholder="Full Name"
              placeholderTextColor="gray" // Changed to gray
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField("fullName")}
              onChangeText={onChange}
            />
            {errors.fullName && (
              <Text style={styles.errorText}>{errors.fullName.message}</Text>
            )}
          </View>
        )}
      />

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

      {/* Phone Number Input */}
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field: { onChange, onBlur } }) => (
          <View>
            <TextInput
              style={[
                styles.input,
                focusedField === "phoneNumber" && styles.inputFocused,
              ]}
              placeholder="Phone Number"
              placeholderTextColor="gray" // Changed to gray
              keyboardType="phone-pad"
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField("phoneNumber")}
              onChangeText={onChange}
            />
            {errors.phoneNumber && (
              <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
            )}
          </View>
        )}
      />

      {/* Custom Button for Registration */}
      <CustomButton
        text={isSubmitting ? "Submitting..." : "Register"}
        onPress={handleSubmit(onSubmit)}
        color="#034B86" // Provide your button color
        borderColor="#034B86" // Provide your border color
        textColor="white" // Provide your text color
      />

      <Pressable onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.loginText}>
          Already have an account? Go to Login
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
  eyeIcon: {
    position: "absolute",
    right: 10,
    height: "100%",
    paddingBottom: 10,
    justifyContent: "center",
  },
});

export default SignUp;

