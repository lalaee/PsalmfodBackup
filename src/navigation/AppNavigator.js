import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import ChaptersScreen from '../screens/ChaptersScreen';
import VersesScreen from '../screens/VersesScreen';
import LibraryScreen from '../screens/LibraryScreen';
import IconsPsalms from '../assets/icons/svg/IconsPsalms.svg';
import IconsLibrary from '../assets/icons/svg/IconsLibrary.svg';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const darkThemeColors = {
  header: '#121212',
  background: '#1C1C1C',
  card: '#2C2C2C',
  text: '#FFFFFF',
  inactive: 'gray',
};

// The Stack navigator for the "Psalms" tab
const PsalmsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { 
        backgroundColor: '#181919',
        borderBottomWidth: 1,
        borderBottomColor: '#272828',
        },
        headerTitleStyle: {
        fontFamily: 'FKGroteskNeueTrial-Regular', // Custom font
        fontSize: 18, // Larger font size
        },
        headerTintColor: darkThemeColors.text,
      }}
    >
      <Stack.Screen
        name="Chapters"
        component={ChaptersScreen}
        options={{
          title: 'davidi',
          headerStyle: {
            backgroundColor: '#181919', // New background color
            shadowOpacity: 0, // for iOS
            elevation: 0, // for Android
          },
          headerTitleStyle: {
            fontFamily: 'FKGroteskNeueTrial-Thin', // Custom font
            fontSize: 22, // Larger font size
          },
          // headerTintColor: '#FFFFFF' // This ensures back button is white
        }}
      />
      <Stack.Screen name="Verses" component={VersesScreen} />
    </Stack.Navigator>
  );
};

// The main Tab Navigator
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: darkThemeColors.text,
        tabBarInactiveTintColor: darkThemeColors.inactive,
        tabBarStyle: {
          backgroundColor: darkThemeColors.header,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'FKGroteskNeueTrial-Regular',
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Chapters"
        component={PsalmsStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <IconsPsalms width={16} height={16} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <IconsLibrary width={16} height={16} color={color} />
          ),
          headerShown: true,
          title: 'Highlights',
          headerStyle: { 
            backgroundColor: '#181919',
            borderBottomWidth: 1,
            borderBottomColor: '#272828',
          },
          headerTitleStyle: {
            fontFamily: 'FKGroteskNeueTrial-Regular', // Custom font
            fontSize: 18, // Larger font size
          },
          headerTintColor: darkThemeColors.text,
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;