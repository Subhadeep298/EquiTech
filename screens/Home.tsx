import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import axios from 'axios';
import Footer from '../components/Footer';
import colors from '../utils/colors';

interface Job {
  jobTitle: string;
  companyName: string;
  location: string;
  jobPay: string;
  employmentType: string;
  postedTime: string;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Start at page 1
  const [error, setError] = useState<string | null>(null);
  const [jobsPerPage] = useState(3); // Control how many jobs to show per "page"

  // Fetch jobs once when component mounts
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://192.168.1.8:3000/jobs`); // Fetch all jobs
      setJobs(response.data); // Store all jobs
    } catch (error) {
      console.error("Error fetching job data:", error);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(); // Call fetchJobs once when the component mounts
  }, []);

  // Load more jobs by increasing the page and thus slicing more data
  const loadMoreJobs = () => {
    setPage(prevPage => {
      // When the user reaches the end, reset back to 1
      if (prevPage * jobsPerPage >= jobs.length) {
        return 1; // Restart from the beginning
      } else {
        return prevPage + 1; // Otherwise, load next page
      }
    });
  };

  // Only show jobs according to the current "page" (e.g., 10 jobs at a time)
  const displayedJobs = jobs.slice(0, page * jobsPerPage);

  if (loading) {
    return <ActivityIndicator size="large" color="#034B86" style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.searchBarWrapper}>
          <SearchBar placeholder="Job title, keywords or company" iconName="search" />
          <View style={styles.separator} />
          <SearchBar placeholder="Location" iconName="map-marker" />
        </View>

        <Text style={styles.sectionTitle}>Jobs for women</Text>
        <Text style={styles.subTitle}>Jobs based on your search on EquiTech</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <FlatList
        data={displayedJobs} // Use the sliced jobs based on current page
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <JobCard
            jobTitle={item.jobTitle}
            companyName={item.companyName}
            location={item.location}
            jobPay={item.jobPay}
            employmentType={item.employmentType}
            postedTime={item.postedTime}
          />
        )}
        contentContainerStyle={styles.cardsContainer}
        ListFooterComponent={
            <ActivityIndicator size="large" color="#034B86" />
        }
        onEndReached={loadMoreJobs} // Load more jobs when scrolling reaches the end
        onEndReachedThreshold={0.1} // Threshold for triggering onEndReached
      />
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
  },
});

export default Home;
