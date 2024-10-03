import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../stores/authStore'; // Assuming Zustand is used for the authStore
import Header from '../components/Header'; // Assuming you have a Header component
import JobCard from '../components/JobCard';
import JobDetailsModal from '../components/JobsDetails'; // Assuming you have a JobDetailsModal component
import { JobData } from '../utils/types'; // Import JobData type
import axios from 'axios'; // For fetching job data
import { your_json_url } from '../utils/url'; // Your API URL
import { useNavigation } from '@react-navigation/native';

const AppliedJobs: React.FC = () => {
  const navigation = useNavigation<any>();
  const { appliedJobs } = useAuthStore(); // Fetch applied job IDs from authStore
  const [jobs, setJobs] = useState<JobData[]>([]); // State to store fetched jobs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Function to fetch full job details for applied jobs
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get(`http://${your_json_url}/jobs`);
        const allJobs = response.data;

        // Filter the jobs using the job IDs from appliedJobs
        const filteredJobs = allJobs.filter((job: JobData) => appliedJobs.includes(job.id));
        setJobs(filteredJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load applied jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [appliedJobs]);

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
                onPress={() => handlePress(item)} // Pass the job item to handlePress
              />
            )}
            contentContainerStyle={styles.cardsContainer}
          />
        ) : (
          <Text style={styles.noJobsText}>You have not applied to any jobs yet.</Text>
        )}
      </View>

      {/* Job Details Modal */}
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
