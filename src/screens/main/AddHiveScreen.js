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
    backgroundColor: '#F5F5F5',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: FONTS.body,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: '#FFA500',
    borderColor: '#FFA500',
  },
  optionText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#666',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
  },
  saveButton: {
    backgroundColor: '#FFA500',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
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
});

export default AddHiveScreen;

