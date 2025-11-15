import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';
import { FONTS } from '../../constants/fonts';

const HoneyProductionScreen = ({ navigation }) => {
  const { hives, harvests, addHarvest } = useHive();
  const [selectedHiveId, setSelectedHiveId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('lbs');
  const [loading, setLoading] = useState(false);

  // Flatten harvests object into array
  const allHarvests = Object.values(harvests).flat();
  const recentHarvests = allHarvests
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const handleSave = async () => {
    if (!selectedHiveId) {
      Alert.alert('Error', 'Please select a hive');
      return;
    }

    if (!date) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    setLoading(true);
    const result = await addHarvest({
      hiveId: selectedHiveId,
      date,
      quantity: parseFloat(quantity),
      unit,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Harvest logged successfully');
      setSelectedHiveId('');
      setDate(new Date().toISOString().split('T')[0]);
      setQuantity('');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getHiveName = (hiveId) => {
    const hive = hives.find((h) => h.id === hiveId);
    return hive ? `Hive #${hive.id.slice(-6)}` : 'Unknown Hive';
  };

  const renderHarvestItem = ({ item }) => (
    <View style={styles.harvestCard}>
      <View style={styles.harvestHeader}>
        <Text style={styles.harvestHive}>{getHiveName(item.hiveId)}</Text>
        <Text style={styles.harvestDate}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.harvestQuantity}>
        {item.quantity} {item.unit}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Log Honey Harvest</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Hive *</Text>
          {hives.length === 0 ? (
            <View style={styles.emptyHives}>
              <Text style={styles.emptyText}>No hives available</Text>
              <TouchableOpacity
                style={styles.addHiveButton}
                onPress={() => navigation.navigate('Hives', { screen: 'AddHive' })}
              >
                <Text style={styles.addHiveButtonText}>Add Hive</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {hives.map((hive) => (
                <TouchableOpacity
                  key={hive.id}
                  style={[
                    styles.hiveOption,
                    selectedHiveId === hive.id && styles.hiveOptionSelected,
                  ]}
                  onPress={() => setSelectedHiveId(hive.id)}
                >
                  <Text
                    style={[
                      styles.hiveOptionText,
                      selectedHiveId === hive.id && styles.hiveOptionTextSelected,
                    ]}
                  >
                    #{hive.id.slice(-6)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity *</Text>
          <View style={styles.quantityRow}>
            <TextInput
              style={[styles.input, styles.quantityInput]}
              placeholder="0.0"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
            />
            <View style={styles.unitContainer}>
              {['lbs', 'kg'].map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.unitButton,
                    unit === u && styles.unitButtonSelected,
                  ]}
                  onPress={() => setUnit(u)}
                >
                  <Text
                    style={[
                      styles.unitText,
                      unit === u && styles.unitTextSelected,
                    ]}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Harvest'}
          </Text>
        </TouchableOpacity>
      </View>

      {recentHarvests.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Harvests</Text>
          <FlatList
            data={recentHarvests}
            renderItem={renderHarvestItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  form: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#333',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#333',
    marginBottom: 10,
  },
  emptyHives: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#999',
    marginBottom: 15,
  },
  addHiveButton: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addHiveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  hiveOption: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
  },
  hiveOptionSelected: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  hiveOptionText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#666',
    fontWeight: '600',
  },
  hiveOptionTextSelected: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: FONTS.body,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    flex: 1,
    marginRight: 10,
  },
  unitContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  unitButton: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  unitButtonSelected: {
    backgroundColor: '#FFA500',
  },
  unitText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#666',
    fontWeight: '600',
  },
  unitTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#FFA500',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
  },
  historySection: {
    padding: 20,
    paddingTop: 0,
  },
  harvestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  harvestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  harvestHive: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#333',
  },
  harvestDate: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#666',
  },
  harvestQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#FFA500',
  },
});

export default HoneyProductionScreen;

