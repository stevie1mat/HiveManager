import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHive } from '../../context/HiveContext';
import { FONTS } from '../../constants/fonts';

const AccordionSection = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={styles.accordion}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#1c180d"
          style={[styles.accordionIcon, isOpen && styles.accordionIconOpen]}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const NewInspectionScreen = ({ route, navigation }) => {
  const { hiveId } = route.params;
  const { hives, addInspection } = useHive();
  const [generalHealth, setGeneralHealth] = useState('Good');
  const [temperament, setTemperament] = useState('Calm');
  const [queenSeen, setQueenSeen] = useState(true);
  const [eggsPresent, setEggsPresent] = useState(true);
  const [queenCells, setQueenCells] = useState(false);
  const [broodFrames, setBroodFrames] = useState(5);
  const [honeyFrames, setHoneyFrames] = useState(3);
  const [selectedPests, setSelectedPests] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const hive = hives.find((h) => h.id === hiveId);
  const hiveDisplayId = hive?.hiveId || `Hive ${hiveId?.slice(-6) || ''}`;

  const healthOptions = ['Excellent', 'Good', 'Fair', 'Bad'];
  const temperamentOptions = ['Calm', 'Defensive', 'Aggressive'];
  const pestOptions = ['Varroa Mites', 'Hive Beetle', 'Wax Moths', 'Chalkbrood'];

  const formatDate = () => {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  const togglePest = (pest) => {
    setSelectedPests((prev) =>
      prev.includes(pest) ? prev.filter((p) => p !== pest) : [...prev, pest]
    );
  };

  const handleSave = async () => {
    if (!hiveId) {
      Alert.alert('Error', 'Hive ID is missing');
      return;
    }

    setLoading(true);
    
    // Map the new fields to the existing inspection format
    const queenStatus = queenSeen ? (eggsPresent ? 'Present & Strong' : 'Present') : 'Absent';
    const swarmCells = queenCells ? 'Yes' : 'No';
    const diseases = selectedPests.length > 0 ? selectedPests.join(', ') : 'None';

    const inspectionData = {
      hiveId,
      date: new Date().toISOString(),
      generalHealth,
      queenStatus,
      temperament,
      swarmCells,
      diseases,
      broodFrames,
      honeyFrames,
      notes: notes.trim() || null,
    };

    console.log('Saving inspection with data:', inspectionData);

    const result = await addInspection(inspectionData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Inspection saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      console.error('Failed to save inspection:', result.error);
      Alert.alert('Error', result.error || 'Failed to save inspection');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* General Hive Health */}
          <View style={styles.accordionWrapper}>
            <AccordionSection title="General Hive Health" icon="thermostat" defaultOpen={true}>
            <View style={styles.sectionItem}>
              <View style={styles.sectionItemHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="heart" size={20} color="#1c180d" />
                </View>
                <Text style={styles.sectionItemLabel}>Health Status</Text>
              </View>
              <View style={styles.radioGroup}>
                {healthOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.radioOption,
                      generalHealth === option && styles.radioOptionSelected,
                    ]}
                    onPress={() => setGeneralHealth(option)}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        generalHealth === option && styles.radioTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.sectionItem}>
              <View style={styles.sectionItemHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="thermometer" size={20} color="#1c180d" />
                </View>
                <Text style={styles.sectionItemLabel}>Temperament</Text>
              </View>
              <View style={styles.radioGroup}>
                {temperamentOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.radioOption,
                      temperament === option && styles.radioOptionSelected,
                    ]}
                    onPress={() => setTemperament(option)}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        temperament === option && styles.radioTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </AccordionSection>
          </View>

          {/* Queen Status */}
          <View style={styles.accordionWrapper}>
            <AccordionSection title="Queen Status" icon="visibility">
            <View style={styles.toggleItem}>
              <View style={styles.toggleItemHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="eye" size={20} color="#1c180d" />
                </View>
                <Text style={styles.toggleLabel}>Queen Seen</Text>
              </View>
              <Switch
                value={queenSeen}
                onValueChange={setQueenSeen}
                trackColor={{ false: '#f4f0e7', true: '#F4C025' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.toggleItem}>
              <View style={styles.toggleItemHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="egg" size={20} color="#1c180d" />
                </View>
                <Text style={styles.toggleLabel}>Eggs Present</Text>
              </View>
              <Switch
                value={eggsPresent}
                onValueChange={setEggsPresent}
                trackColor={{ false: '#f4f0e7', true: '#F4C025' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.toggleItem}>
              <View style={styles.toggleItemHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="flower" size={20} color="#1c180d" />
                </View>
                <Text style={styles.toggleLabel}>Queen Cells</Text>
              </View>
              <Switch
                value={queenCells}
                onValueChange={setQueenCells}
                trackColor={{ false: '#f4f0e7', true: '#DC3545' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </AccordionSection>
          </View>

          {/* Frames */}
          <View style={styles.accordionWrapper}>
            <AccordionSection title="Frames" icon="grid">
            <View style={styles.counterItem}>
              <View style={styles.counterItemHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="grid" size={20} color="#1c180d" />
                </View>
                <Text style={styles.counterLabel}>Brood Frames</Text>
              </View>
              <View style={styles.counter}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setBroodFrames(Math.max(0, broodFrames - 1))}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{broodFrames}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setBroodFrames(broodFrames + 1)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.counterItem}>
              <View style={styles.counterItemHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="flower" size={20} color="#1c180d" />
                </View>
                <Text style={styles.counterLabel}>Honey Frames</Text>
              </View>
              <View style={styles.counter}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setHoneyFrames(Math.max(0, honeyFrames - 1))}
                >
                  <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{honeyFrames}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setHoneyFrames(honeyFrames + 1)}
                >
                  <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AccordionSection>
          </View>

          {/* Pests & Diseases */}
          <View style={styles.accordionWrapper}>
            <AccordionSection title="Pests & Diseases" icon="warning">
            <Text style={styles.pestDescription}>
              Select any observed pests or diseases.
            </Text>
            <View style={styles.pestContainer}>
              {pestOptions.map((pest) => (
                <TouchableOpacity
                  key={pest}
                  style={[
                    styles.pestChip,
                    selectedPests.includes(pest) && styles.pestChipSelected,
                  ]}
                  onPress={() => togglePest(pest)}
                >
                  <Text
                    style={[
                      styles.pestChipText,
                      selectedPests.includes(pest) && styles.pestChipTextSelected,
                    ]}
                  >
                    {pest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </AccordionSection>
          </View>

          {/* Actions & Notes */}
          <View style={styles.accordionWrapper}>
            <AccordionSection title="Actions & Notes" icon="document-text">
            <TextInput
              style={styles.notesInput}
              placeholder="Add any actions taken or general notes..."
              placeholderTextColor="#9c8749"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </AccordionSection>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Inspection'}
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
  content: {
    padding: 16,
  },
  accordionWrapper: {
    marginBottom: 12,
  },
  accordion: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e2ce',
    backgroundColor: '#fcfbf8',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONTS.bodyBold,
    color: '#1c180d',
  },
  accordionIcon: {
    // React Native doesn't support CSS transitions
    // Animation would require Animated API or react-native-reanimated
  },
  accordionIconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  accordionContent: {
    paddingHorizontal: 15,
    paddingBottom: 16,
  },
  sectionItem: {
    marginTop: 8,
  },
  sectionItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 56,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f4f0e7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionItemLabel: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
    flex: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    backgroundColor: '#f4f0e7',
    borderRadius: 8,
    padding: 4,
  },
  radioOption: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  radioOptionSelected: {
    backgroundColor: '#fcfbf8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioText: {
    fontSize: 14,
    fontFamily: FONTS.bodyMedium,
    color: '#9c8749',
  },
  radioTextSelected: {
    color: '#1c180d',
    fontWeight: '600',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    marginBottom: 8,
  },
  toggleItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
    flex: 1,
  },
  counterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    marginBottom: 16,
  },
  counterItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  counterLabel: {
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
    flex: 1,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.heading,
    color: '#1c180d',
    width: 24,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f4f0e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c180d',
  },
  pestDescription: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#9c8749',
    marginBottom: 8,
  },
  pestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  pestChip: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#e8e2ce',
    backgroundColor: 'transparent',
  },
  pestChipSelected: {
    backgroundColor: '#DC3545',
    borderColor: '#DC3545',
  },
  pestChipText: {
    fontSize: 14,
    fontFamily: FONTS.body,
    color: '#1c180d',
  },
  pestChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notesInput: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e2ce',
    backgroundColor: '#f4f0e7',
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.body,
    color: '#1c180d',
    minHeight: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fcfbf8',
    paddingTop: 16,
    paddingBottom: 26,
    paddingLeft: 34,
    paddingRight: 36,
    borderTopWidth: 1,
    borderTopColor: '#e8e2ce',
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
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
});

export default NewInspectionScreen;
