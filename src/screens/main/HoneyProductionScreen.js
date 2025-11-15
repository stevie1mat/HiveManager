import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';
import { useFocusEffect } from '@react-navigation/native';
import { FONTS } from '../../constants/fonts';

const HoneyProductionScreen = ({ navigation }) => {
  const { getAllHarvests, deleteHarvest } = useHive();
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('All');

  const loadHarvests = useCallback(async () => {
    setLoading(true);
    const data = await getAllHarvests();
    setHarvests(data);
    setLoading(false);
  }, [getAllHarvests]);

  useFocusEffect(
    useCallback(() => {
      loadHarvests();
    }, [loadHarvests])
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleDeleteHarvest = (harvestId) => {
    Alert.alert(
      'Delete Harvest',
      'Are you sure you want to delete this harvest? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Optimistically update UI
            setHarvests((prev) => prev.filter((harvest) => harvest.id !== harvestId));
            
            const result = await deleteHarvest(harvestId);
            if (!result.success) {
              // Reload on error to restore state
              loadHarvests();
              Alert.alert('Error', result.error || 'Failed to delete harvest');
            }
          },
        },
      ]
    );
  };

  const filteredHarvests = harvests.filter((harvest) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const hiveName = harvest.hiveName?.toLowerCase() || '';
      if (!hiveName.includes(query)) {
        return false;
      }
    }
    
    // Unit filter
    if (selectedUnitFilter !== 'All') {
      if (harvest.unit !== selectedUnitFilter) {
        return false;
      }
    }
    
    return true;
  });

  const unitOptions = ['All', 'kg', 'lbs', 'frames', 'gallons'];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4C025" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color="#6C757D" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Hive Name..."
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
          {unitOptions.map((unit) => (
            <TouchableOpacity
              key={unit}
              style={[
                styles.filterChip,
                selectedUnitFilter === unit && styles.filterChipActive,
              ]}
              onPress={() => setSelectedUnitFilter(unit)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedUnitFilter === unit && styles.filterChipTextActive,
                ]}
              >
                {unit}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredHarvests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="flower-outline" size={64} color="#DEE2E6" />
            </View>
            <Text style={styles.emptyText}>
              {searchQuery || selectedUnitFilter !== 'All' 
                ? 'No harvests match your filters' 
                : 'No harvests yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedUnitFilter !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Log your first honey harvest to get started'}
            </Text>
          </View>
        ) : (
          <View style={styles.harvestsList}>
            {filteredHarvests.map((harvest, index) => (
              <View
                key={harvest.id}
                style={[
                  styles.harvestCard,
                  index === filteredHarvests.length - 1 && styles.harvestCardLast,
                ]}
              >
                <View style={styles.harvestCardHeader}>
                  <View style={styles.harvestInfo}>
                    <View style={styles.harvestTitleRow}>
                      <Ionicons name="flower" size={18} color="#F4C025" />
                      <Text style={styles.harvestHiveName}>{harvest.hiveName}</Text>
                    </View>
                    <Text style={styles.harvestDate}>{formatDate(harvest.date)}</Text>
                  </View>
                  <View style={styles.harvestHeaderRight}>
                    <View style={styles.harvestQuantity}>
                      <Text style={styles.harvestQuantityValue}>
                        {harvest.quantity} {harvest.unit}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteHarvest(harvest.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle" size={24} color="#DC3545" />
                    </TouchableOpacity>
                  </View>
                </View>
                {harvest.notes && (
                  <View style={styles.harvestNotes}>
                    <Text style={styles.harvestNotesText}>{harvest.notes}</Text>
                  </View>
                )}
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
    backgroundColor: '#fcfbf8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcfbf8',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#F4C025',
    borderColor: '#F4C025',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
    fontWeight: '500',
    color: '#6C757D',
  },
  filterChipTextActive: {
    color: '#1c180d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: FONTS.heading,
    fontWeight: '600',
    color: '#343A40',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#6C757D',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  harvestsList: {
    marginTop: 8,
  },
  harvestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  harvestCardLast: {
    marginBottom: 0,
  },
  harvestCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  harvestInfo: {
    flex: 1,
    marginRight: 12,
  },
  harvestTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  harvestHiveName: {
    fontSize: 16,
    fontFamily: FONTS.heading,
    fontWeight: '600',
    color: '#343A40',
    marginLeft: 6,
  },
  harvestDate: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
    marginTop: 2,
  },
  harvestHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  harvestQuantity: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  harvestQuantityValue: {
    fontSize: 18,
    fontFamily: FONTS.heading,
    fontWeight: 'bold',
    color: '#F4C025',
  },
  deleteButton: {
    padding: 4,
  },
  harvestNotes: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  harvestNotesText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
    lineHeight: 20,
  },
});

export default HoneyProductionScreen;
