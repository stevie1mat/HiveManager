import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const HiveContext = createContext({});

export const useHive = () => {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error('useHive must be used within a HiveProvider');
  }
  return context;
};

export const HiveProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [hives, setHives] = useState([]);
  const [inspections, setInspections] = useState({});
  const [harvests, setHarvests] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadHives();
    } else {
      setHives([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadHives = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('hives')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading hives:', error);
        return;
      }

      if (data) {
        // Map Supabase column names to app format
        const mappedHives = data.map((hive) => ({
          id: hive.id,
          hiveId: hive.hive_id,
          queenStatus: hive.queen_status,
          strength: hive.strength,
          lastInspectionDate: hive.last_inspection_date,
          userId: hive.user_id,
          createdAt: hive.created_at,
          updatedAt: hive.updated_at,
        }));
        setHives(mappedHives);
      }
    } catch (error) {
      console.error('Error loading hives:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInspections = async (hiveId) => {
    try {
      const { data, error } = await supabase
        .from('inspections')
        .select('*')
        .eq('hive_id', hiveId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading inspections:', error);
        return [];
      }

      if (data) {
        const mappedInspections = data.map((inspection) => ({
          id: inspection.id,
          hiveId: inspection.hive_id,
          date: inspection.date,
          generalHealth: inspection.general_health,
          queenStatus: inspection.queen_status,
          temperament: inspection.temperament,
          swarmCells: inspection.swarm_cells,
          diseases: inspection.diseases,
          notes: inspection.notes,
          createdAt: inspection.created_at,
        }));
        setInspections((prev) => ({
          ...prev,
          [hiveId]: mappedInspections,
        }));
        return mappedInspections;
      }
      return [];
    } catch (error) {
      console.error('Error loading inspections:', error);
      return [];
    }
  };

  const loadHarvests = async (hiveId) => {
    try {
      const { data, error } = await supabase
        .from('harvests')
        .select('*')
        .eq('hive_id', hiveId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading harvests:', error);
        return [];
      }

      if (data) {
        const mappedHarvests = data.map((harvest) => ({
          id: harvest.id,
          hiveId: harvest.hive_id,
          date: harvest.date,
          quantity: harvest.quantity,
          unit: harvest.unit,
          createdAt: harvest.created_at,
        }));
        setHarvests((prev) => ({
          ...prev,
          [hiveId]: mappedHarvests,
        }));
        return mappedHarvests;
      }
      return [];
    } catch (error) {
      console.error('Error loading harvests:', error);
      return [];
    }
  };

  const addHive = async (hiveData) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { data, error } = await supabase
        .from('hives')
        .insert({
          hive_id: hiveData.hiveId,
          queen_status: hiveData.queenStatus || 'Unknown',
          strength: hiveData.strength || 'Unknown',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding hive:', error);
        return { success: false, error: error.message || 'Failed to add hive' };
      }

      if (data) {
        const newHive = {
          id: data.id,
          hiveId: data.hive_id,
          queenStatus: data.queen_status,
          strength: data.strength,
          lastInspectionDate: data.last_inspection_date,
          userId: data.user_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setHives((prev) => [newHive, ...prev]);
        return { success: true, hive: newHive };
      }

      return { success: false, error: 'Failed to add hive' };
    } catch (error) {
      console.error('Error adding hive:', error);
      return { success: false, error: error.message || 'Failed to add hive' };
    }
  };

  const updateHive = async (hiveId, updates) => {
    try {
      const updateData = {};
      if (updates.queenStatus !== undefined) updateData.queen_status = updates.queenStatus;
      if (updates.strength !== undefined) updateData.strength = updates.strength;
      if (updates.lastInspectionDate !== undefined) updateData.last_inspection_date = updates.lastInspectionDate;
      if (updates.hiveId !== undefined) updateData.hive_id = updates.hiveId;

      const { data, error } = await supabase
        .from('hives')
        .update(updateData)
        .eq('id', hiveId)
        .select()
        .single();

      if (error) {
        console.error('Error updating hive:', error);
        return { success: false, error: error.message || 'Failed to update hive' };
      }

      if (data) {
        const updatedHive = {
          id: data.id,
          hiveId: data.hive_id,
          queenStatus: data.queen_status,
          strength: data.strength,
          lastInspectionDate: data.last_inspection_date,
          userId: data.user_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setHives((prev) =>
          prev.map((hive) => (hive.id === hiveId ? updatedHive : hive))
        );
        return { success: true };
      }

      return { success: false, error: 'Failed to update hive' };
    } catch (error) {
      console.error('Error updating hive:', error);
      return { success: false, error: error.message || 'Failed to update hive' };
    }
  };

  const deleteHive = async (hiveId) => {
    try {
      const { error } = await supabase
        .from('hives')
        .delete()
        .eq('id', hiveId);

      if (error) {
        console.error('Error deleting hive:', error);
        return { success: false, error: error.message || 'Failed to delete hive' };
      }

      setHives((prev) => prev.filter((hive) => hive.id !== hiveId));
      // Remove from local state
      setInspections((prev) => {
        const newInspections = { ...prev };
        delete newInspections[hiveId];
        return newInspections;
      });
      setHarvests((prev) => {
        const newHarvests = { ...prev };
        delete newHarvests[hiveId];
        return newHarvests;
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting hive:', error);
      return { success: false, error: error.message || 'Failed to delete hive' };
    }
  };

  const addInspection = async (inspectionData) => {
    try {
      // Convert date string to ISO format if needed
      const dateValue = inspectionData.date instanceof Date 
        ? inspectionData.date.toISOString() 
        : new Date(inspectionData.date).toISOString();

      const { data, error } = await supabase
        .from('inspections')
        .insert({
          hive_id: inspectionData.hiveId,
          date: dateValue,
          general_health: inspectionData.generalHealth,
          queen_status: inspectionData.queenStatus,
          temperament: inspectionData.temperament || null,
          swarm_cells: inspectionData.swarmCells || null,
          diseases: inspectionData.diseases || null,
          notes: inspectionData.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding inspection:', error);
        return { success: false, error: error.message || 'Failed to add inspection' };
      }

      if (data) {
        const newInspection = {
          id: data.id,
          hiveId: data.hive_id,
          date: data.date,
          generalHealth: data.general_health,
          queenStatus: data.queen_status,
          temperament: data.temperament,
          swarmCells: data.swarm_cells,
          diseases: data.diseases,
          notes: data.notes,
          createdAt: data.created_at,
        };
        setInspections((prev) => ({
          ...prev,
          [inspectionData.hiveId]: [
            newInspection,
            ...(prev[inspectionData.hiveId] || []),
          ],
        }));

        // Update hive's last inspection date
        await updateHive(inspectionData.hiveId, {
          lastInspectionDate: dateValue,
        });

        return { success: true, inspection: newInspection };
      }

      return { success: false, error: 'Failed to add inspection' };
    } catch (error) {
      console.error('Error adding inspection:', error);
      return { success: false, error: error.message || 'Failed to add inspection' };
    }
  };

  const addHarvest = async (harvestData) => {
    try {
      // Convert date to proper format (YYYY-MM-DD for date type)
      const dateValue = harvestData.date instanceof Date
        ? harvestData.date.toISOString().split('T')[0]
        : harvestData.date.split('T')[0];

      const { data, error } = await supabase
        .from('harvests')
        .insert({
          hive_id: harvestData.hiveId,
          date: dateValue,
          quantity: harvestData.quantity,
          unit: harvestData.unit,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding harvest:', error);
        return { success: false, error: error.message || 'Failed to add harvest' };
      }

      if (data) {
        const newHarvest = {
          id: data.id,
          hiveId: data.hive_id,
          date: data.date,
          quantity: data.quantity,
          unit: data.unit,
          createdAt: data.created_at,
        };
        setHarvests((prev) => ({
          ...prev,
          [harvestData.hiveId]: [
            newHarvest,
            ...(prev[harvestData.hiveId] || []),
          ],
        }));
        return { success: true, harvest: newHarvest };
      }

      return { success: false, error: 'Failed to add harvest' };
    } catch (error) {
      console.error('Error adding harvest:', error);
      return { success: false, error: error.message || 'Failed to add harvest' };
    }
  };

  const getHiveInspections = async (hiveId) => {
    // Check if already loaded
    if (inspections[hiveId]) {
      return inspections[hiveId];
    }
    // Load from server
    return await loadInspections(hiveId);
  };

  const getHiveHarvests = async (hiveId) => {
    // Check if already loaded
    if (harvests[hiveId]) {
      return harvests[hiveId];
    }
    // Load from server
    return await loadHarvests(hiveId);
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
    refreshHives: loadHives,
  };

  return <HiveContext.Provider value={value}>{children}</HiveContext.Provider>;
};
