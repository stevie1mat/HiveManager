import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';
import { FONTS } from '../../constants/fonts';

const LogHoneyHarvestScreen = ({ navigation }) => {
  const { hives, addHarvest } = useHive();
  const [selectedHiveId, setSelectedHiveId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHivePicker, setShowHivePicker] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const unitOptions = ['kg', 'lbs', 'frames', 'gallons'];

  const getHiveDisplayName = (hive) => {
    return hive.hiveId || `Hive ${hive.id.slice(-6)}`;
  };

  const getSelectedHiveName = () => {
    if (!selectedHiveId) return 'Select a hive...';
    const hive = hives.find((h) => h.id === selectedHiveId);
    return hive ? getHiveDisplayName(hive) : 'Select a hive...';
  };

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
      notes: notes.trim() || null,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Harvest logged successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Date Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9c8749"
              />
              <View style={styles.dateIconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#9c8749" />
              </View>
            </View>
          </View>

          {/* Hive Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hive(s)</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowHivePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pickerText, !selectedHiveId && styles.pickerPlaceholder]}>
                {getSelectedHiveName()}
              </Text>
              <View style={styles.pickerIconContainer}>
                <Ionicons name="chevron-down" size={20} color="#9c8749" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Quantity & Unit Fields */}
          <View style={styles.quantityRow}>
            <View style={[styles.inputGroup, styles.quantityGroup]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 10"
                placeholderTextColor="#9c8749"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={[styles.inputGroup, styles.unitGroup]}>
              <Text style={styles.label}>Unit</Text>
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setShowUnitPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerText}>{unit}</Text>
                <View style={styles.pickerIconContainer}>
                  <Ionicons name="chevron-down" size={20} color="#9c8749" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes Text Area */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="e.g., Honey color, weather, observations..."
              placeholderTextColor="#9c8749"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Hive Picker Modal */}
      <Modal
        visible={showHivePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHivePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Hive</Text>
              <TouchableOpacity
                onPress={() => setShowHivePicker(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#1c180d" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={hives}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedHiveId(item.id);
                    setShowHivePicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{getHiveDisplayName(item)}</Text>
                  {selectedHiveId === item.id && (
                    <Ionicons name="checkmark" size={20} color="#F4C025" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Unit Picker Modal */}
      <Modal
        visible={showUnitPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUnitPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Unit</Text>
              <TouchableOpacity
                onPress={() => setShowUnitPicker(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#1c180d" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={unitOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setUnit(item);
                    setShowUnitPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {unit === item && (
                    <Ionicons name="checkmark" size={20} color="#F4C025" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Fixed Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Harvest'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120,
  },
  form: {
    padding: 16,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.bodyMedium,
    fontWeight: '500',
    color: '#1c180d',
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e2ce',
    overflow: 'hidden',
  },
  dateInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
    backgroundColor: 'transparent',
  },
  dateIconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#e8e2ce',
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    position: 'relative',
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e2ce',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
  },
  pickerPlaceholder: {
    color: '#9c8749',
  },
  pickerIconContainer: {
    marginLeft: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  quantityGroup: {
    flex: 1,
    marginRight: 16,
    marginBottom: 0,
  },
  unitGroup: {
    flex: 0.5,
    marginBottom: 0,
  },
  input: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e2ce',
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
  },
  textArea: {
    minHeight: 144,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e2ce',
    backgroundColor: 'transparent',
    padding: 15,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fcfbf8',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8e2ce',
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    backgroundColor: '#F4C025',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#1c180d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fcfbf8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e2ce',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#1c180d',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e2ce',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
  },
});

export default LogHoneyHarvestScreen;

