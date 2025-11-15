import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FONTS } from '../../constants/fonts';

const TermsOfServiceScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing and using HiveManager, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Use License</Text>
            <Text style={styles.paragraph}>
              Permission is granted to temporarily use HiveManager for personal, non-commercial beekeeping management purposes only.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. User Account</Text>
            <Text style={styles.paragraph}>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
              responsibility for all activities that occur under your account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Accuracy</Text>
            <Text style={styles.paragraph}>
              While we strive to provide accurate information, we do not warrant that the information in the app is 
              complete, reliable, or error-free. You are responsible for verifying the accuracy of your hive data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              HiveManager shall not be liable for any indirect, incidental, special, or consequential damages resulting 
              from the use or inability to use the service.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Contact Information</Text>
            <Text style={styles.paragraph}>
              For questions about these Terms of Service, please contact us at legal@hivemanager.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f1e8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
    lineHeight: 24,
  },
});

export default TermsOfServiceScreen;

