import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themePreference: ThemeType;
  setThemePreference: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  themePreference: 'system',
  setThemePreference: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeType>('system');
  const [theme, setTheme] = useState<'light' | 'dark'>(colorScheme || 'light');

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme) {
          setThemePreference(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Update theme based on preference and system
  useEffect(() => {
    if (themePreference === 'system') {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    } else {
      setTheme(themePreference === 'dark' ? 'dark' : 'light');
    }
  }, [themePreference, colorScheme]);

  // Save theme preference when it changes
  const handleSetThemePreference = async (newTheme: ThemeType) => {
    setThemePreference(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        themePreference, 
        setThemePreference: handleSetThemePreference 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};