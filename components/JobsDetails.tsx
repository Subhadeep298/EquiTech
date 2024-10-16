import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import CustomButton from "../components/CustomButtons";
import colors from "../utils/colors";
import { StatusBar } from "expo-status-bar";
import ApplicationModal from "./ApplicationModal";
import { useAuthStore } from "../stores/authStore";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { your_json_url } from "../utils/url";
import { JobData } from "../utils/types";


interface JobDetailsModalProps {
  jobData: JobData;
  isVisible: boolean;
  onClose: () => void;
}
const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ jobData, isVisible, onClose }) => {
  const navigation = useNavigation<any>();
  const [isApplicationModalVisible, setIsApplicationModalVisible] = useState(false);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false); // State to track if the user has applied

  const { user, isAuthenticated, applyToJob, hasAppliedToJob, isJobSeeker, fetchAppliedJobs } = useAuthStore();
  const userId = user?.id; // Extract user.id from Zustand

  useEffect(() => {
    const checkJobApplication = async () => {
      if (userId) {
        // Fetch the latest applied jobs and check if the user has already applied
        await fetchAppliedJobs(userId);
        const alreadyApplied = hasAppliedToJob(jobData.id);
        setIsAlreadyApplied(alreadyApplied); // Update state with result
        console.log("new");
      }
    };

    checkJobApplication();
  }, [userId, jobData.id]); // Re-run when `userId` or `jobData.id` changes

  const handleApplyNow = () => {
    setIsApplicationModalVisible(true);
  };

  const handleApplicationSubmit = async (resumeUri: string, coverLetterUri: string) => {
    try {
      const response = await axios.get(`http://${your_json_url}/jobApplications?jobId=${jobData.id}`);
      let jobApplication = response.data[0];

      if (!jobApplication) {
        jobApplication = { jobId: jobData.id, applicants: [] };
      }

      jobApplication.applicants.push({ userId, resumeUri, coverLetterUri });

      if (response.data.length === 0) {
        await axios.post(`http://${your_json_url}/jobApplications`, jobApplication);
      } else {
        await axios.put(`http://${your_json_url}/jobApplications/${jobApplication.id}`, jobApplication);
      }

      applyToJob(jobData.id); // Update applied jobs in Zustand
      setIsApplicationModalVisible(false);
      alert('Application submitted successfully!');
      onClose();
      navigation.navigate('Drawer', { screen: 'Home'});
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    onClose();
    navigation.navigate('Drawer', { screen: 'Login', params: { goBack: "true" } });
  };
  
  return (
  <Modal visible={isVisible} animationType="fade">
    <StatusBar backgroundColor="#F0F8FF"/>
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{jobData.jobTitle}</Text>
          <Text style={styles.company}>{jobData.companyName}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <Text style={styles.infoText}>Location: {jobData.location}</Text>
            <Text style={styles.infoText}>Job Type: {jobData.jobType}</Text>
            <Text style={styles.infoText}>Employment Type: {jobData.employmentType}</Text>
            <Text style={styles.infoText}>Work Mode: {jobData.workMode}</Text>
            <Text style={styles.infoText}>Job Pay: {jobData.jobPay}</Text>
            <Text style={styles.infoText}>Job Openings: {jobData.jobOpenings}</Text>
            <Text style={styles.infoText}>Posted: {jobData.postedTime}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.description}>{jobData.jobDescription}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Skills</Text>
            <Text style={styles.infoText}>{jobData.keySkills.join(", ")}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company Information</Text>
            <Text style={styles.infoText}>{jobData.companyInfo}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Women in the Workplace</Text>
            <Text style={styles.infoText}>Hiring Trends: {jobData.hiringTrendsForWomen}</Text>
            <Text style={styles.infoText}>Company Culture: {jobData.companyCultureTowardsWomen}</Text>
            <Text style={styles.infoText}>Benefits: {jobData.benefitsForWomen}</Text>
          </View>
          
        </ScrollView>
        <View style={styles.buttonContainer}>
        
        <View style={styles.buttonContainer}>
        {isAuthenticated ? (
          isJobSeeker ? (
            isAlreadyApplied ? (
              <CustomButton
                text="Already Applied"
                color="gray"
                borderColor="gray"
                textColor={colors.primary}
                onPress={() => alert('You have already applied to this job.')}
                disabled={true}
              />
            ) : (
              <CustomButton
                text="Apply Now"
                color={colors.secondary}
                borderColor={colors.secondary}
                textColor={colors.primary}
                onPress={handleApplyNow}
              />
            )
          ) : (
            <CustomButton
              text="You are an Employer"
              color="gray"
              borderColor="gray"
              textColor={colors.primary}
              onPress={() => alert('As an employer, you cannot apply for jobs.')}
              disabled={true}
            />
          )
        ) : (
          <CustomButton
            text="Login to Apply"
            color={colors.secondary}
            borderColor={colors.secondary}
            textColor={colors.primary}
            onPress={handleLoginRedirect}
          />
        )}
            <CustomButton
              text="Close"
              color={colors.primary}
              borderColor={colors.secondary}
              textColor={colors.text}
              onPress={onClose}
            />
          </View>
        </View>
        </View>
      </SafeAreaView>
      <ApplicationModal
        isVisible={isApplicationModalVisible}
        onClose={() => setIsApplicationModalVisible(false)}
        onSubmit={handleApplicationSubmit}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Light blue background instead of gradient
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 5,
  },
  company: {
    fontSize: 18,
    color: colors.tertiary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: colors.secondary,
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
  },
});

export default JobDetailsModal;