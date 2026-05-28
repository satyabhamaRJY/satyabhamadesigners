import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View className="flex-1 bg-stone-950">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0c0a09', // stone-950
          },
          headerTintColor: '#d4af37', // gold
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'serif',
          },
          contentStyle: {
            backgroundColor: '#0c0a09'
          }
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Satyabhama',
            headerShown: false // Hide header for the cinematic home screen
          }} 
        />
      </Stack>
    </View>
  );
}
