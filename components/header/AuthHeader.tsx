import { useAuth } from "@/context/AuthContext";
import { ImageBackground } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "../CustomImage";

const Header = (_route: any) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { isLoading } = useAuth();

  return (
    <ImageBackground source={require("@/assets/images/Background.png")}>
      <View
        className="w-full bg-transparent border-b border-text/5"
        style={{ paddingTop: insets.top }}
      >
        <View
          className={`flex-row items-center justify-start w-full px-4 py-2`}
        >
          <Pressable
            disabled={isLoading}
            className={`flex-row items-center active:opacity-60 -ml-2 ${isLoading ? "opacity-50" : ""}`}
            onPress={() => router.dismissAll()}
          >
            <Image
              source={require("@/assets/ico/Back2.svg")}
              className="w-6 h-6 text-primary mr-1.5"
            />

            <Text className="text-primary font-itim text-lg">Atrás</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Header;
