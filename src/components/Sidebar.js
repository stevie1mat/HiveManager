import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { FONTS } from '../constants/fonts';

const Sidebar = ({ visible, onClose, navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const menuItems = [
    {
      icon: 'home-outline',
      label: 'My Hives',
      onPress: () => {
        navigation.navigate('Hives', { screen: 'Dashboard' });
        onClose();
      },
    },
    {
      icon: 'flower-outline',
      label: 'Honey Production',
      onPress: () => {
        navigation.navigate('Honey');
        onClose();
      },
    },
    {
      icon: 'settings-outline',
      label: 'Settings',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#343A40" />
            </TouchableOpacity>
          </View>

          {user && (
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.firstName?.[0] || user.email?.[0] || 'U'}
                </Text>
              </View>
              <Text style={styles.userName}>
                {user.displayName || user.firstName || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          )}

          <View style={styles.menuSection}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <Ionicons name={item.icon} size={24} color="#343A40" />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#DC3545" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  closeButton: {
    padding: 4,
  },
  userSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
  },
  menuSection: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    gap: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: '#DC3545',
  },
});

export default Sidebar;

