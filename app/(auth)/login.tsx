import Separator from "@/components/Separator";
import SimpleButton from "@/components/SimpleButton";
import TextInput from "@/components/TextInput";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FormData = {
  email: string;
  password: string;
};
export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, loginWithGoogle, isLoading } = useAuth();

  const EyeClose = require("@/assets/ico/ClosedEye.svg");
  const EyeOpen = require("@/assets/ico/OpenEye.svg");
  const EyeCloseWrong = require("@/assets/ico/ClosedEyeWrong.svg");
  const EyeOpenWrong = require("@/assets/ico/OpenEyeWrong.svg");

  const FOOTER_BOTTOM_PADDING = 16;
  const dynamicPaddingBottom = FOOTER_BOTTOM_PADDING + insets.bottom;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();

  const [ShowPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    clearErrors();

    try {
      const response = await login(data);

      if (response.success) {
        router.replace("/(home)");
      } else {
        setError("email", {
          message: response.message || "Error de inicio de sesión",
        });
        setError("password", {
          message: response.message || "Error de inicio de sesión",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("email", {
        message: "Error de conexión. Inténtalo de nuevo.",
      });
    } finally {
    }
  };

  const OnGoogleSignin = async () => {
    clearErrors();

    try {
      const response = await loginWithGoogle();

      if (response.success) {
        router.replace({
          pathname: "/(home)",
          params: {
            hasPassword: String(response.data ?? false),
          },
        });
      } else {
        setError("email", {
          type: "manual",
          message: response.message || "Error al iniciar sesión con Google.",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("email", {
        type: "manual",
        message: "Error de conexión durante el inicio de sesión con Google.",
      });
    }
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
              Bienvenido de nuevo
            </Text>

            <Text className="text-text/70 font-itim text-lg sm:text-xl mt-0.5">
              Inicia y comienza a controlar tus dispositivos
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
                  onChangeText={onChange}
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
          </View>
        </View>

        <View
          className="gap-4 pt-3"
          style={{ paddingBottom: dynamicPaddingBottom }}
        >
          <SimpleButton
            text="Acceder"
            textColor="black"
            backgroundColor="primary"
            customW="w-full"
            disabled={isLoading}
            customH="h-14"
            onPress={handleSubmit(onSubmit)}
          />

          <Separator
            text="O Inicia sesión con"
            textClass="text-base text-text/70"
            lineClass="bg-text/30 h-px"
          />

          <SimpleButton
            text="Iniciar con Google"
            textColor="black"
            backgroundColor="white"
            customH="h-14"
            customW="w-full"
            textSize="text-base"
            disabled={isLoading}
            icon={{
              source: require("@/assets/ico/GoogleIco.svg"),
              icoAlign: "left",
            }}
            border={{
              borderColor: "text",
              borderSize: 1,
            }}
            onPress={OnGoogleSignin}
          />

          <SimpleButton
            text="¡No tienes una cuenta? Créala!"
            textColor="primary"
            backgroundColor="transparent"
            customW="w-full"
            textSize="text-sm"
            customH="h-8"
            disabled={isLoading}
            onPress={() => router.replace("/(auth)/register")}
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
