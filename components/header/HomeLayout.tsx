import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "../CustomImage";
import Background from "../background/Background";

const HomeHeader = (_route: any) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <>
      <Background position="top" />
      <View
        className="w-full bg-transparent "
        style={{ paddingTop: insets.top }}
      >
        <View
          className={`flex-row items-center justify-start w-full px-4 py-2`}
        >
          <Pressable
            className={`flex-row items-center active:opacity-60 mx-2 `}
            onPress={() => router.replace("/(auth)/logout")}
          >
            <Image
              source={require("@/assets/ico/SignOut.svg")}
              className="w-6 h-6 text-primary mr-2"
            />

            <Text className="text-wrong font-itim text-2xl">
              Salir de la cuenta
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default HomeHeader;
