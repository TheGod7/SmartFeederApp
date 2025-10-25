import { useApi } from "@/context/ApiContext";
import { ImageBackground } from "expo-image";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Image } from "../CustomImage";
import SimpleButton from "../SimpleButton";
import TextInputComponent from "../TextInput";

type FormData = {
  password: string;
};

const EyeClose = require("@/assets/ico/ClosedEye.svg");
const EyeOpen = require("@/assets/ico/OpenEye.svg");
const EyeCloseWrong = require("@/assets/ico/ClosedEyeWrong.svg");
const EyeOpenWrong = require("@/assets/ico/OpenEyeWrong.svg");
const CloseIco = require("@/assets/ico/Close.svg");

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CreatePasswordModal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>();

  const [ShowPassword, setShowPassword] = useState(false);

  const api = useApi();
  const Error = !!errors.password;
  const IcoSource = !ShowPassword ? EyeClose : EyeOpen;
  const IcoWrongSource = !ShowPassword ? EyeCloseWrong : EyeOpenWrong;
  const Ico = Error ? IcoWrongSource : IcoSource;
  const Color = Error ? "wrong" : "primary";

  const placeholder = !ShowPassword
    ? "********************"
    : "ContraseñaSuperSegura";

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/change-password", data);

      if (response.status === 201) {
        onClose();
      }
    } catch (e) {
      setError("password", {
        message: "Error al cambiar la contraseña",
      });
    } finally {
      setLoading(false);
    }
  };

  const keyboardOffset = Platform.select({
    ios: 40,
    android: 0,
    default: 0,
  });

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={keyboardOffset}
        className="flex-1 items-center justify-center bg-background/40"
      >
        <View className="relative">
          <View className="absolute inset-0 w-96 h-72 bg-background rounded-2xl z-0" />

          <ImageBackground
            source={require("@/assets/background/Background.png")}
          >
            <View className="relative w-96 h-72 bg-secondary/10 rounded-lg z-10 border border-secondary/30 items-center px-5">
              <Pressable
                className="absolute top-0 right-0 active:opacity-60 z-20"
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Image
                  source={require("@/assets/ico/CloseRed.svg")}
                  className="w-10 h-10 "
                />
              </Pressable>

              <View>
                <Text className="text-primary text-4xl font-itim mt-2 text-center">
                  ¡Casi Listo!
                </Text>
                <Text className="text-text/70 text-base font-itim mt-2 text-center">
                  Pon la contraseña para acceder con email
                </Text>
              </View>

              <View className="mt-5">
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "La contraseña es requerida.",
                    minLength: {
                      value: 8,
                      message: "Debe tener al menos 8 caracteres.",
                    },
                  }}
                  render={({ field }) => (
                    <TextInputComponent
                      title="Contraseña"
                      placeholder={placeholder}
                      color={Color}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      value={field.value}
                      icoSource={Ico}
                      icoPressable
                      icoOnPress={() => setShowPassword(!ShowPassword)}
                      secureTextEntry={!ShowPassword}
                      footer={errors.password?.message || ""}
                      footerSize="text-xs"
                    />
                  )}
                />

                <SimpleButton
                  text="Confirmar"
                  customW="w-auto"
                  textColor="black"
                  backgroundColor="primary"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>

      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-black/40 rounded-2xl">
          <ActivityIndicator size="large" color="#FABC66" />
        </View>
      )}
    </Modal>
  );
};

export default CreatePasswordModal;
