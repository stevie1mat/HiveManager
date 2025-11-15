import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useHive } from '../../context/HiveContext';
import { FONTS } from '../../constants/fonts';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { hives } = useHive();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={icon} size={20} color="#6C757D" />
        </View>
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6C757D" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getUserInitials()}</Text>
                </View>
              </View>
              <View style={styles.profileText}>
                <Text style={styles.profileName}>{getUserDisplayName()}</Text>
                <Text style={styles.profileEmail}>{user?.email || ''}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* My Hives Section */}
        <SettingSection title="My Hives">
          <View style={styles.hivesCard}>
            <TouchableOpacity
              style={styles.addHiveButton}
              onPress={() => navigation.navigate('Hives', { screen: 'AddHive' })}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#343A40" />
              <Text style={styles.addHiveButtonText}>Add New Beehive</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('Hives', { screen: 'Dashboard' })}
              activeOpacity={0.7}
            >
              <View style={styles.settingItemLeft}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="home" size={20} color="#6C757D" />
                </View>
                <Text style={styles.settingItemText}>View All Hives</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6C757D" />
            </TouchableOpacity>
          </View>
        </SettingSection>

        {/* Application Settings Section */}
        <SettingSection title="Application Settings">
          <View style={styles.settingsCard}>
            <SettingItem
              icon="color-palette-outline"
              title="App Preferences"
              onPress={() => Alert.alert('App Preferences', 'App preferences coming soon')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => Alert.alert('Notifications', 'Notification settings coming soon')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="person-outline"
              title="Account"
              onPress={() => Alert.alert('Account', 'Account settings coming soon')}
            />
          </View>
        </SettingSection>

        {/* Support & Legal Section */}
        <SettingSection title="Support & Legal">
          <View style={styles.settingsCard}>
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => Alert.alert('Help & Support', 'Help and support coming soon')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => Alert.alert('Terms of Service', 'Terms of service coming soon')}
            />
          </View>
        </SettingSection>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC3545" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfbf8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F4C025',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#1c180d',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
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
  },
  hivesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addHiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: '#F4C025',
    gap: 8,
  },
  addHiveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingItemText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
    flex: 1,
  },
  logoutContainer: {
    paddingVertical: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC354530',
    backgroundColor: 'transparent',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#DC3545',
  },
});

export default SettingsScreen;
