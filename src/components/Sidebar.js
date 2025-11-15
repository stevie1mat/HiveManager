import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { FONTS } from '../constants/fonts';

const Sidebar = ({ visible, onClose, navigation }) => {
  const { user, logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(-280)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

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
      label: 'My Account',
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.sidebarContent,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.sidebarTop}>
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
                  <Ionicons name={item.icon} size={24} color="#343A40" style={{ marginRight: 16 }} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#DC3545" style={{ marginRight: 16 }} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sidebarTop: {
    flex: 1,
    paddingTop: 20,
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
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: FONTS.bodyBold,
    color: '#DC3545',
  },
});

export default Sidebar;

