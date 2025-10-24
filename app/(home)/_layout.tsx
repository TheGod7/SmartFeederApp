import ProtectedRoute from "@/components/guard/ProtectedRoute";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  return (
    <ProtectedRoute>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "transparent" },
            animation: "slide_from_right",
          }}
        />
      </View>
    </ProtectedRoute>
  );
}
