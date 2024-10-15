import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import JobDetailsModal from '../components/JobsDetails';
import { JobData } from '../utils/types';
import axios from 'axios';
import { your_json_url } from '../utils/url';
import { useNavigation } from '@react-navigation/native';

const AppliedJobs: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated,hasAppliedToJob,fetchAppliedJobs } = useAuthStore();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const loadAppliedJobs = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch the applied jobs for the user using Zustand's fetchAppliedJobs function
        await fetchAppliedJobs(user.id); // Fetches the applied jobs and updates the Zustand state

        // Fetch all jobs from the API
        const jobsResponse = await axios.get(`http://${your_json_url}/jobs`);
        const allJobs: JobData[] = jobsResponse.data;

        // Filter jobs based on the applied job IDs stored in the Zustand state
        const filteredJobs = allJobs.filter(job => hasAppliedToJob(job.id));

        setJobs(filteredJobs);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        setError('Failed to load applied jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAppliedJobs();
  }, [isAuthenticated, user,jobs]);

  const handlePress = (job: JobData) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#034B86" style={styles.loadingIndicator} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} />
        <Text style={styles.noJobsText}>Please log in to view your applied jobs.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        {jobs.length > 0 ? (
          <FlatList
            data={jobs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <JobCard
                jobTitle={item.jobTitle}
                companyName={item.companyName}
                location={item.location}
                jobPay={item.jobPay}
                employmentType={item.employmentType}
                postedTime={item.postedTime}
                onPress={() => handlePress(item)}
              />
            )}
            contentContainerStyle={styles.cardsContainer}
          />
        ) : (
          <Text style={styles.noJobsText}>You have not applied to any jobs yet.</Text>
        )}
      </View>

      {selectedJob && (
        <JobDetailsModal
          jobData={selectedJob}
          isVisible={isModalVisible}
          onClose={handleClose}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  cardsContainer: {
    marginHorizontal: 10,
    paddingBottom: 5,
  },
  noJobsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default AppliedJobs;
