// app/_layout.js
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css'; 

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'FlashQuiz Pro',
            headerStyle: { backgroundColor: '#0984E3' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }} 
        />
        <Stack.Screen 
          name="quiz" 
          options={{ 
            title: 'Quiz Mode',
            headerStyle: { backgroundColor: '#0984E3' },
            headerTintColor: '#fff',
          }} 
        />
        <Stack.Screen 
          name="manage" 
          options={{ 
            title: 'Manage Deck',
            headerStyle: { backgroundColor: '#0984E3' },
            headerTintColor: '#fff',
          }} 
        />
      </Stack>
    </>
  );
}