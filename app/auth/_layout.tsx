import { Stack, Redirect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import Colors from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';

export default function AuthLayout() {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          title: "Register",
        }}
      />
    </Stack>
  );
}