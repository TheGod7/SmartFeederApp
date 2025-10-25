import { getAccessToken, getRefreshToken } from "@/utils/secureStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Index = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      if (accessToken && refreshToken) {
        router.replace("/(home)");
      } else {
        router.replace("/(auth)");
      }
    };

    checkLogin().finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FABC66" />
      </View>
    );
  }

  return null;
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
