import "axios";

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_BASE_URL: string;
    APP_NAME: string;
    GOOGLE_WEB_CLIENT_ID: string;
    GOOGLE_IOS_CLIENT_ID: string;
    GOOGLE_SIGNIN_IOS_URL_SCHEME: string;
    EAS_PROJECT_ID: string;

    IOS_BUNDLE_IDENTIFIER: string;
    ANDROID_PACKAGE_NAME: string;
  }
}

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

declare global {
  type CustomColor =
    | "text"
    | "background"
    | "primary"
    | "secondary"
    | "accent"
    | "wrong"
    | "white"
    | "black"
    | "transparent";

  type CustomTextSize =
    | "text-xs"
    | "text-sm"
    | "text-base"
    | "text-lg"
    | "text-xl"
    | "text-2xl"
    | "text-3xl"
    | "text-4xl"
    | "text-5xl"
    | string;

  type TailwindColor = CustomColor;
  type TailwindTextSize = CustomTextSize;
  type TailwindSizeClass = string;
  type TextAlignOption = "left" | "center" | "right";

  interface ApiResponse<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
  }

  interface LoginResponse {
    token: string;
    refreshToken: string;
  }
}
