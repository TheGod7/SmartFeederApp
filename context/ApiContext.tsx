import Config from "@/constants/config";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/utils/secureStore";
import axios, { AxiosInstance } from "axios";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const apiInstance = axios.create({
  baseURL: Config.baseUrl,
});
const baseUrl = Config.baseUrl;

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  config: any;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(
        apiInstance({
          ...prom.config,
          headers: {
            ...prom.config.headers,
            Authorization: `Bearer ${token}`,
          },
        })
      );
    }
  });
  failedQueue = [];
};

interface ApiProviderProps {
  api: AxiosInstance;
}

const ApiContext = createContext<ApiProviderProps | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi debe usarse dentro de un ApiProvider");
  }
  return context;
};

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const requestInterceptor = apiInstance.interceptors.request.use(
      async (config) => {
        const accessToken = await getAccessToken();

        if (accessToken && !config.url?.endsWith("auth/refresh")) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      }
    );

    const responseInterceptor = apiInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (originalRequest.url?.endsWith("auth/refresh")) {
            router.replace("/(auth)/logout");
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          return new Promise(async (resolve, reject) => {
            failedQueue.push({ config: originalRequest, resolve, reject });

            if (!isRefreshing) {
              isRefreshing = true;

              try {
                const refreshToken = await getRefreshToken();

                if (!refreshToken) {
                  router.replace("/(auth)/logout");
                  processQueue("No refresh token available");
                  return reject(error);
                }

                const { data } = await axios.post(
                  `${baseUrl}auth/refresh`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${refreshToken}`,
                    },
                  }
                );

                await saveTokens(data.token, data.refreshToken);

                processQueue(null, data.token);
              } catch (err) {
                router.replace("/(auth)/logout");
                processQueue(err);
                return reject(err);
              } finally {
                isRefreshing = false;
              }
            }
          });
        }

        return Promise.reject(error);
      }
    );

    setIsApiInitialized(true);

    return () => {
      apiInstance.interceptors.request.eject(requestInterceptor);
      apiInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);

  if (!isApiInitialized) return null;

  return (
    <ApiContext.Provider value={{ api: apiInstance }}>
      {children}
    </ApiContext.Provider>
  );
};
