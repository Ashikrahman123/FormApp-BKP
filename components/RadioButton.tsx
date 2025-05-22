import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View,
  ViewStyle,
  Animated
} from 'react-native';
import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface RadioButtonProps {
  label: string;
  value: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function RadioButton({
  label,
  value,
  selectedValue,
  onSelect,
  style,
  disabled = false
}: RadioButtonProps) {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const isSelected = value === selectedValue;
  
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
      onPress={() => onSelect(value)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Animated.View 
        style={[
          styles.radio,
          { 
            borderColor: disabled ? colors.inactive : colors.primary,
          },
          { transform: [{ scale: animatedScale }] }
        ]}
      >
        {isSelected && (
          <View style={[
            styles.radioInner,
            { backgroundColor: disabled ? colors.inactive : colors.primary }
          ]} />
        )}
      </Animated.View>
      <Text style={[
        styles.label,
        { color: disabled ? colors.inactive : colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 14,
  },
});