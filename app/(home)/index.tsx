import Background from "@/components/background/Background";
import DeviceCard from "@/components/Cartd";
import CreatePasswordModal from "@/components/modals/CreatePasswordModal";
import SimpleButton from "@/components/SimpleButton";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const AddDeviceButton = () => {
  return (
    <SimpleButton
      text="Añadir nuevo dispositivo"
      textColor="accent"
      backgroundColor="transparent"
      customH="h-16"
      customW="w-full"
      border={{
        borderColor: "accent",
        borderSize: 2,
        borderStyle: "dashed",
      }}
      icon={{
        source: require("@/assets/ico/Plus-Yellow.svg"),
        icoAlign: "left",
        IcoSize: "h-10 w-10",
      }}
      rounded="sm"
    />
  );
};

const NoDeviceText = () => {
  return (
    <View>
      <Text className="text-text font-itim text-3xl text-center">
        ¡Muy solitario por aquí!
      </Text>
      <Text className="text-text/70 font-itim text-lg text-center">
        Añade tu Smart Feeder para empezar.
      </Text>
    </View>
  );
};

const Home = () => {
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const device = false;

  const { hasPassword } = useLocalSearchParams();

  const handleCloseModal = () => {
    setIsPasswordModalVisible(false);
  };

  useEffect(() => {
    if (hasPassword === "false") {
      setIsPasswordModalVisible(true);
    }
  }, [hasPassword]);

  return (
    <View className={`flex-1 items-center ${!device ? "justify-center" : ""}`}>
      <Background />
      <CreatePasswordModal
        isVisible={isPasswordModalVisible}
        onClose={handleCloseModal}
      />

      <View className="w-11/12">
        {device ? (
          <>
            <DeviceCard
              calories="120"
              deviceName="hola"
              lastUpdate="12m"
              nextMeal="2:30"
            />
          </>
        ) : (
          <View className="gap-8 items-center justify-center">
            <NoDeviceText />
            <AddDeviceButton />
          </View>
        )}
      </View>
    </View>
  );
};

export default Home;
