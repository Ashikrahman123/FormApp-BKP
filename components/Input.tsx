import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  Animated,
  Platform
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType,
  autoCapitalize = 'none',
  style,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true
}: InputProps) {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation for focus effect
  const focusAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);
  
  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary]
  });
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const handleLabelPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={handleLabelPress}
          disabled={!editable}
        >
          <Text style={[
            styles.label, 
            { color: colors.text },
            isFocused && { color: colors.primary }
          ]}>
            {label}
          </Text>
        </TouchableOpacity>
      )}
      <Animated.View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.card,
          borderColor: error ? colors.error : borderColor 
        },
        !editable && { backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F5F5F5' }
      ]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { color: colors.text },
            multiline && { textAlignVertical: 'top' },
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={colors.primary}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.placeholder} />
            ) : (
              <Eye size={20} color={colors.placeholder} />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Animated.Text 
          style={[
            styles.errorText, 
            { color: colors.error }
          ]}
        >
          {error}
        </Animated.Text>
      )}
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
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});