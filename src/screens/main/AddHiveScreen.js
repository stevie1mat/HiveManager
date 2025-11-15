import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';
import { FONTS } from '../../constants/fonts';

const AddHiveScreen = ({ navigation }) => {
  const { addHive } = useHive();
  const [hiveId, setHiveId] = useState('');
  const [queenStatus, setQueenStatus] = useState('Present & Strong');
  const [strength, setStrength] = useState('Strong');
  const [loading, setLoading] = useState(false);

  const queenStatusOptions = ['Present & Strong', 'Present', 'Absent', 'Unknown'];
  const strengthOptions = ['Strong', 'Moderate', 'Weak'];

  const handleSave = async () => {
    if (!hiveId.trim()) {
      Alert.alert('Error', 'Please enter a Hive ID');
      return;
    }

    setLoading(true);
    const result = await addHive({
      hiveId: hiveId.trim(),
      queenStatus,
      strength,
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Hive added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hive ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Hive ID"
            value={hiveId}
            onChangeText={setHiveId}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Queen Status</Text>
          <View style={styles.optionsContainer}>
            {queenStatusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  queenStatus === option && styles.optionButtonSelected,
                ]}
                onPress={() => setQueenStatus(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    queenStatus === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Strength</Text>
          <View style={styles.optionsContainer}>
            {strengthOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  strength === option && styles.optionButtonSelected,
                ]}
                onPress={() => setStrength(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    strength === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Hive'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f1e8',
  },
  form: {
    padding: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#343A40',
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#343A40',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.9)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(244, 192, 37, 0.9)',
    borderColor: 'rgba(244, 192, 37, 0.5)',
    shadowColor: '#F4C025',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  optionText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#6C757D',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#343A40',
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  saveButton: {
    backgroundColor: 'rgba(244, 192, 37, 0.9)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(244, 192, 37, 0.5)',
    shadowColor: '#F4C025',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#343A40',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
  },
});

export default AddHiveScreen;

