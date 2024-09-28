import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface JobCardProps {
  jobTitle: string;
  companyName: string;
  location: string;
  jobPay: string;
  employmentType: string;
  postedTime: string;
}

const JobCard: React.FC<JobCardProps> = ({ jobTitle, companyName, location, jobPay, employmentType, postedTime }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.jobTitle}>{jobTitle}</Text>
      <Text style={styles.companyName}>{companyName}</Text>
      <Text style={styles.location}>{location}</Text>
      <Text style={styles.pay}>{jobPay}</Text>
      <Text style={styles.employmentType}>{employmentType}</Text>
      <Text style={styles.postedTime}>{postedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1, // Add a border to the card
    borderColor: '#ccc', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  pay: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  employmentType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  postedTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default JobCard;
