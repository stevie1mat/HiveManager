import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  const [activeTab, setActiveTab] = useState('Inspections');
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

  const getHiveStatus = () => {
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

  const getHealthStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'strong':
      case 'good':
      case 'present & strong':
        return '#28A745';
      case 'moderate':
      case 'fair':
        return '#FD7E14';
      case 'weak':
      case 'poor':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  const status = getHiveStatus();
  const hiveDisplayId = hive.hiveId || `Hive ${hive.id.slice(-6)}`;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hive Info Card */}
        <View style={styles.hiveCard}>
          <View style={styles.hiveCardHeader}>
            <View style={styles.hiveCardTitleContainer}>
              <Text style={styles.hiveCardTitle}>{hiveDisplayId}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: status.bgColor }]} />
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconContainer}>
                <Ionicons name="female" size={18} color="#6C757D" />
              </View>
              <Text style={styles.metricLabel}>Queen</Text>
              <Text style={styles.metricValue}>
                {hive.queenStatus === 'Present' || hive.queenStatus === 'Present & Strong' 
                  ? 'Laying' 
                  : hive.queenStatus || 'Unknown'}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricIconContainer}>
                <Ionicons name="thermometer" size={18} color="#6C757D" />
              </View>
              <Text style={styles.metricLabel}>Strength</Text>
              <Text style={styles.metricValue}>{hive.strength || 'Unknown'}</Text>
            </View>
            <View style={styles.metricItem}>
              <View style={styles.metricIconContainer}>
                <Ionicons name="bug" size={18} color="#6C757D" />
              </View>
              <Text style={styles.metricLabel}>Health</Text>
              <Text style={styles.metricValue}>{hive.strength || 'Unknown'}</Text>
            </View>
          </View>

          <View style={styles.hiveCardFooter}>
            <Ionicons name="calendar-outline" size={14} color="#6C757D" style={styles.footerIcon} />
            <Text style={styles.lastInspectionText}>
              Last Inspection: {formatDate(hive.lastInspectionDate)}
            </Text>
          </View>
        </View>

        {/* Inspections Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Past Inspections</Text>
            <Text style={styles.sectionCount}>({inspections.length})</Text>
          </View>

          {loadingInspections ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#FFC107" />
            </View>
          ) : inspections.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={50} color="#DEE2E6" />
              <Text style={styles.emptyText}>No inspections yet</Text>
            </View>
          ) : (
            <View style={styles.inspectionsList}>
              {inspections.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.inspectionCard,
                    index === inspections.length - 1 && styles.inspectionCardLast
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.inspectionCardHeader}>
                    <View style={styles.inspectionDateContainer}>
                      <Ionicons name="calendar-outline" size={16} color="#6C757D" style={styles.inspectionIcon} />
                      <Text style={styles.inspectionDate}>{formatDate(item.date)}</Text>
                    </View>
                    <View style={[styles.healthBadge, { backgroundColor: getHealthStatusColor(item.generalHealth) + '20' }]}>
                      <View style={[styles.healthDot, { backgroundColor: getHealthStatusColor(item.generalHealth) }]} />
                      <Text style={[styles.healthText, { color: getHealthStatusColor(item.generalHealth) }]}>
                        {item.generalHealth || 'Unknown'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.inspectionDetails}>
                    <View style={styles.detailRow}>
                      <View style={[styles.detailItem, { marginRight: 12 }]}>
                        <View style={styles.detailItemHeader}>
                          <Ionicons name="female" size={14} color="#6C757D" />
                          <Text style={styles.detailLabel}>Queen</Text>
                        </View>
                        <Text style={styles.detailValue}>{item.queenStatus || 'Unknown'}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <View style={styles.detailItemHeader}>
                          <Ionicons name="happy-outline" size={14} color="#6C757D" />
                          <Text style={styles.detailLabel}>Temperament</Text>
                        </View>
                        <Text style={styles.detailValue}>{item.temperament || 'Unknown'}</Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={[styles.detailItem, { marginRight: 12 }]}>
                        <View style={styles.detailItemHeader}>
                          <Ionicons name="flower-outline" size={14} color="#6C757D" />
                          <Text style={styles.detailLabel}>Swarm Cells</Text>
                        </View>
                        <Text style={styles.detailValue}>{item.swarmCells || 'Unknown'}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <View style={styles.detailItemHeader}>
                          <Ionicons name="warning-outline" size={14} color="#6C757D" />
                          <Text style={styles.detailLabel}>Diseases</Text>
                        </View>
                        <Text style={styles.detailValue} numberOfLines={1}>
                          {item.diseases && item.diseases !== 'None' ? item.diseases : 'None'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {item.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.inspectionNotes}>
                        {item.notes}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    paddingBottom: 40,
    paddingHorizontal: 16,
    paddingTop: 16,
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
    marginBottom: 16,
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
    marginTop: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONTS.bodyBold,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  metricsGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
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
    marginTop: 4,
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
  sectionContainer: {
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
    marginRight: 8,
  },
  sectionCount: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#6C757D',
  },
  inspectionsList: {
    marginBottom: 12,
  },
  inspectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 12,
    marginBottom: 12,
  },
  inspectionCardLast: {
    marginBottom: 54,
  },
  inspectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inspectionDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inspectionIcon: {
    marginRight: 6,
  },
  inspectionDate: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#343A40',
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
  inspectionDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: FONTS.body,
    color: '#6C757D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: FONTS.bodyBold,
    fontWeight: '600',
    color: '#343A40',
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  notesLabel: {
    fontSize: 11,
    fontFamily: FONTS.bodyBold,
    color: '#6C757D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inspectionNotes: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#6C757D',
    marginTop: 15,
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


