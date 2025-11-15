import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HiveContext = createContext({});

export const useHive = () => {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error('useHive must be used within a HiveProvider');
  }
  return context;
};

export const HiveProvider = ({ children }) => {
  const [hives, setHives] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hivesData, inspectionsData, harvestsData] = await Promise.all([
        AsyncStorage.getItem('hives'),
        AsyncStorage.getItem('inspections'),
        AsyncStorage.getItem('harvests'),
      ]);

      if (hivesData) setHives(JSON.parse(hivesData));
      if (inspectionsData) setInspections(JSON.parse(inspectionsData));
      if (harvestsData) setHarvests(JSON.parse(harvestsData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHive = async (hiveData) => {
    try {
      const newHive = {
        id: Date.now().toString(),
        ...hiveData,
        createdAt: new Date().toISOString(),
      };
      const updatedHives = [...hives, newHive];
      setHives(updatedHives);
      await AsyncStorage.setItem('hives', JSON.stringify(updatedHives));
      return { success: true, hive: newHive };
    } catch (error) {
      console.error('Error adding hive:', error);
      return { success: false, error: 'Failed to add hive' };
    }
  };

  const updateHive = async (hiveId, updates) => {
    try {
      const updatedHives = hives.map(hive =>
        hive.id === hiveId ? { ...hive, ...updates } : hive
      );
      setHives(updatedHives);
      await AsyncStorage.setItem('hives', JSON.stringify(updatedHives));
      return { success: true };
    } catch (error) {
      console.error('Error updating hive:', error);
      return { success: false, error: 'Failed to update hive' };
    }
  };

  const deleteHive = async (hiveId) => {
    try {
      const updatedHives = hives.filter(hive => hive.id !== hiveId);
      setHives(updatedHives);
      await AsyncStorage.setItem('hives', JSON.stringify(updatedHives));
      
      // Also remove related inspections and harvests
      const updatedInspections = inspections.filter(i => i.hiveId !== hiveId);
      const updatedHarvests = harvests.filter(h => h.hiveId !== hiveId);
      
      setInspections(updatedInspections);
      setHarvests(updatedHarvests);
      
      await Promise.all([
        AsyncStorage.setItem('inspections', JSON.stringify(updatedInspections)),
        AsyncStorage.setItem('harvests', JSON.stringify(updatedHarvests)),
      ]);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting hive:', error);
      return { success: false, error: 'Failed to delete hive' };
    }
  };

  const addInspection = async (inspectionData) => {
    try {
      const newInspection = {
        id: Date.now().toString(),
        ...inspectionData,
        createdAt: new Date().toISOString(),
      };
      const updatedInspections = [...inspections, newInspection];
      setInspections(updatedInspections);
      
      // Update hive's last inspection date
      await updateHive(inspectionData.hiveId, {
        lastInspectionDate: inspectionData.date,
      });
      
      await AsyncStorage.setItem('inspections', JSON.stringify(updatedInspections));
      return { success: true, inspection: newInspection };
    } catch (error) {
      console.error('Error adding inspection:', error);
      return { success: false, error: 'Failed to add inspection' };
    }
  };

  const addHarvest = async (harvestData) => {
    try {
      const newHarvest = {
        id: Date.now().toString(),
        ...harvestData,
        createdAt: new Date().toISOString(),
      };
      const updatedHarvests = [...harvests, newHarvest];
      setHarvests(updatedHarvests);
      await AsyncStorage.setItem('harvests', JSON.stringify(updatedHarvests));
      return { success: true, harvest: newHarvest };
    } catch (error) {
      console.error('Error adding harvest:', error);
      return { success: false, error: 'Failed to add harvest' };
    }
  };

  const getHiveInspections = (hiveId) => {
    return inspections
      .filter(i => i.hiveId === hiveId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getHiveHarvests = (hiveId) => {
    return harvests
      .filter(h => h.hiveId === hiveId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const value = {
    hives,
    inspections,
    harvests,
    loading,
    addHive,
    updateHive,
    deleteHive,
    addInspection,
    addHarvest,
    getHiveInspections,
    getHiveHarvests,
  };

  return <HiveContext.Provider value={value}>{children}</HiveContext.Provider>;
};

