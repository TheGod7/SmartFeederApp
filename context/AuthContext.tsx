import Config from "@/constants/config";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/utils/secureStore";
import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import axios, { isAxiosError } from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const { baseUrl, googleWebClientId, googleIosClientId } = Config;

interface AuthContextProps {
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  tokensReady: boolean;
  login: (args: {
    email: string;
    password: string;
  }) => Promise<ApiResponse<boolean | undefined>>;
  register: (args: { email: string; password: string }) => Promise<ApiResponse>;
  loginWithGoogle: () => Promise<ApiResponse<boolean | undefined>>;
  logout: () => Promise<ApiResponse>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(
    undefined
  );
  const [refreshToken, setRefreshToken] = useState<string | null | undefined>(
    undefined
  );
  const [tokensReady, setTokensReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: googleWebClientId,
      iosClientId: googleIosClientId,
    });

    const load = async () => {
      try {
        const [aToken, rToken] = await Promise.all([
          getAccessToken(),
          getRefreshToken(),
        ]);
        setAccessToken(aToken ?? null);
        setRefreshToken(rToken ?? null);
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
      } finally {
        setTokensReady(true);
      }
    };

    load();
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<ApiResponse<boolean>> => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}auth/login`, {
        email,
        password,
      });
      setAccessToken(data.token);
      setRefreshToken(data.refreshToken);
      await saveTokens(data.token, data.refreshToken);
      return { success: true, message: "", data: data.hasPassword };
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        let message = error.response?.data?.message || "Error desconocido";
        if (status === 401) message = "Contraseña o email incorrectos";
        return { success: false, message };
      }
      return { success: false, message: "Error de conexión o desconocido" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}auth/register`, {
        email,
        password,
      });
      setAccessToken(data.token);
      setRefreshToken(data.refreshToken);
      await saveTokens(data.token, data.refreshToken);
      return { success: true, message: "" };
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        let message = error.response?.data?.message || "Error desconocido";
        if (status === 409) message = "Email ya registrado";
        return { success: false, message };
      }
      return { success: false, message: "Error de conexión o desconocido" };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<ApiResponse> => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        if (!idToken)
          return {
            success: false,
            message: "No se pudo obtener el token de Google.",
          };
        const apiResponse = await axios.post(`${baseUrl}auth/google-auth`, {
          idToken,
        });
        const { token, refreshToken, hasPassword } = apiResponse.data;
        setAccessToken(token);
        setRefreshToken(refreshToken);
        await saveTokens(token, refreshToken);
        return { success: true, message: "", data: hasPassword };
      }
      return {
        success: false,
        message: "Inicio de sesión con Google cancelado o fallido.",
      };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Error al autenticar con el servidor.";
        return { success: false, message };
      }
      return {
        success: false,
        message: "Error al intentar iniciar sesión con Google.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<ApiResponse> => {
    const prevAccessToken = accessToken ?? null;
    const prevRefreshToken = refreshToken ?? null;

    setAccessToken(null);
    setRefreshToken(null);
    setIsLoading(true);
    await clearTokens();

    try {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch {}

      if (prevAccessToken && prevRefreshToken) {
        try {
          await axios.post(
            `${baseUrl}auth/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${prevAccessToken}` },
            }
          );
        } catch (err) {
          console.warn("Logout API error (ignorado):", err);
        }
      }

      return { success: true, message: "" };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={
        {
          accessToken,
          refreshToken,
          tokensReady,
          login,
          loginWithGoogle,
          register,
          logout,
          isLoading,
        } as any
      }
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
