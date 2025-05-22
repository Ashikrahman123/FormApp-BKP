import { Slot, SplashScreen, Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialized, setInitialized] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize any resources, auth state, etc.
    const init = async () => {
      try {
        // Artificially delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setInitialized(true);
        SplashScreen.hideAsync();
      }
    };

    init();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}