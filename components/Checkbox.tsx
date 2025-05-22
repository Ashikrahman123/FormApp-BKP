import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View,
  ViewStyle,
  Animated
} from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onToggle: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onToggle,
  style,
  disabled = false
}: CheckboxProps) {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  // Animation for press feedback
  const animatedScale = new Animated.Value(1);
  
  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(animatedScale, {
        toValue: 0.95,
        friction: 5,
        tension: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    Animated.spring(animatedScale, {
      toValue: 1,
      friction: 5,
      tension: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onToggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Animated.View 
        style={[
          styles.checkbox,
          { 
            borderColor: disabled ? colors.inactive : colors.primary,
            backgroundColor: checked 
              ? (disabled ? colors.inactive : colors.primary) 
              : 'transparent'
          },
          { transform: [{ scale: animatedScale }] }
        ]}
      >
        {checked && <Check size={16} color="#FFFFFF" />}
      </Animated.View>
      {label && (
        <Text style={[
          styles.label,
          { color: disabled ? colors.inactive : colors.text }
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
  },
});