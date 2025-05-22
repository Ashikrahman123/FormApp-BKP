import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { user, updateProfile } = useAuthStore();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  
  const [username, setUsername] = useState(user?.username || '');
  const [storeName, setStoreName] = useState(user?.storeName || '');
  const [storeAddress, setStoreAddress] = useState(user?.storeAddress || '');
  const [errors, setErrors] = useState<{
    username?: string;
    storeName?: string;
    storeAddress?: string;
  }>({});
  
  const validate = () => {
    const newErrors: {
      username?: string;
      storeName?: string;
      storeAddress?: string;
    } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }
    
    if (!storeAddress.trim()) {
      newErrors.storeAddress = 'Store address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleUpdateProfile = () => {
    if (validate()) {
      updateProfile({
        username,
        storeName,
        storeAddress
      });
      
      Alert.alert(
        'Success',
        'Profile updated successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
          <View style={styles.headerContainer}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
              <Text style={[styles.subtitle, { color: colors.placeholder }]}>Update your profile information</Text>
            </View>
          </View>
          
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            error={errors.username}
            autoCapitalize="none"
          />
          
          <Input
            label="Store Name"
            value={storeName}
            onChangeText={setStoreName}
            placeholder="Enter store name"
            error={errors.storeName}
            autoCapitalize="words"
          />
          
          <Input
            label="Store Address"
            value={storeAddress}
            onChangeText={setStoreAddress}
            placeholder="Enter store address"
            error={errors.storeAddress}
            multiline
            numberOfLines={3}
          />
          
          <Button
            title="Save Changes"
            onPress={handleUpdateProfile}
            style={styles.button}
          />
          
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  cancelButton: {
    marginTop: 12,
  },
});