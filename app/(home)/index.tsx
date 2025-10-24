import { useApi } from "@/context/ApiContext";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Home = () => {
  const router = useRouter();
  const api = useApi();

  const handlePress = async () => {
    router.replace("/(auth)");
    try {
      const response = await api.get("/auth/me");
      console.log("Response:", response.data);
    } catch (err) {
      console.log("API request failed:", err);
    }
  };

  return (
    <View>
      <Text className="text-text font-itim">Home</Text>
      <Pressable className="w-full bg-primary" onPress={handlePress}>
        <Text className="text-text font-itim">Hola</Text>
      </Pressable>
    </View>
  );
};

export default Home;
