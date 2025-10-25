import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

const Config = {
  baseUrl: extra.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/",
  googleWebClientId: extra.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
  googleIosClientId: extra.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "",
};

export default Config;
