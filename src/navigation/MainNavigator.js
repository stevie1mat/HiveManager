import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TouchableOpacity, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONTS } from '../constants/fonts';
import DashboardScreen from '../screens/main/DashboardScreen';
import HiveDetailsScreen from '../screens/main/HiveDetailsScreen';
import NewInspectionScreen from '../screens/main/NewInspectionScreen';
import InspectionDetailsScreen from '../screens/main/InspectionDetailsScreen';
import HoneyProductionScreen from '../screens/main/HoneyProductionScreen';
import LogHoneyHarvestScreen from '../screens/main/LogHoneyHarvestScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import EditProfileScreen from '../screens/main/EditProfileScreen';
import AddHiveScreen from '../screens/main/AddHiveScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HoneyStack = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HoneyProduction"
        component={HoneyProductionScreen}
        options={({ navigation }) => ({
          title: 'Honey Production',
          headerTitleAlign: 'left',
          headerStyle: {
            height: 112,
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            paddingBottom: 6,
            letterSpacing: -0.3,
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
                padding: 8,
              }}
              onPress={() => {
                navigation.navigate('HoneyProduction', { openSidebar: true });
              }}
            >
              <Ionicons name="menu" size={24} color="#343A40" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 16,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(244, 192, 37, 0.9)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(244, 192, 37, 0.5)',
                shadowColor: '#F4C025',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={() => navigation.navigate('LogHoneyHarvest')}
            >
              <Ionicons name="add" size={18} color="#343A40" style={{ marginRight: 6 }} />
              <Text style={{ color: '#343A40', fontSize: 14, fontWeight: '600' }}>
                Log Harvest
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="LogHoneyHarvest"
        component={LogHoneyHarvestScreen}
        options={({ navigation }) => ({
          title: 'Log Honey Harvest',
          headerTitleAlign: 'left',
          headerTintColor: '#000000',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            letterSpacing: -0.3,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 8,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#000000" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

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
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            paddingBottom: 6,
            letterSpacing: -0.3,
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
                padding: 8,
                borderRadius: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
              }}
              onPress={() => {
                // Navigate to Dashboard with openSidebar param
                navigation.navigate('Dashboard', { openSidebar: true });
              }}
            >
              <Ionicons name="menu" size={22} color="#343A40" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: 'rgba(244, 192, 37, 0.9)',
                borderWidth: 1,
                borderColor: 'rgba(244, 192, 37, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
                shadowColor: '#F4C025',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={() => navigation.navigate('AddHive')}
            >
              <Ionicons name="add" size={20} color="#343A40" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="HiveDetails"
        component={HiveDetailsScreen}
        options={({ navigation, route }) => ({
          title: 'Hive Details',
          headerTitleAlign: 'left',
          headerTintColor: '#000000',
          headerBackTitleVisible: false,
          headerStyle: {
            height: 120,
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            letterSpacing: -0.3,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 8,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#000000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 16,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(244, 192, 37, 0.9)',
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(244, 192, 37, 0.5)',
                shadowColor: '#F4C025',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={() => {
                const hiveId = route.params?.hiveId;
                if (hiveId) {
                  navigation.navigate('NewInspection', { hiveId });
                }
              }}
            >
              <Ionicons name="add" size={18} color="#343A40" style={{ marginRight: 6 }} />
              <Text style={{ color: '#343A40', fontSize: 14, fontWeight: '600' }}>
                New Inspection
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="NewInspection"
        component={NewInspectionScreen}
        options={({ navigation, route }) => {
          const formatDate = () => {
            const date = new Date();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}`;
          };

          return {
            title: 'New Inspection',
            headerTitleAlign: 'left',
            headerTintColor: '#000000',
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#f9f1e8',
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0, 0, 0, 0.05)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            },
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: '600',
              fontFamily: FONTS.heading,
              color: '#343A40',
              letterSpacing: -0.3,
            },
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  marginLeft: 16,
                  padding: 8,
                }}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={20} color="#000000" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <View style={{ marginRight: 16 }}>
                <Text style={{ color: '#6C757D', fontSize: 15, fontWeight: '600' }}>
                  {formatDate()}
                </Text>
              </View>
            ),
          };
        }}
      />
      <Stack.Screen
        name="InspectionDetails"
        component={InspectionDetailsScreen}
        options={({ navigation }) => ({
          title: 'Inspection Details',
          headerTitleAlign: 'left',
          headerTintColor: '#000000',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            letterSpacing: -0.3,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 8,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#000000" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddHive"
        component={AddHiveScreen}
        options={({ navigation }) => ({
          title: 'Add New Hive',
          headerTitleAlign: 'left',
          headerTintColor: '#000000',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            letterSpacing: -0.3,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 8,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#000000" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          title: 'My Account',
          tabBarLabel: 'My Account',
          headerShown: true,
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            letterSpacing: -0.3,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 8,
              }}
              onPress={() => {
                navigation.navigate('Settings', { openSidebar: true });
              }}
            >
              <Ionicons name="menu" size={24} color="#343A40" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => {
                navigation.navigate('EditProfile');
              }}
            >
              <Text style={{ color: '#F4C025', fontSize: 16, fontWeight: 'bold' }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          title: 'Edit Profile',
          headerTitleAlign: 'left',
          headerTintColor: '#000000',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: '#f9f1e8',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: '600',
            fontFamily: FONTS.heading,
            color: '#343A40',
            letterSpacing: -0.3,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 16,
                padding: 8,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={20} color="#000000" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'Dashboard';
        const hideTabBar = routeName === 'NewInspection' || routeName === 'AddHive' || routeName === 'LogHoneyHarvest' || routeName === 'EditProfile';

        return {
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
          tabBarStyle: hideTabBar
            ? { display: 'none' }
            : {
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
        };
      }}
    >
      <Tab.Screen name="Hives" component={HiveStack} />
      <Tab.Screen name="Honey" component={HoneyStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default MainNavigator;

