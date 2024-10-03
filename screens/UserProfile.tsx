import React, { useState, memo, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  KeyboardTypeOptions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../stores/authStore";
import CustomButton from "../components/CustomButtons";
import axios from "axios";
import colors from "../utils/colors";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { your_json_url } from "../utils/url";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().length(10, {
    message: "Phone number must be 10 digits",
  }),
  skills: z.string().min(1, { message: "Skills are required" }),
  workExperience: z.string().min(1, { message: "Work experience is required" }),
  education: z.string().min(1, { message: "Education is required" }),
password: z.string().min(1, { message: "Password is required" }),
});

const passwordSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;
type PasswordData = z.infer<typeof passwordSchema>;

const InputField = memo(
  ({
    name,
    label,
    placeholder,
    control,
    errors,
    keyboardType,
    multiline,
    secureTextEntry,
  }: {
    name: keyof FormData | keyof PasswordData;
    label: string;
    placeholder: string;
    control: any;
    errors: any;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            style={[styles.input, multiline && styles.textArea]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder={placeholder}
            keyboardType={keyboardType}
            multiline={multiline}
            secureTextEntry={secureTextEntry}
          />
          {errors[name] && (
            <Text style={styles.errorText}>{errors[name]?.message}</Text>
          )}
        </View>
      )}
    />
  )
);

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const navigation = useNavigation<any>();
  const [userData, setUserData] = useState<FormData | null>(null);
  const { user, setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      skills: "",
      workExperience: "",
      education: "",
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword, // Add reset method for password form
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://${your_json_url}/users/${user?.id}`);
      const fetchedUserData = response.data;
      setUserData(fetchedUserData);
      
      // Update form values
      Object.keys(fetchedUserData).forEach((key) => {
        if (key in schema.shape) {
          setValue(key as keyof FormData, fetchedUserData[key]);
        }
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const verifyPassword = async (data: PasswordData) => {
    try {
      if (userData && userData.password === data.password) {
        setIsVerifyingPassword(false);
        setIsEditing(true);
        resetPassword();
      } else {
        alert("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Failed to verify password:", error);
      alert("Failed to verify password. Please try again.");
    }
  };

  const updateUserProfile = async (data: FormData) => {
    if (user?.id) {
      try {
        const response = await axios.put(`http://${your_json_url}/users/${user.id}`, {
          ...data,
          password: userData?.password, // Preserve the existing password
        });

        if (response.status === 200) {
          alert("Profile updated!");
          setUserData(response.data);
          setUser(response.data);
          setIsEditing(false);
          resetPassword();
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile.");
      }
    }
  };

  const onSubmit = (data: FormData) => {
    updateUserProfile(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsVerifyingPassword(false);
    reset(userData as FormData);
  };

  const handleEditPress = () => {
    setIsVerifyingPassword(true);
  };

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <Header navigation={navigation}/>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/profile.jpg")}
            style={styles.profileImage}
          />

          {isVerifyingPassword ? (
            <>
              <Text style={styles.verificationText}>Please enter your password to edit your profile:</Text>
              <InputField
                name="password"
                label="Password"
                placeholder="Enter your password"
                control={passwordControl}
                errors={passwordErrors}
                secureTextEntry
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  text="Verify"
                  color={colors.secondary}
                  textColor={colors.primary}
                  borderColor={colors.secondary}
                  onPress={handlePasswordSubmit(verifyPassword)}
                />
                <CustomButton
                  text="Cancel"
                  color={colors.primary}
                  textColor={colors.secondary}
                  borderColor={colors.secondary}
                  onPress={handleCancel}
                />
              </View>
            </>
          ) : isEditing ? (
            <>
              <InputField
                name="name"
                label="Name"
                placeholder="Enter your name"
                control={control}
                errors={errors}
              />
              <InputField
                name="email"
                label="Email"
                placeholder="Enter your email"
                control={control}
                errors={errors}
                keyboardType="email-address"
              />
              <InputField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter your phone number"
                control={control}
                errors={errors}
                keyboardType="phone-pad"
              />
              <InputField
                name="skills"
                label="Skills"
                placeholder="Enter your skills"
                control={control}
                errors={errors}
                multiline
              />
              <InputField
                name="workExperience"
                label="Work Experience"
                placeholder="Enter your work experience"
                control={control}
                errors={errors}
                multiline
              />
              <InputField
                name="education"
                label="Education"
                placeholder="Enter your education"
                control={control}
                errors={errors}
                multiline
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  text="Update"
                  color={colors.secondary}
                  textColor={colors.primary}
                  borderColor={colors.secondary}
                  onPress={handleSubmit(onSubmit)}
                />
                <CustomButton
                  text="Cancel"
                  color={colors.primary}
                  textColor={colors.secondary}
                  borderColor={colors.secondary}
                  onPress={handleCancel}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileInfo}>Email: {userData.email}</Text>
              <Text style={styles.profileInfo}>Phone Number: {userData.phoneNumber}</Text>
              <Text style={styles.sectionTitle}>Skills</Text>
              <Text style={styles.profileInfo}>{userData.skills}</Text>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              <Text style={styles.profileInfo}>{userData.workExperience}</Text>
              <Text style={styles.sectionTitle}>Education</Text>
              <Text style={styles.profileInfo}>{userData.education}</Text>
              <CustomButton
                text="Edit Profile"
                onPress={handleEditPress}
                color={colors.primary}
                textColor={colors.secondary}
                borderColor={colors.secondary}
              />
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    elevation: 7,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileName: {
    color: colors.secondary,
    fontSize: 24,
    fontWeight: "500",
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 15,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  profileInfo: {
    color: "gray",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
    alignSelf: "stretch",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    color: colors.secondary,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  verificationText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default UserProfile;
