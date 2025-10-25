import ProtectedRoute from "@/components/guard/ProtectedRoute";
import HomeHeader from "@/components/header/HomeLayout";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  return (
    <ProtectedRoute>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "transparent" },
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              animation: "fade",
              headerShown: true,
              header: HomeHeader,
            }}
          />
        </Stack>
      </View>
    </ProtectedRoute>
  );
}
