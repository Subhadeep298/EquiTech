import React, { useState, memo } from "react";
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
import CustomButton from "../components/CustomButtons"; // Import CustomButton
import axios from "axios"; // Import axios or your preferred library for API requests
import colors from "../utils/colors";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { your_json_url } from "../utils/url";

// Define schema with zod
const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().length(10, {
    message: "Phone number must be in the format (123) 456-7890",
  }),
  skills: z.string().min(1, { message: "Skills are required" }),
  workExperience: z.string().min(1, { message: "Work experience is required" }),
  education: z.string().min(1, { message: "Education is required" }),
});

// Infer the type from the schema
type FormData = z.infer<typeof schema>;

const InputField = memo(
  ({
    name,
    label,
    placeholder,
    control,
    errors,
    keyboardType,
    multiline,
  }: {
    name: keyof FormData;
    label: string;
    placeholder: string;
    control: any;
    errors: any;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
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
  const navigation = useNavigation<any>();
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const { user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      skills: user?.skills || "",
      workExperience: user?.workExperience || "",
      education: user?.education || "",
    },
  });

  // Function to update user profile via API
  const updateUserProfile = async (data: FormData) => {
    if(user?.id)
    try {
      const response = await axios.put(`http://${your_json_url}/users/${user.id}`, data); // Update with your API endpoint
      if (response.status === 200) {
        alert("Profile updated!");
        setSubmittedData(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    updateUserProfile(data); // Call the function to update the profile
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

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

        {isEditing ? (
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
              placeholder="Enter your skills (comma separated)"
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
          </>
        ) : (
          <>
            <Text style={styles.profileName}>
              {submittedData?.name || control._defaultValues.name}
            </Text>
            <Text style={styles.profileInfo}> Email: {` `}    
              {submittedData?.email || control._defaultValues.email}
            </Text>
            <Text style={styles.profileInfo}> Phone Number: {` `}  
              {submittedData?.phoneNumber || control._defaultValues.phoneNumber}
            </Text>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.profileInfo}>
              {submittedData?.skills || control._defaultValues.skills}{" "}
            </Text>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <Text style={styles.profileInfo}>
              {submittedData?.workExperience ||
                control._defaultValues.workExperience}{" "}
            </Text>
            <Text style={styles.sectionTitle}>Education</Text>
            <Text style={styles.profileInfo}>
              {submittedData?.education || control._defaultValues.education}{" "}
            </Text>
          </>
        )}

        {isEditing ? (
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
        ) : (
          <CustomButton
            text="Edit Profile"
            onPress={() => setIsEditing(true)}
            color={colors.primary}
            textColor={colors.secondary}
            borderColor={colors.secondary}
          />
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
});

export default UserProfile;
