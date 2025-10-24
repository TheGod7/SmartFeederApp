import CreatePasswordModal from "@/components/modals/CreatePasswordModal";
import { useApi } from "@/context/ApiContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const Home = () => {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const { hasPassword } = useLocalSearchParams();

  const router = useRouter();
  const api = useApi();

  const handlePress = async () => {
    router.replace("/(auth)/logout");
    try {
      const response = await api.get("/auth/me");
      console.log("Response:", response.data);
    } catch (err) {
      console.log("API request failed:", err);
    }
  };

  const handleCloseModal = () => {
    setIsPasswordModalVisible(false);
  };

  useEffect(() => {
    if (hasPassword === "false") {
      setIsPasswordModalVisible(true);
    }
  }, [hasPassword]);

  return (
    <View>
      <Text className="text-text font-itim">Home</Text>
      <Pressable className="w-full bg-primary" onPress={handlePress}>
        <Text className="text-text font-itim">Hola</Text>
      </Pressable>

      <CreatePasswordModal
        isVisible={isPasswordModalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
};

export default Home;
