import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Checkbox from './Checkbox';
import Colors from '@/constants/colors';

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: Option[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  error?: string;
  style?: ViewStyle;
  horizontal?: boolean;
  disabled?: boolean;
}

export default function CheckboxGroup({
  label,
  options,
  selectedValues,
  onValueChange,
  error,
  style,
  horizontal = false,
  disabled = false
}: CheckboxGroupProps) {
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onValueChange(selectedValues.filter(v => v !== value));
    } else {
      onValueChange([...selectedValues, value]);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.optionsContainer,
        horizontal && styles.horizontalContainer
      ]}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selectedValues.includes(option.value)}
            onToggle={() => handleToggle(option.value)}
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
    marginBottom: 8,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: 4,
  },
});