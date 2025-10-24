import { useApi } from "@/context/ApiContext";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { Image } from "../CustomImage";
import SimpleButton from "../SimpleButton";
import TextInput from "../TextInput";

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
    formState: { errors, isValid, isSubmitting },
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="bg-black/70 flex-1 items-center justify-center p-5">
        <View className="w-full max-w-sm bg-primary/5 p-6 rounded-2xl shadow-xl border border-primary/20">
          <Pressable
            onPress={onClose}
            className="absolute top-3 right-3 p-2 active:opacity-70"
            disabled={isSubmitting}
          >
            <Image source={CloseIco} className="h-6 w-6" />
          </Pressable>

          <View className="mb-6 mt-2 gap-2">
            <Text className="text-primary font-itim text-center text-3xl">
              ¡Casi Listo!
            </Text>
            <Text className="text-text/80 font-itim text-center text-base">
              Pon la contraseña para acceder con Email.
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
              <TextInput
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
                footer={errors.password?.message}
                footerSize="text-xs"
              />
            )}
          />

          <SimpleButton
            text="Confirmar"
            customW="w-full"
            textColor="black"
            backgroundColor="primary"
            customH="h-14 mt-8"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
          />
        </View>
      </View>
      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-black/40 rounded-2xl">
          <ActivityIndicator size="large" color="#FABC66" />
        </View>
      )}
    </Modal>
  );
};

export default CreatePasswordModal;
