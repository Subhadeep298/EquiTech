import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomButton from "../components/CustomButtons";
import colors from "../utils/colors";
import { useAuthStore } from "../stores/authStore";
import axios from "axios";

// Schema using Zod for form validation
const jobPostSchema = z.object({
  jobTitle: z.string().min(2, { message: "Job title is required" }).optional(),
  jobDescription: z
    .string()
    .min(5, { message: "Job description is required" })
    .optional(),
  companyName: z
    .string()
    .min(2, { message: "Company name is required" })
    .optional(),
  companyInfo: z
    .string()
    .min(5, { message: "Company info is required" })
    .optional(),
  hiringTrendsForWomen: z.string().optional(),
  companyCultureTowardsWomen: z.string().optional(),
  benefitsForWomen: z.string().optional(),
  jobPay: z.string().min(1, { message: "Salary range is required" }).optional(),
  jobType: z.enum(["Full-time", "Part-time", "Contract"]).optional(),
  location: z.string().min(2, { message: "Location is required" }).optional(),
  keySkills: z
    .string()
    .min(1, { message: "At least one key skill is required" })
    .optional(),
  workMode: z.enum(["Onsite", "Hybrid", "Remote"]).optional(),
  jobOpenings: z
    .string()
    .min(1, { message: "Number of job openings is required" })
    .optional(),
});

interface JobPostModalProps {
  visible: boolean;
  onClose: () => void;
}

