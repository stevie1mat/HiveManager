import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import DashboardScreen from '../screens/main/DashboardScreen';
import HiveDetailsScreen from '../screens/main/HiveDetailsScreen';
import NewInspectionScreen from '../screens/main/NewInspectionScreen';
import HoneyProductionScreen from '../screens/main/HoneyProductionScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import AddHiveScreen from '../screens/main/AddHiveScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HiveStack = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={({ navigation }) => ({
          title: 'My Hives',
          headerTitleAlign: 'left',
          headerStyle: {
            height: 112,
            paddingBottom: 8,
          },
          headerTitleStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            fontFamily: FONTS.heading,
            paddingBottom: 6,
          },
          headerLeftContainerStyle: {
            paddingBottom: 8,
          },
          headerRightContainerStyle: {
            paddingBottom: 8,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 4,
              }}
              onPress={() => {
                // Access the DashboardScreen component to toggle sidebar
                const route = navigation.getState()?.routes?.find(r => r.name === 'Dashboard');
                if (route?.params) {
                  navigation.setParams({ openSidebar: true });
                }
              }}
            >
              <Ionicons name="menu" size={24} color="#343A40" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#FFC107',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}
              onPress={() => navigation.navigate('AddHive')}
            >
              <Ionicons name="add" size={18} color="#343A40" />
            </TouchableOpacity>
          ),
        })}
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

          return <Ionicons name={iconName} size={focused ? 20 : 18} color={color} />;
        },
        tabBarActiveTintColor: '#FFC107',
        tabBarInactiveTintColor: '#6C757D',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: 16,
          right: 16,
          height: 64,
          backgroundColor: '#FFFFFF',
          borderRadius: 100,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: '#E9ECEF',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: FONTS.bodyMedium,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
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

