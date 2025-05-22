import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import Colors from "@/constants/colors";
import { useAuthStore } from "@/stores/authStore";

export default function SplashScreen() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? Colors.dark : Colors.light;
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View
          style={[styles.logoContainer, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.logoText}>DF</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          HAJI RAHMATHULLAH STORE
        </Text>
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Declaration Form
        </Text>
        <Text style={[styles.address, { color: colors.text }]}>
          1, PARK ROAD, 01-K95B, PEOPLES PARK COMPLEX, SINGAPORE, 059108
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    textAlign: "center",
    maxWidth: "80%",
  },
});
