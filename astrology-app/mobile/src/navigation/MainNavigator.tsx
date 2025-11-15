import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TodayScreen from '@/screens/main/TodayScreen';
import ProfilesScreen from '@/screens/main/ProfilesScreen';
import ExploreNavigator from '@/navigation/ExploreNavigator';
import AIAssistantScreen from '@/screens/main/AIAssistantScreen';
import SettingsScreen from '@/screens/main/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Today') {
            iconName = focused ? 'today' : 'today-outline';
          } else if (route.name === 'Profiles') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'AI') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#1a1b2e',
          borderTopColor: '#2d2e3f',
        },
        headerStyle: {
          backgroundColor: '#1a1b2e',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Profiles" component={ProfilesScreen} />
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="AI" component={AIAssistantScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
