import Header from "@/components/header";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function AuthLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "transparent" },
            animation: "slide_from_right",
            header(props) {
              return <Header {...props} />;
            },
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
      </View>
    </AuthProvider>
  );
}
