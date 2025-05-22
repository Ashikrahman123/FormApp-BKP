import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Switch, Alert, Animated } from 'react-native';
import { Link, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/stores/authStore';
import Colors from '@/constants/colors';
import { FontAwesome } from '@expo/vector-icons';

type IconName = 'user' | 'lock' | 'moon-o' | 'sign-out' | 'info-circle' | 'question-circle' | 'pencil' | 'chevron-right';

interface ListItemProps {
  icon: IconName;
  color?: string;
  title: string;
  description: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

export default function SettingsScreen() {
  const { theme, setThemePreference } = useTheme();
  const { user, logout } = useAuthStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const ListItem = useCallback(({ icon, color, title, description, onPress, rightElement }: ListItemProps) => (
    <TouchableOpacity 
      style={[styles.item, { backgroundColor: colors.card }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <FontAwesome name={icon} size={20} color={color || colors.primary} />
      <View style={styles.itemContent}>
        <Text style={[styles.itemText, { color: color || colors.text }]}>{title}</Text>
        <Text style={[styles.itemDescription, { color: colors.placeholder }]}>{description}</Text>
      </View>
      {rightElement}
    </TouchableOpacity>
  ), [colors]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.profilePreview}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.card }]}>
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.username, { color: colors.text }]}>{user?.username || 'User'}</Text>
            <Text style={[styles.storeName, { color: colors.placeholder }]}>{user?.storeName || 'Store'}</Text>
          </View>
          <Link href="/(tabs)/settings/profile" asChild>
            <TouchableOpacity style={styles.editButton}>
              <FontAwesome name="pencil" size={16} color={colors.primary} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        
        <ListItem
          icon="user"
          title="Profile"
          description="Edit your profile information"
          onPress={() => router.push('/(tabs)/settings/profile')}
          rightElement={<FontAwesome name="chevron-right" size={16} color={colors.text} />}
        />

        <ListItem
          icon="lock"
          title="Change Password"
          description="Update your password"
          onPress={() => router.push('/(tabs)/settings/change-password')}
          rightElement={<FontAwesome name="chevron-right" size={16} color={colors.text} />}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <ListItem
          icon="moon-o"
          title="Dark Mode"
          description="Toggle dark theme"
          rightElement={
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => setThemePreference(value ? 'dark' : 'light')}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
        
        <ListItem
          icon="info-circle"
          title="About"
          description="App version and information"
          onPress={() => Alert.alert('About', 'FormApp v1.0.0\n© 2025 All rights reserved')}
          rightElement={<FontAwesome name="chevron-right" size={16} color={colors.text} />}
        />

        <ListItem
          icon="question-circle"
          title="Help & Support"
          description="Get help with using the app"
          onPress={() => Alert.alert('Support', 'For support, please contact support@formapp.com')}
          rightElement={<FontAwesome name="chevron-right" size={16} color={colors.text} />}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Other</Text>
        
        <ListItem
          icon="sign-out"
          color={colors.error}
          title="Logout"
          description="Sign out of your account"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  storeName: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  itemContent: {
    flex: 1,
    marginLeft: 16,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
});
