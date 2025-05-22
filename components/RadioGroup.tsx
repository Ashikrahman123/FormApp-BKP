import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import RadioButton from './RadioButton';
import Colors from '@/constants/colors';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label?: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  error?: string;
  style?: ViewStyle;
  horizontal?: boolean;
  disabled?: boolean;
}

export default function RadioGroup({
  label,
  options,
  selectedValue,
  onValueChange,
  error,
  style,
  horizontal = false,
  disabled = false
}: RadioGroupProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.optionsContainer,
        horizontal && styles.horizontalContainer
      ]}>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            label={option.label}
            value={option.value}
            selectedValue={selectedValue}
            onSelect={onValueChange}
            disabled={disabled}
            style={horizontal ? styles.horizontalOption : undefined}
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  horizontalOption: {
    marginRight: 16,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: 4,
  },
});