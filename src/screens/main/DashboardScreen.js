import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';

const DashboardScreen = ({ navigation }) => {
  const { hives, loading, getHiveInspections } = useHive();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getQueenStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'present':
      case 'present & strong':
        return { icon: 'checkmark-circle', color: '#4CAF50' };
      case 'absent':
        return { icon: 'close-circle', color: '#F44336' };
      default:
        return { icon: 'help-circle', color: '#FF9800' };
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength?.toLowerCase()) {
      case 'strong':
        return '#4CAF50';
      case 'moderate':
        return '#FF9800';
      case 'weak':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const renderHiveItem = ({ item }) => {
    const queenStatus = getQueenStatusIcon(item.queenStatus);
    const strengthColor = getStrengthColor(item.strength);
    const lastInspection = getHiveInspections(item.id)[0];

    return (
      <TouchableOpacity
        style={styles.hiveCard}
        onPress={() => navigation.navigate('HiveDetails', { hiveId: item.id })}
      >
        <View style={styles.hiveHeader}>
          <View style={styles.hiveIdContainer}>
            <Ionicons name="home" size={20} color="#FFA500" />
            <Text style={styles.hiveId}>Hive #{item.id.slice(-6)}</Text>
          </View>
          <View style={[styles.strengthBadge, { backgroundColor: strengthColor + '20' }]}>
            <View style={[styles.strengthDot, { backgroundColor: strengthColor }]} />
            <Text style={[styles.strengthText, { color: strengthColor }]}>
              {item.strength || 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.hiveInfo}>
          <View style={styles.infoRow}>
            <Ionicons name={queenStatus.icon} size={18} color={queenStatus.color} />
            <Text style={styles.infoText}>
              Queen: {item.queenStatus || 'Unknown'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color="#666" />
            <Text style={styles.infoText}>
              Last Inspection: {formatDate(item.lastInspectionDate)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Hives</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddHive')}
        >
          <Ionicons name="add-circle" size={28} color="#FFA500" />
        </TouchableOpacity>
      </View>

      {hives.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="home-outline" size={80} color="#CCC" />
          <Text style={styles.emptyText}>No hives yet</Text>
          <Text style={styles.emptySubtext}>Add your first beehive to get started</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('AddHive')}
          >
            <Text style={styles.emptyButtonText}>Add New Hive</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={hives}
          renderItem={renderHiveItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 5,
  },
  listContent: {
    padding: 15,
  },
  hiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hiveIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiveId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  strengthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  hiveInfo: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;

