import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const MINIMUM_DELAY = 400;

const Logout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const startTime = Date.now();

    logout().then(() => {
      const endTime = Date.now();
      const timeElapsed = endTime - startTime;
      const delayNeeded = MINIMUM_DELAY - timeElapsed;

      const finalizeLogout = () => {
        router.replace("/(auth)");
      };

      if (delayNeeded > 0) {
        setTimeout(finalizeLogout, delayNeeded);
      } else {
        finalizeLogout();
      }
    });
  }, [logout, router]);

  return (
    <View className="absolute inset-0 items-center justify-center gap-4 bg-background">
      <ActivityIndicator size="large" color="#ffffff" />

      <Text className="text-primary font-itim text-xl sm:text-2xl">
        Cerrando sesión...
      </Text>
    </View>
  );
};

export default Logout;
