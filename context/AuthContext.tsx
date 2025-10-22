import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/utils/secureStore";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { useApi } from "./ApiContext";

import { ApiResponse } from "@/.d";
import Config from "@/constants/config";

const baseUrl = Config.baseUrl;

interface AuthContextProps {
  accessToken: string | null;
  refreshToken: string | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<ApiResponse>;
  register: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<ApiResponse>;

  loginWithGoogle: (googleID: string) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { api } = useApi();

  useEffect(() => {
    Promise.all([getAccessToken(), getRefreshToken()]).then(
      ([accessToken, refreshToken]) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
      }
    );
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<ApiResponse> => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}auth/login`, {
        email,
        password,
      });

      setAccessToken(data.token);
      setRefreshToken(data.refreshToken);
      await saveTokens(data.token, data.refreshToken);

      return { success: true, message: "" };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        let message = error.response?.data?.message || "Error desconocido";
        if (status === 401) {
          message = "Contraseña o email incorrectos";
        }
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
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        let message = error.response?.data?.message || "Error desconocido";
        if (status === 409) {
          message = "Email ya registrado";
        }
        return { success: false, message };
      }
      return { success: false, message: "Error de conexión o desconocido" };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = (googleID: string): Promise<ApiResponse> => {
    console.log(`Login con Google ID: ${googleID}`);
    return Promise.resolve({
      success: false,
      message: "Login con Google no implementado",
    });
  };

  const logout = async (): Promise<ApiResponse> => {
    if (!accessToken && !refreshToken) {
      await clearTokens();
      return {
        success: true,
        message: "Logged out (already signed out locally)",
      };
    }

    setIsLoading(true);
    setAccessToken(null);
    setRefreshToken(null);

    try {
      await api.post(`/auth/logout`, {});
      await clearTokens();
    } catch (error) {
      await clearTokens();
    } finally {
      setIsLoading(false);
    }

    return {
      success: true,
      message: "",
    };
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        loginWithGoogle,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
