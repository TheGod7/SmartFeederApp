import { useApi } from "@/context/ApiContext";
import { useRouter } from "expo-router";
import React, { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const api = useApi();
  const insets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        await api.get("/auth/me");
        if (mounted) setIsAuthenticated(true);
      } catch {
        if (mounted) setIsAuthenticated(false);
        router.replace("/(auth)/logout");
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [api, router]);

  if (isAuthenticated === null) {
    return (
      <View
        className="flex-1 items-center justify-center bg-background"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#FABC66" />
        <Text className="mt-4 text-primary font-itim text-lg">
          Verificando sesión...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
