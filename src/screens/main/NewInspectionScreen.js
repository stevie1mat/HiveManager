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

const NewInspectionScreen = ({ route, navigation }) => {
  const { hiveId } = route.params;
  const { addInspection } = useHive();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [generalHealth, setGeneralHealth] = useState('Good');
  const [queenStatus, setQueenStatus] = useState('Present');
  const [temperament, setTemperament] = useState('Calm');
  const [swarmCells, setSwarmCells] = useState('No');
  const [diseases, setDiseases] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const healthOptions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const queenOptions = ['Present', 'Absent', 'Unknown'];
  const temperamentOptions = ['Calm', 'Moderate', 'Aggressive'];
  const swarmCellOptions = ['Yes', 'No', 'Unknown'];


  const handleSave = async () => {
    if (!generalHealth || !queenStatus) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    const result = await addInspection({
      hiveId,
      date: new Date(date).toISOString(),
      generalHealth,
      queenStatus,
      temperament,
      swarmCells,
      diseases: diseases.trim() || 'None',
      notes: notes.trim(),
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Inspection saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <View style={styles.dateInputContainer}>
            <Ionicons name="calendar-outline" size={20} color="#666" style={styles.dateIcon} />
            <TextInput
              style={styles.dateInput}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>General Health *</Text>
          <View style={styles.optionsContainer}>
            {healthOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  generalHealth === option && styles.optionButtonSelected,
                ]}
                onPress={() => setGeneralHealth(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    generalHealth === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Queen Status *</Text>
          <View style={styles.optionsContainer}>
            {queenOptions.map((option) => (
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
          <Text style={styles.label}>Temperament</Text>
          <View style={styles.optionsContainer}>
            {temperamentOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  temperament === option && styles.optionButtonSelected,
                ]}
                onPress={() => setTemperament(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    temperament === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Swarm Cells</Text>
          <View style={styles.optionsContainer}>
            {swarmCellOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  swarmCells === option && styles.optionButtonSelected,
                ]}
                onPress={() => setSwarmCells(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    swarmCells === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diseases</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter any diseases observed (leave blank if none)"
            value={diseases}
            onChangeText={setDiseases}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            placeholder="Additional notes about the inspection..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Done Inspection'}
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
    color: '#333',
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
    color: '#666',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
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
  },
});

export default NewInspectionScreen;

