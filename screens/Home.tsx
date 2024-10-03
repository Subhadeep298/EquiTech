import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import axios from 'axios';
import colors from '../utils/colors';
import JobDetailsModal from '../components/JobsDetails'; // Import your modal component
import { your_json_url } from '../utils/url';
import { JobData } from '../utils/types';


const Home: React.FC = () => {
  const navigation = useNavigation();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://${your_json_url}/jobs`);
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error("Error fetching job data:", error);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job => {
      if (!job) return false;
      
      const keywordMatch = 
        (job.jobTitle?.toLowerCase().includes(keywordSearch.toLowerCase().trim()) ?? false) ||
        (job.companyName?.toLowerCase().includes(keywordSearch.toLowerCase().trim()) ?? false) ||
        (job.employmentType?.toLowerCase().includes(keywordSearch.toLowerCase().trim()) ?? false);
      
      const locationMatch = 
        job.location?.toLowerCase().includes(locationSearch.toLowerCase().trim()) ?? false;

      return keywordMatch && locationMatch;
    });
    setFilteredJobs(filtered);
  }, [keywordSearch, locationSearch, jobs]);

  const handlePress = (job: JobData) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
  };

  const loadMoreJobs = () => {
    // This function should be implemented to fetch more jobs from the server
    // For now, we'll just duplicate the existing jobs
    setJobs(prevJobs => [...prevJobs, ...prevJobs]);
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#034B86" style={styles.loadingIndicator} />;
  }
  
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.searchBarWrapper}>
        <SearchBar
            placeholder="Job title, keywords or company"
            iconName="search"
            value={keywordSearch}
            onChangeText={setKeywordSearch}
          />
          <View style={styles.separator} />
          <SearchBar
            placeholder="Location"
            iconName="map-marker"
            value={locationSearch}
            onChangeText={setLocationSearch}
          />
        </View>

        <Text style={styles.sectionTitle}>Jobs for women</Text>
        <Text style={styles.subTitle}>Jobs based on your search on EquiTech</Text>
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item,index) => index.toString()}
        renderItem={({ item }) => (
          <JobCard
            jobTitle={item.jobTitle}
            companyName={item.companyName}
            location={item.location}
            jobPay={item.jobPay}
            employmentType={item.employmentType}
            postedTime={item.postedTime}
            onPress={() => handlePress(item)} // Pass the item to handlePress
          />
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.noResultsText}>No jobs found for your search criteria.</Text>
          )
        }
        contentContainerStyle={styles.cardsContainer}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#034B86" /> : null
        }
        onEndReached={loadMoreJobs} 
        onEndReachedThreshold={0.1} 
      />

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
  searchBarWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.secondary,
    marginTop: 20,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '300',
    marginBottom: 15,
  },
  cardsContainer: {
    marginHorizontal: 10,
    paddingBottom: 5,
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
  },noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default Home;
