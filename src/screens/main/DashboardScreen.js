import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';
import { useAuth } from '../../context/AuthContext';
import { FONTS } from '../../constants/fonts';
import Sidebar from '../../components/Sidebar';

const DashboardScreen = ({ navigation, route }) => {
  const { hives, loading, refreshHives } = useHive();
  const { user, resendConfirmationEmail } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Listen for navigation params to open sidebar
  React.useEffect(() => {
    if (route.params?.openSidebar) {
      setSidebarVisible(true);
      navigation.setParams({ openSidebar: false });
    }
  }, [route.params?.openSidebar]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshHives) {
      await refreshHives();
    }
    setRefreshing(false);
  }, [refreshHives]);

  const handleResendEmail = async () => {
    setResendingEmail(true);
    const result = await resendConfirmationEmail();
    setResendingEmail(false);
    if (result.success) {
      Alert.alert('Success', 'Confirmation email sent! Please check your inbox.');
    } else {
      Alert.alert('Error', result.error || 'Failed to resend confirmation email');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getHiveStatus = (hive) => {
    const strength = hive.strength?.toLowerCase();
    const queenStatus = hive.queenStatus?.toLowerCase();
    
    if (strength === 'strong' && (queenStatus === 'present' || queenStatus === 'present & strong')) {
      return { label: 'Healthy', color: '#28A745', bgColor: '#28A745' };
    }
    if (strength === 'moderate' || queenStatus === 'unknown') {
      return { label: 'Monitor', color: '#FD7E14', bgColor: '#FD7E14' };
    }
    if (strength === 'weak' || queenStatus === 'absent' || queenStatus === 'missing') {
      return { label: 'Needs Attention', color: '#DC3545', bgColor: '#DC3545' };
    }
    return { label: 'Monitor', color: '#FD7E14', bgColor: '#FD7E14' };
  };

  const filteredHives = hives.filter((hive) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const hiveId = hive.hiveId?.toLowerCase() || '';
      const id = hive.id?.toLowerCase() || '';
      if (!hiveId.includes(query) && !id.includes(query)) {
        return false;
      }
    }
    
    // Status filter
    if (selectedFilter !== 'All') {
      const status = getHiveStatus(hive);
      if (status.label !== selectedFilter) {
        return false;
      }
    }
    
    return true;
  });

  const renderHiveCard = ({ item }) => {
    const status = getHiveStatus(item);
    const hiveId = item.hiveId || `Hive ${item.id.slice(-6)}`;

    return (
      <TouchableOpacity
        style={styles.hiveCard}
        onPress={() => navigation.navigate('HiveDetails', { hiveId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.hiveCardHeader}>
          <View style={styles.hiveCardTitleContainer}>
            <Text style={styles.hiveCardTitle}>{hiveId}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: status.bgColor }]} />
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <Ionicons name="chevron-forward" size={20} color="#ADB5BD" />
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="female" size={18} color="#6C757D" />
            </View>
            <Text style={styles.metricLabel}>Queen</Text>
            <Text style={styles.metricValue}>
              {item.queenStatus === 'Present' || item.queenStatus === 'Present & Strong' 
                ? 'Laying' 
                : item.queenStatus || 'Unknown'}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="thermometer" size={18} color="#6C757D" />
            </View>
            <Text style={styles.metricLabel}>Strength</Text>
            <Text style={styles.metricValue}>{item.strength || 'Unknown'}</Text>
          </View>
          <View style={styles.metricItem}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="bug" size={18} color="#6C757D" />
            </View>
            <Text style={styles.metricLabel}>Health</Text>
            <Text style={styles.metricValue}>{item.strength || 'Unknown'}</Text>
          </View>
        </View>

        <View style={styles.hiveCardFooter}>
          <Ionicons name="calendar-outline" size={14} color="#6C757D" style={styles.footerIcon} />
          <Text style={styles.lastInspectionText}>
            Last Inspection: {formatDate(item.lastInspectionDate)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigation}
      />
      {/* Email Confirmation Banner */}
      {user && !user.emailConfirmed && (
        <View style={styles.emailBanner}>
          <View style={styles.bannerContent}>
            <Ionicons name="mail-outline" size={20} color="#FFC107" />
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Please confirm your email</Text>
              <Text style={styles.bannerText}>
                We sent a confirmation email to {user.email}. Please check your inbox.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendEmail}
            disabled={resendingEmail}
          >
            <Text style={styles.resendButtonText}>
              {resendingEmail ? 'Sending...' : 'Resend Email'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFC107" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#6C757D" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Hive Name or ID..."
            placeholderTextColor="#ADB5BD"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#6C757D" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {['All', 'Healthy', 'Monitor', 'Needs Attention'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === filter && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hive Cards List */}
        {filteredHives.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="home-outline" size={64} color="#DEE2E6" />
            </View>
            <Text style={styles.emptyText}>
              {searchQuery || selectedFilter !== 'All' 
                ? 'No hives match your filters' 
                : 'No hives yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedFilter !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Add your first beehive to get started'}
            </Text>
            {!searchQuery && selectedFilter === 'All' && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('AddHive')}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={20} color="#343A40" style={{ marginRight: 8 }} />
                <Text style={styles.emptyButtonText}>Add New Hive</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.hivesList}>
            {filteredHives.map((hive) => (
              <View key={hive.id}>
                {renderHiveCard({ item: hive })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  emailBanner: {
    backgroundColor: '#FFF3E0',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#E65100',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#BF360C',
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  resendButtonText: {
    color: '#343A40',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
    paddingVertical: 0,
  },
  clearButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  filterChip: {
    height: 38,
    paddingHorizontal: 18,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
    shadowColor: '#FFC107',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
    color: '#6C757D',
    fontWeight: '500',
  },
  filterChipTextActive: {
    fontFamily: FONTS.bodyBold,
    color: '#343A40',
    fontWeight: '600',
  },
  hivesList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  hiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  hiveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    paddingBottom: 14,
  },
  hiveCardTitleContainer: {
    flex: 1,
    gap: 6,
  },
  hiveCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
    letterSpacing: -0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: FONTS.body,
    color: '#6C757D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 15,
    fontFamily: FONTS.bodyBold,
    fontWeight: '600',
    color: '#343A40',
    marginTop: 2,
  },
  hiveCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  footerIcon: {
    marginRight: 6,
  },
  lastInspectionText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: '#6C757D',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#495057',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    fontFamily: FONTS.body,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emptyButton: {
    flexDirection: 'row',
    backgroundColor: '#FFC107',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyButtonText: {
    color: '#343A40',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
  },
});

export default DashboardScreen;
