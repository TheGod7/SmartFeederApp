import { Image } from "@/components/CustomImage";
import SimpleButton from "@/components/SimpleButton";
import { ImageBackground } from "expo-image";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface DeviceCardProps {
  id: string;
  deviceName: string;
  lastUpdate: string;
  nextMeal: string;
  calories: string;
}

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <View className="flex-row gap-2">
    <View className="mt-1.5">
      <Image source={icon} className="w-5 h-5" />
    </View>
    <View className="flex-1">
      <Text className="font-itim text-text/70 text-xl">{label}</Text>
      <Text className="font-itim text-accent text-lg">{value}</Text>
    </View>
  </View>
);

export default function DeviceCard({
  id,
  deviceName,
  lastUpdate,
  nextMeal,
  calories,
}: DeviceCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const contentMeasured = useRef(false);

  const handleViewCamera = () => {
    Alert.alert("Cámara", `Abrir cámara del dispositivo ${id}`);
  };

  const handleHorarios = () => {
    Alert.alert("Horarios", `Ajustar horarios del dispositivo ${id}`);
  };

  const handleStats = () => {
    Alert.alert("Estadísticas", `Ver estadísticas del dispositivo ${id}`);
  };

  const measureContent = (event: any) => {
    if (contentMeasured.current) return;

    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
    contentMeasured.current = true;

    if (!collapsed) {
      animatedHeight.setValue(height);
      animatedOpacity.setValue(1);
    }
  };

  const toggleCollapse = () => {
    if (contentHeight === 0) return;

    if (collapsed) {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: contentHeight,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }

    setCollapsed((prev) => !prev);
  };

  return (
    <ImageBackground
      source={require("@/assets/background/Background.png")}
      className="w-full"
      contentFit="cover"
    >
      <View className="w-full bg-secondary/10 border border-secondary/5 p-3 rounded-md gap-5 overflow-hidden">
        <View className="flex-row items-center">
          <View className="max-w-3/4">
            <Text className="font-itim text-accent text-2xl">{deviceName}</Text>
            <Text className="font-itim text-text/60 text-lg">
              Última actualización: {lastUpdate}
            </Text>
          </View>

          <Pressable
            onPress={toggleCollapse}
            className="items-center justify-center ml-auto active:opacity-50"
          >
            <Image
              source={
                collapsed
                  ? require("@/assets/ico/ArrowDown.svg")
                  : require("@/assets/ico/ArrowUp.svg")
              }
              className="h-14 w-14"
            />
          </Pressable>
        </View>

        <Animated.View
          style={{
            height: animatedHeight,
            opacity: animatedOpacity,
            overflow: "hidden",
          }}
        >
          <View
            onLayout={measureContent}
            style={{ position: "absolute", width: "100%" }}
          >
            <View className="gap-3">
              <InfoRow
                icon={require("@/assets/ico/ClockAccent.svg")}
                label="Próxima comida:"
                value={nextMeal}
              />
              <InfoRow
                icon={require("@/assets/ico/FireAccent.svg")}
                label="Calorías consumidas:"
                value={calories}
              />
            </View>

            <View className="flex-row gap-2 mt-3">
              <View className="flex-1">
                <SimpleButton
                  text="Ver Cámara"
                  textColor="black"
                  icon={{
                    source: require("@/assets/ico/Camera.svg"),
                    icoAlign: "left",
                  }}
                  backgroundColor="accent"
                  customW="w-full"
                  customH="h-[112px]"
                  padding="p-4"
                  onPress={handleViewCamera}
                />
              </View>

              <View className="flex-1 flex-col justify-between">
                <SimpleButton
                  text="Horarios"
                  textColor="text/70"
                  icon={{
                    source: require("@/assets/ico/ClockText.svg"),
                    icoAlign: "left",
                  }}
                  baseBackgroundColor="background"
                  backgroundColor="secondary/25"
                  textAlign="left"
                  border={{
                    borderColor: "secondary/25",
                    borderSize: 2,
                  }}
                  customW="w-full"
                  customH="h-[54px]"
                  padding="px-3 py-2"
                  onPress={handleHorarios}
                />
                <SimpleButton
                  text="Estadísticas"
                  textColor="text/70"
                  textAlign="left"
                  icon={{
                    source: require("@/assets/ico/StatsText.svg"),
                    icoAlign: "left",
                  }}
                  backgroundColor="secondary/25"
                  baseBackgroundColor="background"
                  border={{
                    borderColor: "secondary/25",
                    borderSize: 2,
                  }}
                  customW="w-full"
                  customH="h-[54px]"
                  padding="px-3 py-2"
                  onPress={handleStats}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}
