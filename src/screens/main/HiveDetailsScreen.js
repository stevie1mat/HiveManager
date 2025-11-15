import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';
import { FONTS } from '../../constants/fonts';

const HiveDetailsScreen = ({ route, navigation }) => {
  const { hiveId } = route.params;
  const { hives, getHiveInspections } = useHive();
  const [inspections, setInspections] = useState([]);
  const [loadingInspections, setLoadingInspections] = useState(true);
  const hive = hives.find((h) => h.id === hiveId);

  useEffect(() => {
    const loadInspections = async () => {
      if (hiveId) {
        setLoadingInspections(true);
        const data = await getHiveInspections(hiveId);
        setInspections(data || []);
        setLoadingInspections(false);
      }
    };
    loadInspections();
  }, [hiveId, getHiveInspections]);

  if (!hive) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Hive not found</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'strong':
      case 'good':
      case 'present & strong':
        return '#4CAF50';
      case 'moderate':
      case 'fair':
        return '#FF9800';
      case 'weak':
      case 'poor':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const renderInspectionItem = ({ item }) => {
    const healthColor = getHealthStatusColor(item.generalHealth);
    return (
      <View style={styles.inspectionCard}>
        <View style={styles.inspectionHeader}>
          <Text style={styles.inspectionDate}>{formatDate(item.date)}</Text>
          <View style={[styles.healthBadge, { backgroundColor: healthColor + '20' }]}>
            <View style={[styles.healthDot, { backgroundColor: healthColor }]} />
            <Text style={[styles.healthText, { color: healthColor }]}>
              {item.generalHealth || 'Unknown'}
            </Text>
          </View>
        </View>
        {item.notes && (
          <Text style={styles.inspectionNotes} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.hiveIdSection}>
          <Ionicons name="home" size={24} color="#FFA500" />
          <Text style={styles.hiveId}>Hive #{hive.id.slice(-6)}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getHealthStatusColor(hive.strength) + '20' },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getHealthStatusColor(hive.strength) },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: getHealthStatusColor(hive.strength) },
            ]}
          >
            {hive.strength || 'Unknown'}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Health Status</Text>
            <Text style={styles.infoValue}>
              {hive.strength ? `${hive.strength} - Present & Strong` : 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="flower-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Queen Status</Text>
            <Text style={styles.infoValue}>{hive.queenStatus || 'Unknown'}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Last Inspection</Text>
            <Text style={styles.infoValue}>
              {formatDate(hive.lastInspectionDate)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Past Inspections</Text>
          <Text style={styles.sectionCount}>({inspections.length})</Text>
        </View>

        {loadingInspections ? (
          <View style={styles.emptyInspections}>
            <ActivityIndicator size="large" color="#FFA500" />
          </View>
        ) : inspections.length === 0 ? (
          <View style={styles.emptyInspections}>
            <Ionicons name="document-text-outline" size={50} color="#CCC" />
            <Text style={styles.emptyText}>No inspections yet</Text>
          </View>
        ) : (
          <FlatList
            data={inspections}
            renderItem={renderInspectionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.inspectButton}
        onPress={() => navigation.navigate('NewInspection', { hiveId })}
      >
        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.inspectButtonText}>Start Inspection</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  hiveIdSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  hiveId: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#333',
    marginLeft: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    textTransform: 'capitalize',
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#333',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#333',
  },
  sectionCount: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#999',
    marginLeft: 8,
  },
  inspectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inspectionDate: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#333',
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  healthText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  inspectionNotes: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#666',
    marginTop: 8,
  },
  emptyInspections: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#999',
    marginTop: 15,
  },
  inspectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    margin: 20,
    padding: 15,
    borderRadius: 12,
  },
  inspectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.body,
    color: '#F44336',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default HiveDetailsScreen;

