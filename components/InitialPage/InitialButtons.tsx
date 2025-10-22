import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import SimpleButton from "../SimpleButton";

const loginRoute = "/(auth)/login";
const registerRoute = "/(auth)/register";

export default function InitialButtons() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const onPress = useCallback(
    (route: any) => {
      if (isNavigating) return;

      setIsNavigating(true);
      router.push(route);

      setTimeout(() => {
        setIsNavigating(false);
      }, 500);
    },
    [isNavigating, router]
  );

  return (
    <View className="flex flex-col justify-center items-center gap-4 w-full max-w-md px-6">
      <SimpleButton
        text="Entrar a la manada"
        textColor="black"
        backgroundColor="primary"
        customW="w-full"
        textSize="text-lg"
        onPress={() => onPress(registerRoute)}
        disabled={isNavigating}
      />
      <SimpleButton
        text="Ya tengo una cuenta"
        textColor="black"
        backgroundColor="accent"
        customW="w-full"
        textSize="text-lg"
        onPress={() => onPress(loginRoute)}
        disabled={isNavigating}
      />
      <SimpleButton
        text="Quiero crear una cuenta"
        textColor="primary"
        backgroundColor="transparent"
        customW="w-full"
        textSize="text-base"
        onPress={() => onPress(registerRoute)}
        disabled={isNavigating}
      />
    </View>
  );
}