const JobPostForm: React.FC<JobPostModalProps> = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { user } = useAuthStore();
  const userId = user?.id; // Extract user.id from Zustand

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(jobPostSchema),
  });

  const handleClose = () => {
    setStep(1);
    setJobType("");
    setWorkMode("");
    onClose();
  };

  const onSubmit = async (data: any) => {
    const jobData = {
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      location: data.location,
      jobPay: data.jobPay,
      employmentType: jobType, // Use controlled state
      postedTime: new Date().toISOString(), // Current timestamp in ISO format
      jobDescription: data.jobDescription,
      keySkills: data.keySkills.split(","), // Convert to array
      jobType: jobType,
      companyInfo: data.companyInfo,
      hiringTrendsForWomen: data.hiringTrendsForWomen,
      companyCultureTowardsWomen: data.companyCultureTowardsWomen,
      benefitsForWomen: data.benefitsForWomen,
      workMode: workMode,
      jobOpenings: parseInt(data.jobOpenings, 10), // Convert to number
      postedBy: userId, // Include user ID
    };
  
    try {
      // Step 3: Make an API call to post the job using axios
      const response = await axios.post("http://192.168.1.14:3000/jobs", jobData);
  
      if (response.status === 201) {
        // Step 4: Reset the form fields if the post was successful
        reset(); // Resets the form fields
        setJobType(""); // Clears job type picker
        setWorkMode(""); // Clears work mode picker
  
        console.log("Job posted successfully!");
        handleClose(); // Closes the modal
      } else {
        console.error("Failed to post the job:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting the job:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Post a New Job</Text>

            <>
              <Controller
                control={control}
                name="jobTitle"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "jobTitle" && styles.inputFocused,
                      ]}
                      placeholder="Job Title"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("jobTitle")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.jobTitle && (
                      <Text style={styles.errorText}>
                        {errors.jobTitle?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="jobDescription"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.textArea,
                        focusedField === "jobDescription" &&
                          styles.inputFocused,
                      ]}
                      placeholder="Job Description"
                      placeholderTextColor="gray"
                      multiline={true}
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("jobDescription")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.jobDescription && (
                      <Text style={styles.errorText}>
                        {errors.jobDescription?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="companyName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "companyName" && styles.inputFocused,
                      ]}
                      placeholder="Company Name"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("companyName")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.companyName && (
                      <Text style={styles.errorText}>
                        {errors.companyName?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="companyInfo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.textArea,
                        focusedField === "companyInfo" && styles.inputFocused,
                      ]}
                      placeholder="Company Info"
                      placeholderTextColor="gray"
                      multiline={true}
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("companyInfo")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.companyInfo && (
                      <Text style={styles.errorText}>
                        {errors.companyInfo?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />
            </>
          

            <>
              <Controller
                control={control}
                name="hiringTrendsForWomen"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "hiringTrendsForWomen" &&
                          styles.inputFocused,
                      ]}
                      placeholder="Hiring Trends for Women"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("hiringTrendsForWomen")}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="companyCultureTowardsWomen"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "companyCultureTowardsWomen" &&
                          styles.inputFocused,
                      ]}
                      placeholder="Company Culture Towards Women"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() =>
                        setFocusedField("companyCultureTowardsWomen")
                      }
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="benefitsForWomen"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "benefitsForWomen" &&
                          styles.inputFocused,
                      ]}
                      placeholder="Benefits for Women"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("benefitsForWomen")}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="jobPay"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "jobPay" && styles.inputFocused,
                      ]}
                      placeholder="Salary Range (e.g., ₹10,00,000 - ₹15,00,000)"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("jobPay")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.jobPay && (
                      <Text style={styles.errorText}>
                        {errors.jobPay?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Text style={styles.label}>Job Type</Text>
              <Picker
                selectedValue={jobType}
                onValueChange={(itemValue) => {
                  setJobType(itemValue);
                  setValue("jobType", itemValue); // Update the form state as well
                }}
                style={[
                  styles.input,
                  focusedField === "jobType" && styles.inputFocused,
                ]}
              >
                <Picker.Item label="Select Job Type" value="" />
                <Picker.Item label="Full-time" value="Full-time" />
                <Picker.Item label="Part-time" value="Part-time" />
                <Picker.Item label="Contract" value="Contract" />
              </Picker>
              {errors.jobType && (
                <Text style={styles.errorText}>
                  {errors.jobType?.message?.toString()}
                </Text>
              )}

              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "location" && styles.inputFocused,
                      ]}
                      placeholder="Location"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("location")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.location && (
                      <Text style={styles.errorText}>
                        {errors.location?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="keySkills"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "keySkills" && styles.inputFocused,
                      ]}
                      placeholder="Key Skills (comma-separated)"
                      placeholderTextColor="gray"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("keySkills")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.keySkills && (
                      <Text style={styles.errorText}>
                        {errors.keySkills?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Text style={styles.label}>Work Mode</Text>
              <Picker
                selectedValue={workMode}
                onValueChange={(itemValue) => {
                  setWorkMode(itemValue);
                  setValue("workMode", itemValue); // Update the form state as well
                }}
                style={styles.input}
              >
                <Picker.Item label="Select Work Mode" value="" />
                <Picker.Item label="Onsite" value="Onsite" />
                <Picker.Item label="Hybrid" value="Hybrid" />
                <Picker.Item label="Remote" value="Remote" />
              </Picker>
              {errors.workMode && (
                <Text style={styles.errorText}>
                  {errors.workMode?.message?.toString()}
                </Text>
              )}

              <Controller
                control={control}
                name="jobOpenings"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === "jobOpenings" && styles.inputFocused,
                      ]}
                      placeholder="Number of Job Openings"
                      placeholderTextColor="gray"
                      keyboardType="numeric"
                      onBlur={() => {
                        onBlur();
                        setFocusedField(null);
                      }}
                      onFocus={() => setFocusedField("jobOpenings")}
                      onChangeText={onChange}
                      value={value}
                    />
                    {errors.jobOpenings && (
                      <Text style={styles.errorText}>
                        {errors.jobOpenings?.message?.toString()}
                      </Text>
                    )}
                  </View>
                )}
              />

              <CustomButton
                text="Submit"
                color={colors.secondary}
                borderColor={colors.secondary}
                textColor="white"
                onPress={handleSubmit(onSubmit)}
              />
              <CustomButton
                text="Close"
                color="red"
                borderColor="red"
                textColor="white"
                onPress={handleClose}
              />
            </>
                    </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    padding: 20,
    backgroundColor: "white",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 50,
  },
  input: {
    width: 320,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "#034B86", // Change this to your focused color
    borderBottomWidth: 5,
  },
  textArea: {    
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 320,
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
});
export default JobPostForm;
