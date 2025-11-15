import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../../constants/fonts';

const NotificationsScreen = ({ navigation }) => {
  const [inspectionReminders, setInspectionReminders] = useState(true);
  const [harvestReminders, setHarvestReminders] = useState(true);
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reminders</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <View style={styles.settingIconContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#6C757D" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Inspection Reminders</Text>
                    <Text style={styles.settingDescription}>Get reminded to inspect your hives</Text>
                  </View>
                </View>
                <Switch
                  value={inspectionReminders}
                  onValueChange={setInspectionReminders}
                  trackColor={{ false: '#E9ECEF', true: 'rgba(244, 192, 37, 0.5)' }}
                  thumbColor={inspectionReminders ? '#F4C025' : '#FFFFFF'}
                />
              </View>
              <View style={styles.divider} />
              <View style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <View style={styles.settingIconContainer}>
                    <Ionicons name="flower-outline" size={20} color="#6C757D" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Harvest Reminders</Text>
                    <Text style={styles.settingDescription}>Reminders for honey harvests</Text>
                  </View>
                </View>
                <Switch
                  value={harvestReminders}
                  onValueChange={setHarvestReminders}
                  trackColor={{ false: '#E9ECEF', true: 'rgba(244, 192, 37, 0.5)' }}
                  thumbColor={harvestReminders ? '#F4C025' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <View style={styles.settingIconContainer}>
                    <Ionicons name="warning-outline" size={20} color="#6C757D" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Health Alerts</Text>
                    <Text style={styles.settingDescription}>Notifications for hive health issues</Text>
                  </View>
                </View>
                <Switch
                  value={healthAlerts}
                  onValueChange={setHealthAlerts}
                  trackColor={{ false: '#E9ECEF', true: 'rgba(244, 192, 37, 0.5)' }}
                  thumbColor={healthAlerts ? '#F4C025' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reports</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingItemLeft}>
                  <View style={styles.settingIconContainer}>
                    <Ionicons name="document-text-outline" size={20} color="#6C757D" />
                  </View>
                  <View style={styles.settingTextContainer}>
                    <Text style={styles.settingTitle}>Weekly Reports</Text>
                    <Text style={styles.settingDescription}>Receive weekly summary reports</Text>
                  </View>
                </View>
                <Switch
                  value={weeklyReports}
                  onValueChange={setWeeklyReports}
                  trackColor={{ false: '#E9ECEF', true: 'rgba(244, 192, 37, 0.5)' }}
                  thumbColor={weeklyReports ? '#F4C025' : '#FFFFFF'}
                />
              </View>
            </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
    paddingHorizontal: 16,
    paddingBottom: 8,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 12,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: FONTS.body,
    color: '#6C757D',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginLeft: 76,
  },
});

export default NotificationsScreen;

