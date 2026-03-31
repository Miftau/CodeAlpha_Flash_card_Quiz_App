// app/_layout.js
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlashcardProvider } from '../src/context/FlashcardContext';
import '../global.css';

export default function RootLayout() {
  return (
    <FlashcardProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0984E3' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'FlashQuiz Pro' }}
        />
        <Stack.Screen
          name="quiz"
          options={{ title: 'Quiz Mode' }}
        />
        <Stack.Screen
          name="manage"
          options={{ title: 'Manage Cards' }}
        />
      </Stack>
    </FlashcardProvider>
  );
}