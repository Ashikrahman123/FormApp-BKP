import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  Pressable
} from 'react-native';
import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle
}: ButtonProps) {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  // Animation for press feedback
  const animatedScale = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(animatedScale, {
      toValue: 0.97,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [
          styles.button,
          { backgroundColor: colors.primary },
          disabled && { backgroundColor: colors.inactive },
          style
        ];
      case 'secondary':
        return [
          styles.button,
          { backgroundColor: colors.secondary },
          disabled && { backgroundColor: colors.inactive },
          style
        ];
      case 'outline':
        return [
          styles.button,
          { 
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: disabled ? colors.inactive : colors.primary 
          },
          style
        ];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return [styles.buttonText, { color: '#FFFFFF' }, textStyle];
      case 'outline':
        return [
          styles.buttonText, 
          { color: disabled ? colors.inactive : colors.primary },
          textStyle
        ];
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [
        { opacity: pressed ? 0.9 : 1 }
      ]}
    >
      <Animated.View 
        style={[
          getButtonStyle(),
          { transform: [{ scale: animatedScale }] }
        ]}
      >
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' ? colors.primary : '#FFFFFF'} 
            size="small" 
          />
        ) : (
          <Text style={getTextStyle()}>{title}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});