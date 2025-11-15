import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/main/DashboardScreen';
import HiveDetailsScreen from '../screens/main/HiveDetailsScreen';
import NewInspectionScreen from '../screens/main/NewInspectionScreen';
import HoneyProductionScreen from '../screens/main/HoneyProductionScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import AddHiveScreen from '../screens/main/AddHiveScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HiveStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'My Hives' }}
      />
      <Stack.Screen
        name="HiveDetails"
        component={HiveDetailsScreen}
        options={{ title: 'Hive Details' }}
      />
      <Stack.Screen
        name="NewInspection"
        component={NewInspectionScreen}
        options={{ title: 'New Inspection' }}
      />
      <Stack.Screen
        name="AddHive"
        component={AddHiveScreen}
        options={{ title: 'Add New Hive' }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Hives') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Honey') {
            iconName = focused ? 'flower' : 'flower-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Hives" component={HiveStack} />
      <Tab.Screen
        name="Honey"
        component={HoneyProductionScreen}
        options={{ title: 'Honey Production' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

