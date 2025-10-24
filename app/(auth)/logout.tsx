import { useAuth } from "@/context/AuthContext";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const MINIMUM_DELAY = 400;

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const Logout = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    let mounted = true;

    const perform = async () => {
      const logoutPromise = (async () => {
        try {
          await logout();
        } catch (err) {
          console.warn("Logout failed:", err);
        }
      })();

      const delayPromise = sleep(MINIMUM_DELAY);

      await Promise.all([logoutPromise, delayPromise]);

      if (!mounted) return;

      const current = segments[segments.length - 1] ?? "";
      if (current === "logout") {
        router.replace("/(auth)");
      }
    };

    perform();

    return () => {
      mounted = false;
    };
  }, [logout, router, segments]);

  return (
    <View className="absolute inset-0 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#FABC66" />
      <Text className="text-primary font-itim mt-3">Cerrando sesión...</Text>
    </View>
  );
};

export default Logout;
