import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../../constants/fonts';

const InspectionDetailsScreen = ({ route, navigation }) => {
  const { inspection } = route.params;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'excellent':
      case 'strong':
      case 'good':
      case 'present & strong':
        return '#28A745';
      case 'moderate':
      case 'fair':
        return '#FD7E14';
      case 'weak':
      case 'poor':
      case 'bad':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  const healthColor = getHealthStatusColor(inspection.generalHealth);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={20} color="#343A40" />
              <View style={styles.dateTextContainer}>
                <Text style={styles.dateText}>{formatDate(inspection.date)}</Text>
                <Text style={styles.timeText}>{formatTime(inspection.date)}</Text>
              </View>
            </View>
            <View style={[styles.healthBadge, { backgroundColor: healthColor + '20' }]}>
              <View style={[styles.healthDot, { backgroundColor: healthColor }]} />
              <Text style={[styles.healthText, { color: healthColor }]}>
                {inspection.generalHealth || 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Sections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart-outline" size={20} color="#343A40" />
            <Text style={styles.sectionTitle}>General Health</Text>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Health Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: healthColor + '20' }]}>
                <Text style={[styles.statusText, { color: healthColor }]}>
                  {inspection.generalHealth || 'Unknown'}
                </Text>
              </View>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Temperament</Text>
              <Text style={styles.detailValue}>{inspection.temperament || 'Unknown'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="female-outline" size={20} color="#343A40" />
            <Text style={styles.sectionTitle}>Queen Status</Text>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Queen Status</Text>
              <Text style={styles.detailValue}>{inspection.queenStatus || 'Unknown'}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Swarm Cells</Text>
              <Text style={styles.detailValue}>{inspection.swarmCells || 'Unknown'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="grid-outline" size={20} color="#343A40" />
            <Text style={styles.sectionTitle}>Frames</Text>
          </View>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Brood Frames</Text>
              <Text style={styles.detailValue}>
                {inspection.broodFrames !== null && inspection.broodFrames !== undefined
                  ? inspection.broodFrames
                  : 'N/A'}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Honey Frames</Text>
              <Text style={styles.detailValue}>
                {inspection.honeyFrames !== null && inspection.honeyFrames !== undefined
                  ? inspection.honeyFrames
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning-outline" size={20} color="#343A40" />
            <Text style={styles.sectionTitle}>Pests & Diseases</Text>
          </View>
          <View style={styles.detailCard}>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Text style={styles.detailLabel}>Diseases</Text>
              <Text style={styles.detailValue}>
                {inspection.diseases && inspection.diseases !== 'None'
                  ? inspection.diseases
                  : 'None'}
              </Text>
            </View>
          </View>
        </View>

        {inspection.notes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#343A40" />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.notesText}>{inspection.notes}</Text>
            </View>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadataSection}>
          <Text style={styles.metadataText}>
            Created: {formatDate(inspection.createdAt)} {formatTime(inspection.createdAt)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateTextContainer: {
    marginLeft: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
  },
  timeText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
    marginTop: 2,
  },
  healthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  healthText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#343A40',
    marginLeft: 8,
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#6C757D',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#343A40',
    textAlign: 'right',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  notesText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
    lineHeight: 24,
  },
  metadataSection: {
    marginTop: 8,
    marginBottom: 90,
  },
  metadataText: {
    fontSize: 12,
    fontFamily: FONTS.body,
    color: '#9C9C9C',
    textAlign: 'center',
  },
});

export default InspectionDetailsScreen;

