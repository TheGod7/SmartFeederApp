import Separator from "@/components/Separator";
import SimpleButton from "@/components/SimpleButton";
import TextInput from "@/components/TextInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { Controller, useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const EyeClose = require("@/assets/ico/ClosedEye.svg");
  const EyeOpen = require("@/assets/ico/OpenEye.svg");

  const EyeCloseWrong = require("@/assets/ico/ClosedEyeWrong.svg");
  const EyeOpenWrong = require("@/assets/ico/OpenEyeWrong.svg");

  const FOOTER_BOTTOM_PADDING = 16;
  const dynamicPaddingBottom = FOOTER_BOTTOM_PADDING + insets.bottom;

  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
    trigger,
  } = useForm<FormData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [ShowPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    const response = await register(data);

    if (response.success) {
      router.replace("/(auth)/login");
    } else {
      setError("email", {
        message: response.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#070A13" }}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <View className="flex-1 justify-between px-6 py-4 max-w-xl mx-auto w-full">
        <View className="gap-4">
          <View>
            <Text className="text-primary font-itim text-4xl sm:text-5xl">
              ¡Únete a la manada!
            </Text>
            <Text className="text-text/70 font-itim text-lg sm:text-xl mt-0.5">
              ¡Solo un paso más para tener el control total!
            </Text>
          </View>

          <View className="gap-6 mt-3">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Ingresa un correo electrónico válido",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  title="Email"
                  placeholder="simpleemail@gmail.com"
                  color={errors.email ? "wrong" : "primary"}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  footer={errors.email?.message || ""}
                />
              )}
            />

            <View className="gap-5">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 8,
                    message: "Debe tener al menos 8 caracteres.",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    title="Contraseña"
                    placeholder={
                      !ShowPassword
                        ? "********************"
                        : "ContraseñaSuperSegura"
                    }
                    icoPressable={true}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      trigger("confirmPassword");
                    }}
                    onBlur={onBlur}
                    icoOnPress={() => setShowPassword(!ShowPassword)}
                    icoSource={
                      !ShowPassword
                        ? errors.password
                          ? EyeCloseWrong
                          : EyeClose
                        : errors.password
                          ? EyeOpenWrong
                          : EyeOpen
                    }
                    secureTextEntry={!ShowPassword}
                    color={errors.password ? "wrong" : "primary"}
                    footer={errors.password?.message || ""}
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: "Confirmar contraseña es obligatorio",

                  validate: (value) =>
                    value === getValues("password") ||
                    "Las contraseñas no coinciden",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    title="Confirmar contraseña"
                    placeholder={
                      !ShowPassword
                        ? "¿Dónde se escondió la clave? "
                        : "Puedo verla... "
                    }
                    color={errors.confirmPassword ? "wrong" : "primary"}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    secureTextEntry={!ShowPassword}
                    footer={errors.confirmPassword?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <View
          className="gap-4 pt-3"
          style={{ paddingBottom: dynamicPaddingBottom }}
        >
          <SimpleButton
            text="Crear cuenta"
            textColor="black"
            backgroundColor="primary"
            customW="w-full"
            customH="h-14"
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
          />

          <Separator
            text="O regístrate con"
            textClass="text-base text-text/70"
            lineClass="bg-text/30 h-px"
          />

          <SimpleButton
            text="Registrarse con Google"
            textColor="black"
            backgroundColor="white"
            customH="h-14"
            customW="w-full"
            textSize="text-base"
            icon={{
              source: require("@/assets/ico/GoogleIco.svg"),
              icoAlign: "left",
            }}
            border={{
              borderColor: "text",
              borderSize: 1,
            }}
            disabled={isLoading}
            onPress={() => console.log("Google pressed")}
          />

          <SimpleButton
            text="¿Ya eres un usuario? Acceder!"
            textColor="primary"
            backgroundColor="transparent"
            customW="w-full"
            textSize="text-sm"
            customH="h-8"
            disabled={isLoading}
            onPress={() => router.replace("/(auth)/login")}
          />
        </View>
      </View>

      {isLoading && (
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 100 }}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
