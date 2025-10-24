import Config from "@/constants/config";
import { getRefreshToken, saveTokens } from "@/utils/secureStore";
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const apiInstance: AxiosInstance = axios.create({ baseURL: Config.baseUrl });
const baseUrl = Config.baseUrl;
const REFRESH_URL = `${baseUrl}auth/refresh`;

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (
  error: AxiosError | string | null,
  token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      resolve({ _refreshError: true });
    } else if (token) {
      const headersObj = new AxiosHeaders((config.headers as any) || {});
      headersObj.set("Authorization", `Bearer ${token}`);
      const rawHeaders = headersObj.toJSON() as AxiosRequestHeaders;

      resolve(
        apiInstance({
          ...config,
          headers: rawHeaders,
        })
      );
    }
  });
  failedQueue = [];
};

const ApiContext = createContext<{ api: AxiosInstance } | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) throw new Error("useApi must be used within an ApiProvider");
  return context.api;
};

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const requestInterceptor = apiInstance.interceptors.request.use(
      async (config) => {
        const token = await (async () => {
          try {
            const mod = await import("@/utils/secureStore");
            return await mod.getAccessToken();
          } catch {
            return null;
          }
        })();

        if (token && config.url !== REFRESH_URL) {
          const headers = new AxiosHeaders(config.headers || {});
          headers.set("Authorization", `Bearer ${token}`);
          config.headers = headers.toJSON() as AxiosRequestHeaders;
        }
        return config;
      }
    );

    const responseInterceptor = apiInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          originalRequest.url !== REFRESH_URL
        ) {
          return new Promise(async (resolve, reject) => {
            failedQueue.push({ config: originalRequest, resolve, reject });

            if (!isRefreshing) {
              isRefreshing = true;
              try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) {
                  processQueue("No refresh token available.");
                  router.replace("/(auth)/logout");
                  return;
                }

                const refreshHeaders = new AxiosHeaders({
                  Authorization: `Bearer ${refreshToken}`,
                }).toJSON() as AxiosRequestHeaders;

                const { data } = await axios.post(
                  REFRESH_URL,
                  {},
                  {
                    headers: refreshHeaders,
                  }
                );

                await saveTokens(data.token, data.refreshToken);
                processQueue(null, data.token);
              } catch (err) {
                processQueue(err as AxiosError);
                router.replace("/(auth)/logout");
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
