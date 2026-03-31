// app/navigation/AppNavigator.js
// NOTE: This file is dead code — the app uses expo-router for navigation,
// not a manual NavigationContainer. It is kept here for reference only.
// Fixed: broken screen imports and invalid '#primary' color value.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// These screens are managed by expo-router (app/index.js, app/quiz.js, app/manage.js).
// This navigator is not mounted anywhere in the app.
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0984E3' }, // Fixed: was '#primary' (invalid)
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* 
          Fixed: original imports pointed to ../screens/HomeScreen etc.
          which don't exist. Expo-router auto-generates navigation from
          the app/ file structure — no screen components are needed here.
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}