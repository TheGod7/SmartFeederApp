import { ApiProvider } from "@/context/ApiContext";
import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Itim: require("@/assets/fonts/Itim-Regular.ttf"),
  });

  useEffect(() => {
    if (fontError) throw fontError;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ApiProvider>
      <SafeAreaProvider>
        <StatusBar style="light" translucent />
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: "#070A13",
            },
          }}
        >
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(home)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </ApiProvider>
  );
}
