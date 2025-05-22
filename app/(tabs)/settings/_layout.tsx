import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/colors';

export default function SettingsLayout() {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
        presentation: 'modal',
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Settings',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="change-password" 
        options={{ 
          title: 'Change Password',
          presentation: 'modal',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          presentation: 'card',
          headerShown: false
        }} 
      />
    </Stack>
  );
}
