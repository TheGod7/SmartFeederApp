import AuthHeader from "@/components/header/AuthHeader";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AuthLayout() {
  return (
    <AuthProvider>
      <AuthStack />
    </AuthProvider>
  );
}

function AuthStack() {
  const { accessToken, refreshToken, tokensReady } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tokensReady) return;

    const current = segments[segments.length - 1];

    const authPaths = ["(auth)", "login", "register"];

    if (accessToken && refreshToken && authPaths.includes(current)) {
      router.replace("/(home)");
      return;
    }

    if ((!accessToken || !refreshToken) && current === "logout") {
      router.replace("/(auth)");
      return;
    }

    setReady(true);
  }, [accessToken, refreshToken, tokensReady, segments, router]);

  if (!tokensReady || !ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#FABC66" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "transparent" },
        animation: "slide_from_right",
        header: (props) => <AuthHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="logout"
        options={{ headerShown: false, animation: "fade" }}
      />
    </Stack>
  );
}
