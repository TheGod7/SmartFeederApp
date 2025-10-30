import BottomBackground from "@/components/background/Background";
import Separator from "@/components/Separator";
import SimpleButton from "@/components/SimpleButton";
import TextInput from "@/components/TextInput";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FormData = { email: string; password: string };

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [ShowPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();
  const dynamicPaddingBottom = 16 + insets.bottom;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => isLoading
    );
    return () => backHandler.remove();
  }, [isLoading]);

  const handleLogin = async (data: FormData) => {
    clearErrors();
    try {
      const response = await login(data);
      if (response.success) router.replace("/(home)");
      else setFormErrors(response.message);
    } catch {
      setFormErrors("Error de conexión. Inténtalo de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    clearErrors();
    try {
      const response = await loginWithGoogle();
      if (response.success)
        router.replace({
          pathname: "/(home)",
          params: { hasPassword: String(response.data ?? false) },
        });
      else
        setFormErrors(
          response.message || "Error al iniciar sesión con Google."
        );
    } catch {
      setFormErrors(
        "Error de conexión durante el inicio de sesión con Google."
      );
    }
  };

  const setFormErrors = (message: string) => {
    setError("email", { message });
    setError("password", { message });
  };

  const EyeClose = require("@/assets/ico/ClosedEye.svg");
  const EyeOpen = require("@/assets/ico/OpenEye.svg");
  const EyeCloseWrong = require("@/assets/ico/ClosedEyeWrong.svg");
  const EyeOpenWrong = require("@/assets/ico/OpenEyeWrong.svg");

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <BottomBackground position="bottom" />
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
                  icoPressable
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
            customH="h-14"
            disabled={isLoading}
            onPress={handleSubmit(handleLogin)}
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
            border={{ borderColor: "text", borderSize: 1 }}
            onPress={handleGoogleLogin}
          />
          <SimpleButton
            text="¡No tienes una cuenta? Créala!"
            textColor="primary"
            backgroundColor="transparent"
            customW="w-full"
            textSize="text-sm"
            customH="h-auto"
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
