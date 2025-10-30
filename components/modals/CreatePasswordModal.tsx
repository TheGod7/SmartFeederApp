import { useApi } from "@/context/ApiContext";
import { ImageBackground } from "expo-image";
import React, { useMemo, useState } from "react";
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

type FormData = { password: string };

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const EyeClose = require("@/assets/ico/ClosedEye.svg");
const EyeOpen = require("@/assets/ico/OpenEye.svg");
const EyeCloseWrong = require("@/assets/ico/ClosedEyeWrong.svg");
const EyeOpenWrong = require("@/assets/ico/OpenEyeWrong.svg");

const CreatePasswordModal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>();
  const [ShowPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const Ico = useMemo(
    () =>
      errors.password
        ? ShowPassword
          ? EyeOpenWrong
          : EyeCloseWrong
        : ShowPassword
          ? EyeOpen
          : EyeClose,
    [errors.password, ShowPassword]
  );

  const Color = errors.password ? "wrong" : "primary";
  const placeholder = ShowPassword
    ? "ContraseñaSuperSegura"
    : "********************";

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/change-password", data);
      if (response.status === 201) onClose();
      else setError("password", { message: "Error al cambiar la contraseña" });
    } catch {
      setError("password", { message: "Error al cambiar la contraseña" });
    } finally {
      setLoading(false);
    }
  };

  const keyboardOffset = Platform.select({ ios: 40, android: 0, default: 0 });

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
        <View className="relative w-96 h-80">
          <View className="absolute inset-0 w-full h-full bg-background rounded-2xl z-0" />

          <ImageBackground
            source={require("@/assets/background/Background.png")}
            className="relative w-full h-full"
          >
            <View className="relative w-full h-full bg-secondary/10 rounded-lg border border-secondary/30 items-center px-5 justify-center z-10">
              <Pressable
                className="absolute top-0 right-0 active:opacity-60 z-20"
                onPress={onClose}
                disabled={isSubmitting || loading}
              >
                <Image
                  source={require("@/assets/ico/CloseRed.svg")}
                  className="w-10 h-10"
                />
              </Pressable>

              <View className="mb-5 items-center">
                <Text className="text-primary text-4xl font-itim text-center">
                  ¡Casi Listo!
                </Text>
                <Text className="text-text/70 text-base font-itim text-center mt-2">
                  Pon la contraseña para acceder con email
                </Text>
              </View>

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

              <View className="w-full h-14 mt-5">
                <SimpleButton
                  text="Confirmar"
                  customW="w-full"
                  customH="h-14"
                  textColor="black"
                  backgroundColor="primary"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting || loading}
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
