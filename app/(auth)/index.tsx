import { Image } from "@/components/CustomImage";
import InitialButtons from "@/components/InitialPage/InitialButtons";
import { ImageBackground } from "expo-image";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AppHeader = () => (
  <View className="flex-row items-center gap-3 px-6 pt-2 w-full justify-start">
    <Image source={require("@/assets/ico/icon.png")} className="w-10 h-10" />
    <Text className="text-text font-itim text-xl" style={{ fontSize: 20 }}>
      SmartFeeder
    </Text>
  </View>
);

const CatImage = () => (
  <View className="justify-center items-center w-full max-w-md aspect-square mx-auto">
    <Image
      source={require("@/assets/images/CatEating.gif")}
      className="w-full h-full rounded-3xl"
      contentFit="contain"
    />
  </View>
);

const IntroText = () => (
  <View className="items-center justify-center gap-2">
    <Text className="text-primary font-itim text-4xl text-center max-w-md">
      Una mascota, tu amigo
    </Text>

    <View className="items-center max-w-md">
      <Text className="text-text/80 font-itim text-base text-center">
        Automatiza la alimentación de tus mascotas, monitorea sus horarios y
        mejora su bienestar cada día.
      </Text>
    </View>
  </View>
);

export default function Index() {
  return (
    <ImageBackground
      source={require("@/assets/images/Background.png")}
      style={{ width: "100%", height: "100%", flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-between py-4">
        <AppHeader />

        <View className="flex-1 justify-around items-center px-4 pt-4 max-w-lg mx-auto">
          <IntroText />
          <CatImage />
        </View>

        <View className="max-w-lg mx-auto w-full items-center">
          <InitialButtons />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
