import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import CustomButton from '../components/CustomButtons';
import colors from '../utils/colors';

interface ApplicationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (resumeUri: string, coverLetterUri: string) => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [resumeUri, setResumeUri] = useState<string | null>(null);
  const [coverLetterUri, setCoverLetterUri] = useState<string | null>(null);

  const pickDocument = async (type: 'resume' | 'coverLetter') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (type === 'resume') {
          setResumeUri(uri);
        } else {
          setCoverLetterUri(uri);
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleSubmit = () => {
    if (resumeUri && coverLetterUri) {
      onSubmit(resumeUri, coverLetterUri);
    } else {
      alert('Please upload both resume and cover letter');
    }
  };

  const handleDelete = (type: 'resume' | 'coverLetter') => {
    if (type === 'resume') {
      setResumeUri(null);
    } else {
      setCoverLetterUri(null);
    }
  };


  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Apply for Job</Text>

          {/* Resume Upload Section */}
          <View style={styles.fileUploadSection}>
            {resumeUri ? (
              <View style={styles.filePreview}>
                <Text style={styles.fileText}>Resume Uploaded</Text>
               
                <TouchableOpacity onPress={() => handleDelete('resume')}>
                  <Text style={styles.linkText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('resume')}>
                <Text style={styles.uploadButtonText}>Upload Resume</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Cover Letter Upload Section */}
          <View style={styles.fileUploadSection}>
            {coverLetterUri ? (
              <View style={styles.filePreview}>
                <Text style={styles.fileText}>Cover Letter Uploaded</Text>
                
                <TouchableOpacity onPress={() => handleDelete('coverLetter')}>
                  <Text style={styles.linkText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('coverLetter')}>
                <Text style={styles.uploadButtonText}>Upload Cover Letter</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.separator} />

          {/* Submit and Cancel Buttons */}
          <View style={styles.buttonContainer}>
            <CustomButton
              text="Submit Application"
              color={colors.secondary}
              borderColor={colors.secondary}
              textColor={colors.primary}
              onPress={handleSubmit}
              width={285}
            />
            <CustomButton
              text="Cancel"
              color={colors.primary}
              borderColor={colors.secondary}
              textColor={colors.text}
              onPress={onClose}
              width={285}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  fileUploadSection: {
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: colors.primary,
    textAlign: 'center',
  },
  filePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileText: {
    fontSize: 16,
    color: colors.text,
  },
  linkText: {
    color: colors.secondary,
    textDecorationLine: 'underline',
    marginLeft: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 15,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default ApplicationModal;
