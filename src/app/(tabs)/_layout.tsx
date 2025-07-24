//src\app\(tabs)\_layout.tsx
import "@/global.css";
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HapticTab } from '../.././components/HapticTab';
import TabBarBackground from '../.././components/ui/TabBarBackground';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen name = "Calendar"
        options = {{
            tabBarLabel: 'Calendar',
            tabBarIcon:({color}) => <Ionicons name="calendar" size={24} color={color} />
        }}/>
      <Tabs.Screen name = "summary"
        options = {{
            tabBarLabel: 'Summary',
            tabBarIcon:({color}) => <Ionicons name="newspaper" size={24} color={color} />
        }}/>
        <Tabs.Screen name = "itinerary"
        options = {{
            tabBarLabel: 'Itinerary',
            tabBarIcon:({color}) => <Ionicons name="paper-plane" size={24} color={color} />
        }}/>
        <Tabs.Screen name = "mytrip"
        options = {{
            tabBarLabel: 'My Trip',
            tabBarIcon:({color}) => <Ionicons name="location-sharp" size={24} color={color} />
        }}
            />
      
    </Tabs>
  );
}